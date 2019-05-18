import os
import unittest

from flask import jsonify

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app import blueprint
from app.main import create_app, db, socketio
from app.main.model import user, message, game, room, game_user, room_user, follower_user

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    response_object = {
        'status': 'fail',
        'message': 'page not found'
    }
    return jsonify(response_object), 404


app.register_error_handler(400, page_not_found)

app.register_blueprint(blueprint)

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

# socketio = SocketIO(app)

manager.add_command('db', MigrateCommand)

@manager.command
def run():
    # app.run()
    socketio.run(app,
                host='127.0.0.1',
                port=5000,
                use_reloader=False)

@manager.command
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('app/test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


if __name__ == '__main__':
    manager.run()