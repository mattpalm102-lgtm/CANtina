from CANSocket.websocket import make_app, broadcast_can_frame
import tornado.ioloop
import uvicorn
import threading

if __name__ == "__main__":
    tornado_app = make_app()
    tornado_port = 8001
    tornado_app.listen(tornado_port)
    print(f"Tornado WebSocket server running on port {tornado_port}")

    tornado_thread = threading.Thread(target=tornado.ioloop.IOLoop.current().start)
    tornado_thread.start()

    uvicorn.run("ScriptRunner.ScriptRunner:app", host="127.0.0.1", port=8000)
