from .. import r_db, db, flask_bcrypt
import datetime
from ..config import key
import jwt


class User(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    public_id = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(50))
    password_hash = db.Column(db.String(100))

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return flask_bcrypt.check_password_hash(self.password_hash, password)

    @staticmethod
    def encode_auth_token(user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=5),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                key,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: list|string
        """
        try:
            payload = jwt.decode(auth_token, key)
            is_blacklisted_token = r_db.get(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                exp_obj_time = datetime.datetime.fromtimestamp(payload['exp'])
                remain_sec = (exp_obj_time - datetime.datetime.utcnow()).total_seconds()
                return [payload['sub'], remain_sec]
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
    

    @staticmethod
    def get_exp_time(auth_token):
        """
        Decodes the auth token
        :param auth_token
        :return: float|string
        """
        try:
            payload = jwt.decode(auth_token, key)
            time = float(payload['iat'])
            obj_time = datetime.datetime.fromtimestamp(float(payload['iat']))
            return time
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


    def __repr__(self):
        return "<User '{}'>".format(self.username)
