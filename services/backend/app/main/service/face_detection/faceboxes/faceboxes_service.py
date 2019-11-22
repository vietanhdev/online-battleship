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

        return boxes

