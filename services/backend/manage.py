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

app = create_app(os.getenv('APP_ENV') or 'development')

def init_db():

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


app.register_blueprint(blueprint)

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@manager.command
def run():
    init_db()
    socketio.run(app,
                host='0.0.0.0',
                port=5000,
                use_reloader=True)
    

@manager.command
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('app/test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


# Recreate DB if needed
import os
if os.getenv('RECREATE_DB') == "true":
    recreate_db()

# Init battleship game and admin account
db.create_all()
init_db()


if __name__ == '__main__':
    manager.run()
