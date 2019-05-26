from .. import db

class RoomUser(db.Model):
    """ GameRoom Model for storing room and user association related details """
    __tablename__ = "room_users"

    room_id = db.Column('room_id', db.Integer, db.ForeignKey('rooms.id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
    creator = db.Column(db.Boolean, nullable=False)
    is_win = db.Column(db.Boolean, default=False)

    room = db.relationship('Room', back_populates='users')
    user = db.relationship('User', back_populates='rooms')