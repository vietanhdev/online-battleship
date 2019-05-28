# app/__init__.py
from flask_restplus import Api
from flask import Blueprint

from .main.controller.user_controller import api as user_ns
from .main.controller.auth_controller import api as auth_ns
from .main.controller.message_controller import api as message_ns
from .main.controller.game_controller import api as game_ns
from .main.controller.socket_controller import *


blueprint = Blueprint('api', __name__)

    
api = Api(blueprint,
          title='FLASK RESTPLUS API',
          description='flask restplus web service'
          )

api.add_namespace(user_ns, path='/api/users')
api.add_namespace(auth_ns, path='/api/auth')
api.add_namespace(message_ns, path='/api/messages')
api.add_namespace(game_ns, path='/api/games')