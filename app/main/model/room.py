from .. import db

class Room(db.Model):
    """ Room Model for storing game room ralted details """
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(100), unique=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    game = db.relationship("Game")
    history = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False)

    users = db.relationship('RoomUser', back_populates='room')