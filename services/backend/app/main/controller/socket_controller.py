from flask import g, request

from ..service.socket_service import get_user_and_receiver, get_user_by_sid, get_room_by_sid, login_socket, login_room_socket, user_get_in_room, user_get_out_room, get_online_followings, user_online, user_offline, get_list_users_in_room, get_list_users_infor_in_room
from ..service.battleship_service import get_data, process_command
from ..service.message_service import save_new_message
from .. import socketio

from flask_socketio import disconnect, join_room, leave_room, emit, rooms

from ..service.face_detection.blazeface.blazeface_service import BlazeFaceService
from ..service.face_detection.faceboxes.faceboxes_service import FaceboxesService

from ..service.head_pose_estimation.deep_head_pose.headpose_service import DeepHeadPoseService

from ..config import FACE_DETECTOR_MODEL

import json

import base64
from PIL import Image
import cv2
from io import StringIO
import numpy as np


blazeface_service = BlazeFaceService()
faceboxes_service = FaceboxesService()

headpose_service = DeepHeadPoseService()

@socketio.on('connect')
def connectClient():
    print("=> Client connected on rooth path with session id " + request.sid)


@socketio.on('image', namespace='/')
def newImage(request_object):
    data = request_object['data']

    if data is None or len(data)==0:
        return

    nparr = np.array(data, np.uint8)
    cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    img_rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)

    if FACE_DETECTOR_MODEL == "faceboxes":
        face_boxes = faceboxes_service.inference(img_rgb)
    else:
        face_boxes = blazeface_service.inference(img_rgb)

    if len(face_boxes) > 0:
        detections = headpose_service.inference(img_rgb, face_boxes)
        result = {
            "image_size": {"width": 128, "height": 128},
            "detections": []
        }
        for i in range(len(detections)):
            detection = {
                "x_min": float(detections[i]["bbox"][0]),
                "y_min": float(detections[i]["bbox"][1]),
                "x_max": float(detections[i]["bbox"][2]),
                "y_max": float(detections[i]["bbox"][3]),
                "confidence": float(detections[i]["confidence"]),
                "yaw": float(detections[i]["yaw"]),
                "pitch": float(detections[i]["pitch"]),
                "roll": float(detections[i]["roll"]),
            }
            result["detections"].append(detection)
        
        emit('response', result, broadcast=False, namespace='/')

    # Draw faces
    draw = img_rgb.copy()
    for box_index in range(face_boxes.shape[0]):
        bbox = face_boxes[box_index]
        cv2.rectangle(draw, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), (255, 0, 0), 4)


    draw_bgr = cv2.cvtColor(draw, cv2.COLOR_RGB2BGR)
    
    cv2.imshow("Debug", draw_bgr)
    cv2.waitKey(1)

    # # Notify sender response result
    # retval, buffer = cv2.imencode('.jpg', draw_bgr)
    # draw_base64 = "data:image/png;base64,{}".format(base64.b64encode(buffer).decode("utf-8"))
    # emit('response', draw_base64, broadcast=False, namespace='/')
