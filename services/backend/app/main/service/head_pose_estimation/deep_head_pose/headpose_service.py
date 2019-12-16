import torch
import os
import cv2
import sys, os, argparse
import numpy as np
from PIL import Image
import time
import dlib
from imutils import face_utils
import json

from .utils import crop_face_loosely, plot_pose_cube
from . import models, utils

class DeepHeadPoseService:

    def __init__(self):

        self.BIN_NUM = 66
        self.INPUT_SIZE = 128
        self.BATCH_SIZE = 16

        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models/model_ep022.h5')
        config_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config_5.json')

        # Open and load the config json
        with open(config_file) as config_buffer:
            self.config = json.loads(config_buffer.read())

        # Build model
        self.model = models.HeadPoseNet(self.config["model"]["im_width"], self.config["model"]
                                ["im_height"], nb_bins=self.config["model"]["nb_bins"], learning_rate=self.config["train"]["learning_rate"])
        # Load model
        self.model.load_weights(model_path)

    def inference(self, image, faces):

        preds = []

        draw = image.copy()

        start_time = time.time()

        face_crops = []
        face_boxes = []
        for i in range(len(faces)):
            bbox = faces[i]
            bbox = (int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]))
            face_crop = utils.crop_face_loosely(bbox, image, (self.config["model"]["im_width"], self.config["model"]["im_height"]))
            face_box, _, _ = utils.get_loosen_bbox(bbox, image, (self.config["model"]["im_width"], self.config["model"]["im_height"]))
            face_boxes.append(list(face_box) + [faces[i][-1]])
            face_crops.append(face_crop)

        if len(face_crops) > 0:

            batch_yaw, batch_pitch, batch_roll, batch_landmark = self.model.predict_batch(
                face_crops)

            draw = image.copy()

            for i in range(batch_yaw.shape[0]):
                yaw = batch_yaw[i]
                pitch = batch_pitch[i]
                roll = batch_roll[i]
                landmark = batch_landmark[i]
                face_box_size = (face_boxes[i][2]-face_boxes[i][0], face_boxes[i][3]-face_boxes[i][1])
                net_input_size = (self.config["model"]["im_width"], self.config["model"]["im_height"])
                scale = np.divide(np.array(face_box_size), np.array(net_input_size))

                draw = cv2.rectangle(draw, (face_boxes[i][0], face_boxes[i][1]), (
                    face_boxes[i][2], face_boxes[i][3]), (0, 0, 255), 2)

                face_box_width = face_boxes[i][2]-face_boxes[i][0]
                axis_x, axis_y = utils.unnormalize_landmark_point(
                    (landmark[4], landmark[5]), net_input_size, scale=scale)
                axis_x += face_boxes[i][0]
                axis_y += face_boxes[i][1]
                draw = utils.draw_axis(draw, yaw, pitch, roll, tdx=face_boxes[i][0] + face_box_width // 5,
                                        tdy=face_boxes[i][1] + face_box_width // 5, size=face_box_width // 2)

                unnormalized_landmark = []
                for j in range(5):
                    x = landmark[2 * j]
                    y = landmark[2 * j + 1]
                    x, y = utils.unnormalize_landmark_point(
                        (x, y), net_input_size, scale=scale)
                    x += face_boxes[i][0]
                    y += face_boxes[i][1]
                    unnormalized_landmark.append([x, y])
                    x = int(x)
                    y = int(y)
                    draw = cv2.circle(draw, (x, y), 2, (255, 0, 0), 2)
    
                pred = {
                    "bbox": face_boxes[i][:4],
                    "confidence": face_boxes[i][-1],
                    "yaw": yaw,
                    "pitch": pitch,
                    "roll": roll,
                    "landmark": unnormalized_landmark
                }
                preds.append(pred)
              
            cv2.imshow("Debug-xx", draw)
            cv2.waitKey(1)

        return preds