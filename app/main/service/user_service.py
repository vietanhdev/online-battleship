import uuid
import datetime

from app.main import db
from app.main.model.user import User
from app.main.model.follower_user import FollowerUser

from ..config import admin_key

def save_new_user(data):
    password=data.get('password')
    if password is not None and len(password) == 0 :
        response_object = {
            "errors": {
                "password": "'password' length must not be an empty string"
            },
            "message": "Input payload validation failed"
        }
        return response_object, 400
    
    user = User.query.filter_by(email=data.get('email')).first()
    if not user:
        new_user = User(
            public_id="",
            email=data.get('email'),
            username=data.get('username'),
            password=password,
            registered_on=datetime.datetime.utcnow()
        )

        # Get new user id
        db.session.add(new_user)
        db.session.flush()

        # Create user public id
        new_user.public_id = str(10000 + new_user.id)

        # Commit changes
        db.session.commit()

        return generate_token(new_user)
        
    response_object = {
        'status': 'fail',
        'message': 'User already exists. Please Log in.',
    }
    return response_object, 409


def save_updated_user(user, data):
    if 'email' in data.keys():
        email = data['email']
        if email == user.email:
            pass
        else:
            check_email = User.query.filter_by(email=email).first()
            if check_email :
                response_object = {
                    'status': 'fail',
                    'message': 'Email address has been taken.',
                }
                return response_object, 409
            user.email = email

    if 'username' in data.keys():
        user.username = data['username']
    
    if 'bio' in data.keys():
        user.bio = data['bio']

    save_changes(user)
    response_object = {
        'status': 'success',
        'message': 'Successfully update profile.'
    }
    return response_object, 200


def save_updated_password(user, new_password):
    user.password = new_password
    save_changes(user)
    response_object = {
        'status': 'success',
        'message': 'Successfully update new password.'
    }
    return response_object, 200


def update_admin_user(user, key):
    print(key, admin_key)
    if key == admin_key:
        user.admin = True
        save_changes(user)
        response_object = {
            'status': 'success',
            'message': 'Successfully update to admin account.'
        }
        return response_object, 200

    response_object = {
        'status': 'fail',
        'message': 'The admin secret key not right.'
    }
    return response_object, 403


def get_all_users():
    list_user =  User.query.all()
    data = []
    for user in list_user:
        data.append(user.get_user_information())
    
    response_object = {
        'status': 'success',
        'data': data
    }

    return response_object, 200


def get_a_user(public_id):
    user = User.query.filter_by(public_id=public_id).first()
    return user


def get_a_user_by_id(id):
    user = User.query.filter_by(id=id).first()
    return user


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()


def generate_token(user):
    try:
        # generate the auth token
        auth_token = user.encode_auth_token(user.id)
        response_object = {
            'status': 'success',
            'message': 'Successfully registered.',
            'Authorization': auth_token.decode()
        }
        return response_object, 201

    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': e
        }
        return response_object, 500


def save_new_follower(follower, user):
    new_association = FollowerUser(
        follower_id=follower.id,
        user_id=user.id
    )
    save_changes(new_association)
    response_object = {
        'status': 'success',
        'message': 'create friendship successfully'
    }
    return response_object, 200


def delete_follower(follower, user):
    association = FollowerUser.query.filter_by(follower_id=follower.id, user_id=user.id).first()
    if association is not None:
        db.session.delete(association)
        save_changes()
        response_object = {
            'status': 'success',
            'message': 'delete friendship successfully'
        }
        return response_object, 200
    response_object = {
        'status': 'fail',
        'message': 'the friendship does not exist'
    }
    return response_object, 400


def get_all_followers(user):
    print(user.id)
    list_association = FollowerUser.query.filter_by(user_id=user.id).all()
    data = {}
    print(list_association)
    if list_association is not None:
        for association in list_association:
            follower_id = association.follower_id
            user = get_a_user_by_id(follower_id)
            if user is None:
                data[follower_id] = None
            else:
                data[follower_id] = user.get_user_information()
    response_object = {
        'status': 'success',
        'data': data
    }
    return response_object, 200


def get_all_followings(user):
    list_association = FollowerUser.query.filter_by(follower_id=user.id).all()
    data = []
    print(list_association)
    if list_association is not None:
        for association in list_association:
            user_id = association.user_id
            user = get_a_user_by_id(user_id)
            if user:
                data.append(user.get_user_information())
    response_object = {
        'status': 'success',
        'data': data
    }
    return response_object, 200