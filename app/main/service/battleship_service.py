from app.main import db
import json


def translate_history_battleship(history):
    boards = {}
    for each in boards_and_ships:
        pass
    return boards

def get_history_battleship(user, room):
    history = json.loads(room.history)
    print(history)
    response_object = {}
    response_object['is_enough_players'] = room.is_enough_players()
    response_object['is_player'] = room.is_player()
    response_object['boards'] = translate_history_battleship(history)
    return response_object


def enter_command(user, room, command):
    pass