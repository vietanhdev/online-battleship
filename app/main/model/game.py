from .. import db

class Game(db.Model):
    """ Game Model for storing game ralted details """
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    link_image = db.Column(db.String(255))
    link_game = db.Column(db.String(255))
    num_players = db.Column(db.Integer)

    users = db.relationship('GameUser', back_populates='game')

    def get_game_information(self):
        data = {}
        data['public_id'] = self.public_id
        data['name'] = self.name
        data['link_game'] = self.link_game
        data['link_image'] = self.link_image
        data['num_players'] = self.num_players
        return data