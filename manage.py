import os
import unittest

import datetime

from flask import jsonify

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app import blueprint
from app.main import create_app, db, socketio
from app.main.model import user, message, game, room, game_user, room_user, follower_user
from app.main.model.game import Game
from app.main.model.user import User


from flask_cors import CORS

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

# Allow all CORS for /api/* endpoints
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    response_object = {
        'status': 'fail',
        'message': 'page not found'
    }
    return jsonify(response_object), 404

def init_db():
    # create new game when run app
    battle_ship = Game.query.filter_by(public_id="battle_ship").first()

    if battle_ship is None:
        battle_ship = Game(
            public_id="battle_ship",
            name="Battle Ship",
            num_players=2
        )
        db.session.add(battle_ship)
        db.session.commit()
    
    # create admin account when run app
    admin = User.query.filter_by(public_id="admin").first()

    if admin is None:
        admin = User(
            public_id="admin",
            username="admin",
            email="admin@email.com",
            password="admin",
            admin=True,
            registered_on=datetime.datetime.utcnow()
        )
        db.session.add(admin)
        db.session.commit()


app.register_error_handler(400, page_not_found)

app.register_blueprint(blueprint)

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def run():
    init_db()
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