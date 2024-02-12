workers = 4
worker_class = "geventwebsocket.gunicorn.workers.GeventWebSocketWorker"  # Use this import for GeventWebSocketWorker
bind = "0.0.0.0:55556"
timeout = 60
loglevel = "info"
