from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import sys
import tempfile
import os
from typing import Dict
from collections import deque

app = FastAPI()

CAN_BUFFER_SIZE = 5000
can_frames = deque(maxlen=CAN_BUFFER_SIZE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Script(BaseModel):
    code: str

@app.post("/run")
def run_script(script: Script):
    file_path = None
    try:
        user_code = script.code
        runner_dir = os.path.dirname(os.path.abspath(__file__))

        full_code = f"""
import sys
sys.path.insert(0, r"{runner_dir}")
from CANtina import read, write
{user_code}
"""

        with tempfile.NamedTemporaryFile(
            suffix=".py",
            mode="w",
            delete=False,
            dir=runner_dir
        ) as f:
            f.write(full_code)
            file_path = f.name

        result = subprocess.run(
            [sys.executable, file_path],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=runner_dir
        )

        return {
            "stdout": result.stdout.splitlines(),
            "stderr": result.stderr.splitlines(),
        }

    except subprocess.TimeoutExpired:
        return {"stdout": [], "stderr": ["Error: Script timed out"]}
    except Exception as e:
        return {"stdout": [], "stderr": [f"Error: {str(e)}"]}
    finally:
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Failed to delete temp script {file_path}: {e}")

@app.post("/frame")
def ingest_frame(frame: Dict):
    can_frames.append(frame)
    return {"status": "ok"}

@app.get("/read")
def read_frame():
    if can_frames:
        return can_frames.popleft()
    return {"status": "empty"}
