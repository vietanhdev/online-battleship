from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_cors import CORS

from .config import config_by_name
import logging
import redis
import eventlet
import os

db = SQLAlchemy()

r_db = redis.Redis(host='localhost', port=6379, db=0)
r_db.flushdb()
flask_bcrypt = Bcrypt()
socketio = SocketIO()

# Limit socketio log
logging.getLogger('socketio').setLevel(logging.ERROR)
logging.getLogger('engineio').setLevel(logging.ERROR)

def create_app(config_name):

    client_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../client')
    print(client_folder)
    app = Flask(__name__, static_folder=client_folder)
    app.config.from_object(config_by_name[config_name])
    CORS(app)
    db.init_app(app)
    flask_bcrypt.init_app(app)
    socketio.init_app(app, async_mode='eventlet', logger=False, engineio_logger=False, cors_allowed_origins="*")

    return app