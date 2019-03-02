from .. import db

class GameUser(db.Model):
    """ GameUser Model for storing record game of user related details """
    __tablename__ = "game_users"

    game_id = db.Column('game_id', db.Integer, db.ForeignKey('games.id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
    has_won = db.Column(db.Integer)
    matches = db.Column(db.Integer)

    game = db.relationship('Game', back_populates='users')
    user = db.relationship('User', back_populates='games')
    