import tensorflow as tf
for gpu in tf.config.experimental.list_physical_devices('GPU'):
    tf.compat.v2.config.experimental.set_memory_growth(gpu, True)
    
import math
import keras
from keras import backend as K
from keras.models import load_model
from keras.preprocessing import image
from keras.optimizers import Adam
from imageio import imread
import numpy as np

from .models.keras_blazeface import blazeface
from .keras_loss_function.keras_ssd_loss import SSDLoss
import cv2

class BlazeFaceService:

    def __init__(self):

        # Set the image size.
        self.img_height = 128
        self.img_width = 128

        # TODO: Set the path to the `.h5` file of the model to be loaded.
        model_path = '/mnt/DATA/GR/MAIN_STREAM/Server/services/backend/app/main/ml_models/blazeface_epoch-154.h5'

        K.clear_session() # Clear previous models from memory.

        model = blazeface(image_size=(self.img_height, self.img_width, 3),
                        n_classes=1,
                        mode='inference',
                        l2_regularization=0.0005,
                        scales=[[0.2, math.sqrt(0.2 * 0.43)], [0.43, math.sqrt(0.43 * 0.67), 0.67, math.sqrt(0.67 * 0.9), 0.9, math.sqrt(0.9 * 1)]], # The scales for MS COCO are [0.07, 0.15, 0.33, 0.51, 0.69, 0.87, 1.05]
                        aspect_ratios_per_layer=[[1.0, 1.0], [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]],
                        steps=[64, 128],
                        offsets=None,
                        clip_boxes=False,
                        variances=[0.1, 0.1, 0.2, 0.2],
                        normalize_coords=True,
                        subtract_mean=[123, 117, 104],
                        swap_channels=[2, 1, 0],
                        confidence_thresh=0.1,
                        iou_threshold=0.45,
                        top_k=200,
                        nms_max_output_size=400)

        # 2: Load the trained weights into the model.

        model.load_weights(model_path, by_name=True)

        # 3: Compile the model so that Keras won't complain the next time you load it.

        adam = Adam(lr=0.001, beta_1=0.9, beta_2=0.999, epsilon=1e-08, decay=0.0)

        ssd_loss = SSDLoss(neg_pos_ratio=3, alpha=1.0)

        model.compile(optimizer=adam, loss=ssd_loss.compute_loss)


        self.model = model


    def inference(self, rgb_image):

        # Workaround https://github.com/keras-team/keras/issues/13353
        import keras.backend.tensorflow_backend as tb
        tb._SYMBOLIC_SCOPE.value = True

        orig_images = [] # Store the images here.
        input_images = [] # Store resized versions of the images here.

        orig_images.append(rgb_image)

        img = cv2.resize(rgb_image, (self.img_width, self.img_height))
        img = image.img_to_array(img) 
        input_images.append(img)
        input_images = np.array(input_images)

        y_pred = self.model.predict(input_images)

        confidence_threshold = 0.5

        y_pred_thresh = [y_pred[k][y_pred[k,:,1] > confidence_threshold] for k in range(y_pred.shape[0])]

        np.set_printoptions(precision=2, suppress=True, linewidth=90)
        
        draw = rgb_image.copy()

        for box in y_pred_thresh[0]:

            confidence = box[1]

            # Transform the predicted bounding boxes for the 300x300 image to the original image dimensions.
            xmin = box[2] * orig_images[0].shape[1] / self.img_width
            ymin = box[3] * orig_images[0].shape[0] / self.img_height
            xmax = box[4] * orig_images[0].shape[1] / self.img_width
            ymax = box[5] * orig_images[0].shape[0] / self.img_height


            # Start coordinate, here (5, 5) 
            # represents the top left corner of rectangle 
            start_point = (int(xmin), int(ymin)) 
            
            # Ending coordinate, here (220, 220) 
            # represents the bottom right corner of rectangle 
            end_point = (int(xmax), int(ymax)) 
            
            # Blue color in BGR 
            color = (255, 0, 0) 
            
            # Line thickness of 2 px 
            thickness = 2
            
            # Using cv2.rectangle() method 
            # Draw a rectangle with blue line borders of thickness of 2 px 
            draw = cv2.rectangle(draw, start_point, end_point, color, thickness)

            draw = cv2.putText(draw, str(confidence), start_point, cv2.FONT_HERSHEY_SIMPLEX ,  
                            0.5, (255, 0, 0), 1, cv2.LINE_AA)

        return draw

