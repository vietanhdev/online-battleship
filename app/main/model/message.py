from .. import r_db, db
import datetime

class Message(db.Model):
    """ Message Model for storing messages related details """
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_public_id = db.Column(db.String(100), nullable=False)
    receiver_public_id = db.Column(db.String(100), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def get_message_information(self):
        data = {}
        data['content'] = self.content
        data['sender_public_id'] = self.content
        return data
    
    def __repr__(self):
        return "<Message '{}'>".format(self.content)