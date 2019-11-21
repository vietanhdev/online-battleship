import cv2
import os
import time
import argparse

from .lib.core.api.face_detector import FaceDetector

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

class FaceboxesService:

    def __init__(self):

        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model/detector')
        self.model = FaceDetector(model_path)


    def inference(self, rgb_image):

        boxes = self.model(rgb_image, 0.5)

        draw = rgb_image.copy()

        for box_index in range(boxes.shape[0]):
            bbox = boxes[box_index]

            cv2.rectangle(draw, (int(bbox[0]), int(bbox[1])),
                          (int(bbox[2]), int(bbox[3])), (255, 0, 0), 4)

        return draw

