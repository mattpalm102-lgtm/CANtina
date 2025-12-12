import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from tornado.ioloop import PeriodicCallback
from CANSocket.CANInterface import connectDevice, messageStub

clients = set()
CANDevice = None
stub_callback = None

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("CANtina WebSocket Server Running")

class CANWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")
        clients.add(self)

    def on_message(self, message):
        global CANDevice, stub_callback

        print(f"Received message: {message}")
        msg = json.loads(message)

        if msg.get("command") == "Connection":
            data = msg.get("data", {})
            try:
                CANDevice = connectDevice(
                    type=data.get("deviceType", "peak"),
                    baud=data.get("baudRate", 500000),
                    termination=data.get("termination") == "120Ω"
                )

                # Start sending stub message every 1000 ms
                stub = messageStub()

                if stub_callback:
                    stub_callback.stop()

                stub_callback = PeriodicCallback(
                    lambda: broadcast_stub(stub),
                    1000
                )
                stub_callback.start()

                print("Stub sender started. Sending every 1 second.")

            except Exception as e:
                print(f"Connection error: {e}")

    def on_close(self):
        print("WebSocket closed")
        clients.remove(self)

    def check_origin(self, origin):
        return True

def send_to_frontend(data: dict):
    """
    Send arbitrary JSON data to all connected clients.
    """
    msg = json.dumps(data)
    io_loop = tornado.ioloop.IOLoop.current()

    for client in list(clients):
        def _send(c=client):
            try:
                c.write_message(msg)
            except tornado.websocket.WebSocketClosedError:
                clients.discard(c)

        io_loop.add_callback(_send)
def broadcast_can_frame(frame):
    """
    Broadcast a CAN frame to all connected clients.
    """
    send_to_frontend(frame)

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
    broadcast_can_frame(frame_dict)

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ws", CANWebSocket),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8001)
    print("Server listening on port 8001")
    tornado.ioloop.IOLoop.current().start()
