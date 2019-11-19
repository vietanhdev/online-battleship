from flask import g, request

from ..service.socket_service import get_user_and_receiver, get_user_by_sid, get_room_by_sid, login_socket, login_room_socket, user_get_in_room, user_get_out_room, get_online_followings, user_online, user_offline, get_list_users_in_room, get_list_users_infor_in_room
from ..service.battleship_service import get_data, process_command
from ..service.message_service import save_new_message
from .. import socketio

from flask_socketio import disconnect, join_room, leave_room, emit, rooms

from ..service.blazeface.blazeface_service import BlazeFaceService

import json

import base64
from PIL import Image
import cv2
from io import StringIO
import numpy as np


blazeface_service = BlazeFaceService()

@socketio.on('connect')
def connectClient():
    print(">>>>>>>>> Client connected on rooth path with session id " + request.sid)

def readb64(uri):
    uri_parts = uri.split(',')
    if len(uri_parts) != 2:
        return None
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

@socketio.on('image', namespace='/')
def newImage(request_object):
    data = request_object['data']

    if data is None or data == "":
        return

    cvimg = readb64(data)

    img_rgb = cv2.cvtColor(cvimg, cv2.COLOR_BGR2RGB)
    draw = blazeface_service.inference(img_rgb)
    draw_bgr = cv2.cvtColor(draw, cv2.COLOR_RGB2BGR)

    retval, buffer = cv2.imencode('.jpg', draw_bgr)
    draw_base64 = "data:image/png;base64,{}".format(base64.b64encode(buffer).decode("utf-8"))
    
    cv2.imshow("Debug", draw_bgr)
    cv2.waitKey(1)

    # Notify sender response result
    emit('image_back', draw_base64, broadcast=False, namespace='/')
