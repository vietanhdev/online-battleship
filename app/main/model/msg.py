from .. import r_db, db
import datetime

class Msg(db.Model):
    """ Msg Model for storing messages related details """
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    is_private = db.Column(db.Boolean, nullable=False, default=True)
    
    def __repr__(self):
        return "<Message '{}'>".format(self.content)