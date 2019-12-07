import torch
import os
import cv2
import sys, os, argparse
import numpy as np
from PIL import Image
import time
import dlib
from imutils import face_utils

from .utils import crop_face_loosely, plot_pose_cube
from . import models, utils

class DeepHeadPoseService:

    def __init__(self):

        self.BIN_NUM = 66
        self.INPUT_SIZE = 128
        self.BATCH_SIZE = 16

        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model/shuffle_net_dhp_best_model.h5')
        self.model = models.HeadPoseNet(None, self.BIN_NUM, batch_size=self.BATCH_SIZE, input_size=self.INPUT_SIZE)
        self.model.train(model_path, load_weight=True)

    def inference(self, image, face_boxes):

        preds = []

        draw = image.copy()

        start_time = time.time()

        face_crops = []
        face_boxes_loosen = []
        for i in range(len(face_boxes)):
            bbox = face_boxes[i]
            face_crop = utils.crop_face_loosely(bbox, image, self.INPUT_SIZE)
            face_box_loosen, _, _ = utils.get_loose_bbox(bbox, image, self.INPUT_SIZE)
            face_boxes_loosen.append(face_box_loosen)
            face_crops.append(face_crop)

        if len(face_crops) > 0:
            batch_yaw, batch_pitch, batch_roll, batch_landmark = self.model.predict_batch(face_crops)
            batch_landmark = batch_landmark.tolist()[0]

            for i in range(batch_yaw.shape[0]):
                yaw = batch_yaw[i]
                pitch = batch_pitch[i]
                roll = batch_roll[i]

                landmark = []
                for j in range(len(batch_landmark) // 2):
                    x = batch_landmark[2 * j]
                    y = batch_landmark[2 * j + 1]
                    x, y = utils.get_original_landmark_point(x, y, face_boxes_loosen[i], self.INPUT_SIZE)
                    draw = cv2.circle(draw, (x, y), 2, (255, 0, 0), 2)
                    landmark.append([x, y])

                pred = {
                    "bbox": face_boxes[i][:4],
                    "confidence": face_boxes[i][-1],
                    "yaw": yaw,
                    "pitch": pitch,
                    "roll": roll,
                    "landmark": landmark
                }

                preds.append(pred)

                center_x = (face_boxes[i][2] + face_boxes[i][0]) // 2
                center_y = (face_boxes[i][3] + face_boxes[i][1]) // 2
                max_x = min(face_boxes[i][2], image.shape[1])
                ploted_vis = plot_pose_cube(draw, yaw, pitch, roll, center_x, center_y, size=2 * (max_x - center_x))

        print("Predict time: " + str(time.time() - start_time))

        cv2.imshow("Debug-xx", draw)
        cv2.waitKey(1)

        return preds