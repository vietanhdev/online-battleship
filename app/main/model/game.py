from .. import db

class Game(db.Model):
    """ Game Model for storing game ralted details """
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    link_image = db.Column(db.String(255))
    link_game = db.Column(db.String(255))

    users = db.relationship('GameUser', back_populates='game')