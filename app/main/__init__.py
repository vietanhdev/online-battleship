from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_cors import CORS

from .config import config_by_name

import redis

db = SQLAlchemy()
r_db = redis.Redis(host='localhost', port=8183, db=0)
flask_bcrypt = Bcrypt()
socketio = SocketIO()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    CORS(app)
    db.init_app(app)
    flask_bcrypt.init_app(app)
    socketio.init_app(app)

    return app