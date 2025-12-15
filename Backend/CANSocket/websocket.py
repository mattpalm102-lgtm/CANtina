import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from tornado.ioloop import PeriodicCallback
from CANSocket.CANInterface import connectDevice, messageStub
import threading
import time
import can
import requests

clients = set()
can_rx_thread = None
can_rx_running = False
main_io_loop = None
FASTAPI_URL = "http://127.0.0.1:8000/frame"

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("CANtina WebSocket Server Running")

class CANSendHandler(tornado.web.RequestHandler):
    def post(self):
        global CANDevice

        try:
            data = json.loads(self.request.body)

            can_id = int(data["id"])
            payload = data["data"]
            extended = data.get("ext", can_id > 0x7FF)

            msg = can.Message(
                arbitration_id=can_id,
                data=payload,
                is_extended_id=extended,
            )

            CANDevice.send(msg)

            self.write({"status": "sent"})

        except Exception as e:
            self.set_status(400)
            self.write({"error": str(e)})


class CANWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")
        clients.add(self)

    def on_message(self, message):
        global can_rx_thread, can_rx_running

        print(f"Received message: {message}")
        msg = json.loads(message)

        if msg.get("command") == "Connection":
            data = msg.get("data", {})

            try:
                # Stop existing RX thread
                if can_rx_running:
                    can_rx_running = False
                    if can_rx_thread:
                        can_rx_thread.join(timeout=2)

                CANDevice = connectDevice(
                    type=data.get("deviceType", "peak"),
                    baud=data.get("baudRate", 500000),
                    termination=data.get("termination") == "120Ω"
                )

                can_rx_thread = threading.Thread(
                    target=can_rx_loop,
                    args=(CANDevice, handle_can_frame),
                    daemon=True
                )
                can_rx_thread.start()

                print("CAN RX thread started")

            except Exception as e:
                print(f"Connection error: {e}")


    def on_close(self):
        global can_rx_running

        print("WebSocket closed")
        clients.remove(self)

        if not clients:
            can_rx_running = False

    def check_origin(self, origin):
        return True

def can_rx_loop(bus: can.Bus, on_frame):
    global can_rx_running
    can_rx_running = True

    while can_rx_running:
        try:
            msg = bus.recv(timeout=1.0)  # blocks up to 1 second
            if msg is None:
                continue

            on_frame(msg)

        except Exception as e:
            print(f"CAN RX error: {e}")
            time.sleep(0.1)

def handle_can_frame(msg: can.Message):
    payload = {
        "command": "can_frame",
        "data": {
            "id": msg.arbitration_id,
            "extended": msg.is_extended_id,
            "dlc": msg.dlc,
            "data": list(msg.data),
            "timestamp": msg.timestamp,
        }
    }
    try:
        requests.post(FASTAPI_URL, json=payload["data"], timeout=0.05)
    except requests.RequestException:
        pass  # drop frame if backend is busy
    send_to_frontend(payload)

def send_to_frontend(data: dict):
    if main_io_loop is None:
        print("ERROR: Tornado IOLoop not initialized")
        return

    msg = json.dumps(data)

    for client in list(clients):
        def _send(c=client):
            try:
                c.write_message(msg)
            except tornado.websocket.WebSocketClosedError:
                clients.discard(c)

        main_io_loop.add_callback(_send)


def broadcast_stub(msg):
    """
    Convert stub message to frontend JSON format and broadcast.
    """
    frame_dict = {
        "command": "can_frame",
        "data": {
            "id": msg.arbitration_id,
            "data": list(msg.data),
            "timestamp": msg.timestamp,
            "is_extended_id": msg.is_extended_id,
            "is_remote_frame": msg.is_remote_frame,
        }
    }
    send_to_frontend(frame_dict)

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ws", CANWebSocket),
        (r"/send", CANSendHandler),
    ])

def set_main_io_loop(loop):
    global main_io_loop
    main_io_loop = loop

if __name__ == "__main__":
    app = make_app()
    app.listen(8001)
    print("Server listening on port 8001")
    tornado.ioloop.IOLoop.current().start()
