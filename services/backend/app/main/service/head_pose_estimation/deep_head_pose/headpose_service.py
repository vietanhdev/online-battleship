from . import hopenetlite_v2
import torch
import os
import cv2
import sys, os, argparse
import numpy as np
import torch
import torch.nn as nn
from torch.autograd import Variable
from torch.utils.data import DataLoader
from torchvision import transforms
import torch.backends.cudnn as cudnn
import torchvision
import torch.nn.functional as F
from PIL import Image
import time
import dlib

from .utils import crop_face_loosely, plot_pose_cube

class DeepHeadPoseService:

    def __init__(self):

        self.model = hopenetlite_v2.HopeNetLite()
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model/hopenet_lite_6MB.pkl')
        saved_state_dict = torch.load(model_path, map_location="cpu")
        self.model.load_state_dict(saved_state_dict, strict=False)
        self.model.eval()

    def inference(self, image, face_boxes):

        transformations = transforms.Compose([transforms.Scale(224),
        transforms.CenterCrop(224), transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])

        preds = []

        draw = image.copy()

        start_time = time.time()
        for i in range(len(face_boxes)):
            crop = crop_face_loosely(face_boxes[i], image, 224)
            img = Image.fromarray(crop)
            idx_tensor = [idx for idx in range(66)]
            idx_tensor = torch.FloatTensor(idx_tensor)

            # Transform
            img = transformations(img)
            img_shape = img.size()
            img = img.view(1, img_shape[0], img_shape[1], img_shape[2])
            img = Variable(img)

            yaw, pitch, roll = self.model(img)

            

            yaw_predicted = F.softmax(yaw, dim=1)
            pitch_predicted = F.softmax(pitch, dim=1)
            roll_predicted = F.softmax(roll, dim=1)

            # Get continuous predictions in degrees.
            yaw_predicted = torch.sum(yaw_predicted.data[0] * idx_tensor) * 3 - 99
            pitch_predicted = torch.sum(pitch_predicted.data[0] * idx_tensor) * 3 - 99
            roll_predicted = torch.sum(roll_predicted.data[0] * idx_tensor) * 3 - 99

            pred = {
                "bbox": face_boxes[i][:4],
                "confidence": face_boxes[i][-1],
                "yaw": yaw_predicted.item(),
                "pitch": pitch_predicted.item(),
                "roll": roll_predicted.item()
            }

            preds.append(pred)

            center_x = (face_boxes[i][2] + face_boxes[i][0]) // 2
            center_y = (face_boxes[i][3] + face_boxes[i][1]) // 2
            max_x = min(face_boxes[i][2], image.shape[1])
            ploted_vis = plot_pose_cube(draw, yaw_predicted, pitch_predicted, roll_predicted, center_x, center_y, size=2 * (max_x - center_x))

        print("Predict time: " + str(time.time() - start_time))

        cv2.imshow("Debug-xx", draw)
        cv2.waitKey(1)

        return preds