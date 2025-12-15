from CANSocket.websocket import make_app, set_main_io_loop
import tornado.ioloop
import uvicorn
import threading

def start_tornado():
    app = make_app()
    app.listen(8001)
    print("Tornado WebSocket server running on port 8001")

    io_loop = tornado.ioloop.IOLoop.current()

    set_main_io_loop(io_loop)

    io_loop.start()



if __name__ == "__main__":
    tornado_thread = threading.Thread(target=start_tornado, daemon=True)
    tornado_thread.start()

    uvicorn.run(
        "ScriptRunner.ScriptRunner:app",
        host="127.0.0.1",
        port=8000
    )
