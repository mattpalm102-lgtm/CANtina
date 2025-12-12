import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from CANSocket.CANInterface import connectDevice

# Store connected clients
clients = set()
CANDevice = None

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("CANtina WebSocket Server Running")

class CANWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")
        clients.add(self)

    def on_message(self, message):
        print(f"Received message: {message}")
        # Optionally broadcast received messages to all clients
        msg = json.loads(message)
        if msg.get("command") == "Connection":
            try:
                CANDevice = connectDevice(
                    type=msg.get("type", "peak"),
                    baud=msg.get("baud", 500000),
                    termination=msg.get("termination", False)
                )
                CANDevice.on_receive(self.handle_can_frame)
                
            except Exception as e:
                print(f"Connection error: {e}")
            print(f"Connection command received: {message}")

    def on_close(self):
        print("WebSocket closed")
        clients.remove(self)

    def check_origin(self, origin):
        return True  # Allow all origins for dev purposes
    
    def handle_can_frame(frame):
        """Handle incoming CAN frames and broadcast to clients."""
        frame_dict = {
            "id": frame.arbitration_id,
            "data": list(frame.data),
            "timestamp": frame.timestamp,
            "is_extended_id": frame.is_extended_id,
            "is_remote_frame": frame.is_remote_frame,
        }
        broadcast_can_frame(frame_dict)

def broadcast_can_frame(frame: dict):
    """Send a CAN frame to all connected clients."""
    for client in clients:
        tornado.ioloop.IOLoop.current().add_callback(lambda: client.write_message(json.dumps(frame)))

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ws", CANWebSocket),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8000)
    print("Server listening on port 8000")
    tornado.ioloop.IOLoop.current().start()
