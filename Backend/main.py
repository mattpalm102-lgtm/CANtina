from CANSocket.websocket import make_app, broadcast_can_frame
# from CANSocket.CANInterface import start_can_listener
import tornado.ioloop
import uvicorn
import threading

if __name__ == "__main__":
    # Start Tornado WebSocket server on a different port
    tornado_app = make_app()
    tornado_port = 8001
    tornado_app.listen(tornado_port)
    print(f"Tornado WebSocket server running on port {tornado_port}")

    # Optionally run Tornado IOLoop in a separate thread so Uvicorn can run simultaneously
    tornado_thread = threading.Thread(target=tornado.ioloop.IOLoop.current().start)
    tornado_thread.start()

    # Start Uvicorn HTTP server on port 8000
    uvicorn.run("ScriptRunner.ScriptRunner:app", host="127.0.0.1", port=8000)

    # Start CAN listener (runs in its own thread or async task)
    # start_can_listener(broadcast_can_frame)
