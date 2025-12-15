# Backend/ScriptRunner/CANtina.py
from typing import List
import time
from ScriptRunner import can_frames
import requests
FASTAPI_URL = "http://127.0.0.1:8000/read"
TORNADO_SEND_URL = "http://127.0.0.1:8001/send"


def read():
    r = requests.get(FASTAPI_URL, timeout=0.2)
    if r.status_code == 200:
        return r.json()
    return {"status": "error"}

def write(can_id: int, data: List[int]):
    """Send a CAN frame (needs testing)"""
    frame = {
        "id": can_id,
        "data": data,
        "ext": can_id > 0x7FF,
    }

    try:
        r = requests.post(TORNADO_SEND_URL, json=frame, timeout=0.2)
        r.raise_for_status()
        return True
    except requests.RequestException as e:
        print("CAN send failed:", e)
        return False