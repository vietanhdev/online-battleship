from .. import db

class FollowerUser(db.Model):
    """ FollowerUser Model for storing follower and following """
    __tablename__ = "follower_users"

    follower_id = db.Column('follower_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)