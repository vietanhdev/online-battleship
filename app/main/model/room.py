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

    def get_room_information(self):
        data = {}
        data['room_public_id'] = self.public_id
        data['game_public_id'] = self.game.public_id
        data['history'] = self.history
        data['players'] = []
        room_users = self.users
        for room_user in room_users:
            user = room_user.user
            data['players'].append(user.get_user_information())
        return data

    def check_num_player(self):
        print(type(self.game.num_players))
        print(self.game.num_players)
        print(len(self.users))
        if len(self.users) < self.game.num_players:
            return True
        return False