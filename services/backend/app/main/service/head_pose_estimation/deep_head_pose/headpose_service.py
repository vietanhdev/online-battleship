from . import hopenetlite_v2
import torch
import os
import cv2

def crop_face_loosely(shape, img, input_size):
    
    max_x = min(shape[2], img.shape[1])
    min_x = max(shape[0], 0)
    max_y = min(shape[3], img.shape[0])
    min_y = max(shape[1], 0)
    
    Lx = max_x - min_x
    Ly = max_y - min_y
    
    Lmax = int(max(Lx, Ly) * 2.0)
    
    delta = Lmax // 2
    
    center_x = (shape[2] + shape[0]) // 2
    center_y = (shape[3] + shape[1]) // 2
    start_x = int(center_x - delta)
    start_y = int(center_y - delta - 30)
    end_x = int(center_x + delta)
    end_y = int(center_y + delta - 30)
    
    if start_y < 0:
        start_y = 0
    if start_x < 0:
        start_x = 0
    if end_x > img.shape[1]:
        end_x = img.shape[1]
    if end_y > img.shape[0]:
        end_y = img.shape[0]
    
    crop_face = img[start_y:end_y, start_x:end_x]
    
    cv2.imshow('crop_face', crop_face)
    
    crop_face = cv2.resize(crop_face, (input_size, input_size))
    # input_img = np.asarray(crop_face, dtype=np.float32)
    # normed_img = (input_img - input_img.mean()) / input_img.std()
    
    # return normed_img

    return crop_face

class DeepHeadPoseService:

    def __init__(self):

        self.net = hopenetlite_v2.HopeNetLite()
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model/hopenet_lite_6MB.pkl')
        saved_state_dict = torch.load(model_path, map_location="cpu")
        self.net.load_state_dict(saved_state_dict, strict=False)

    def inference(self, image, face_boxes):
        crop = crop_face_loosely(face_boxes[0], image, 224)
        # resized = cv2.resize(image, (224, 224))
        return self.net(torch.tensor(crop))