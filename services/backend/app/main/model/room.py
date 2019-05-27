from .. import db
import datetime
import json

def default(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.timestamp()

class Room(db.Model):
    """ Room Model for storing game room ralted details """
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(100), unique=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    game = db.relationship("Game")
    history = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False)

    users = db.relationship('RoomUser', back_populates='room')

    def get_room_information(self):
        data = {}
        data['room_public_id'] = self.public_id
        data['game'] = {}
        data['game']['name'] = self.game.name
        data['game']['public_id'] = self.game.public_id
        data['players'] = []
        data['created_at'] = json.dumps(self.created_at, default = default)
        room_users = self.users
        for room_user in room_users:
            # print("id ", room_user.id)
            user = room_user.user
            user_infor = user.get_user_information()
            user_infor['creator'] = room_user.creator
            user_infor['winner'] = room_user.is_win 
            data['players'].append(user_infor)
        return data
    
    def get_dict_id(self):
        data = {}
        data['game_id'] = self.game.id
        data['players'] = []
        room_users = self.users
        for room_user in room_users:
            user = room_user.user
            data['players'].append(user.id)

    def is_enough_players(self):
        if len(self.users) == self.game.num_players:
            return True
        return False
    
    def get_num_player(self):
        return len(self.users)

    def get_players(self):
        room_users = self.users
        list_players = []
        # creator = False
        for room_user in room_users:
            # print("id ", room_user.id)
            player = room_user.user
            list_players.append(player)
        return list_players
    
    def check_exist_player(self, user):
        room_users = self.users
        for room_user in room_users:
            player = room_user.user
            if user == player:
                return True
        return False

    def get_winner_id(self):
        room_users = self.users
        for room_user in room_users:
            player = room_user.user
            is_win = room_user.is_win
            if is_win:
                return player.public_id
        return ''

    def get_rival(self, user):
        room_users = self.users
        if self.check_exist_player:
            for room_user in room_users:
                player = room_user.user
                if user != player:
                    return player
        else:
            return None