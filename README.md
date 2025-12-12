# CANtina

CANtina is an open-source, next-generation CAN bus analysis tool built with a
**React (TypeScript) front-end** and a **Python (FastAPI) backend**.

Designed to be **clean, fast, friendly, and extendable**, CANtina brings a modern
UI/UX to automotive diagnostics, embedded development, and CAN data exploration.

---

## Project Status
🚧 **Active development** (started Dec 2025)

Core architecture and primary UI views are in place.  
Live demo, packaging, and extended device support are planned for future releases.

---

## Supported Hardware
- **PEAK PCAN** devices (initial support)
- **CANtina BLE Device** (upcoming support)

### Device Drivers
To use a PEAK device, install the official drivers:
https://www.peak-system.com/Drivers.523.0.html?&L=1

> Note: Hardware drivers are required in addition to Python dependencies.

### Prerequisites
- Python 3.10+
- Node.js 18+
- Supported CAN hardware drivers installed (if using real hardware)

---

## Features
- Real-time CAN frame monitoring
- Message filtering and inspection
- Python scripting interface for automation
- Modular, extendable architecture

---

## Getting Started
```bash
cd Backend
pip install -r requirements.txt
cd ../Frontend/CANtina
npm install
npm start
```

npm start launches the React frontend and automatically starts the Python backend.

## Screenshots
![CANtina Home Screen](<CANtina Home.png>)

![CANtina Connection Page](<CANtina Connection Page.png>)

![CANtina Scripting Interface](<CANTina Scripting Interface.png>)