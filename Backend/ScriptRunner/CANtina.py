# Backend/ScriptRunner/CANtina.py
from typing import List, Dict
import time

# Example in-memory CAN bus data
_can_bus_frames = []

def inject_frame(frame: Dict):
    """Internal: inject a frame into the bus (simulate incoming CAN frames)"""
    _can_bus_frames.append(frame)

def read() -> List[Dict]:
    """Return all frames currently on the bus"""
    return _can_bus_frames.copy()

def write(can_id: int, data: List[int]):
    """Send a CAN frame (simulated)"""
    frame = {
        "timestamp": time.time(),
        "can_id": can_id,
        "data": data
    }
    _can_bus_frames.append(frame)
    return frame

def log(filename: str):
    """Save current frames to a file"""
    import json
    with open(filename, "w") as f:
        json.dump(_can_bus_frames, f)

def clear():
    """Clear all frames"""
    _can_bus_frames.clear()
