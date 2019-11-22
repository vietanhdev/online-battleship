from . import hopenetlite_v2
import torch
import os
import cv2

import sys, os, argparse

import numpy as np
import cv2

import torch
import torch.nn as nn
from torch.autograd import Variable
from torch.utils.data import DataLoader
from torchvision import transforms
import torch.backends.cudnn as cudnn
import torchvision
import torch.nn.functional as F
from PIL import Image

from .utils import crop_face_loosely, plot_pose_cube

class DeepHeadPoseService:

    def __init__(self):

        self.model = hopenetlite_v2.HopeNetLite()
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model/hopenet_lite_6MB.pkl')
        saved_state_dict = torch.load(model_path, map_location="cpu")
        self.model.load_state_dict(saved_state_dict, strict=False)
        self.model.eval()

    def inference(self, image, face_boxes):

        crop = crop_face_loosely(face_boxes[0], image, 224)

        img = Image.fromarray(crop)

        idx_tensor = [idx for idx in range(66)]
        idx_tensor = torch.FloatTensor(idx_tensor)

        transformations = transforms.Compose([transforms.Scale(224),
        transforms.CenterCrop(224), transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])

        # Transform
        img = transformations(img)
        img_shape = img.size()
        img = img.view(1, img_shape[0], img_shape[1], img_shape[2])
        img = Variable(img)

        yaw, pitch, roll = self.model(img)

        yaw_predicted = F.softmax(yaw)
        pitch_predicted = F.softmax(pitch)
        roll_predicted = F.softmax(roll)

        # Get continuous predictions in degrees.
        yaw_predicted = torch.sum(yaw_predicted.data[0] * idx_tensor) * 3 - 99
        pitch_predicted = torch.sum(pitch_predicted.data[0] * idx_tensor) * 3 - 99
        roll_predicted = torch.sum(roll_predicted.data[0] * idx_tensor) * 3 - 99

        ploted_vis = plot_pose_cube(crop, yaw_predicted, pitch_predicted, roll_predicted)
        cv2.imshow("Debug-xx", ploted_vis)
        cv2.waitKey(1)

        # resized = cv2.resize(image, (224, 224))
        return yaw_predicted.item(), pitch_predicted.item(), roll_predicted.item()