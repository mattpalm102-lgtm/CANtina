from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import sys
import tempfile
app = FastAPI()

# Allow requests from frontend (Vite default port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Script(BaseModel):
    code: str

@app.post("/run")
def run_script(script: Script):
    try:
        user_code = script.code
        full_code = '\n\n' + user_code

        # Save user code to a temp file
        with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
            f.write(full_code)
            file_path = f.name

        # Run the script and capture output
        result = subprocess.run(
            [sys.executable, file_path],
            capture_output=True,
            text=True,
            timeout=5  # prevents infinite loops
        )

        return {
            "stdout": result.stdout.splitlines(),
            "stderr": result.stderr.splitlines(),
        }
    except subprocess.TimeoutExpired:
        return {"stdout": [], "stderr": ["Error: Script timed out"]}
    except Exception as e:
        return {"stdout": [], "stderr": [f"Error: {str(e)}"]}

