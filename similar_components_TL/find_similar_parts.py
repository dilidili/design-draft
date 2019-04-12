"""

 similar_images_TL.py  (author: Anson Wong / git: ankonzoid)

 We find similar images in a database by using transfer learning
 via a pre-trained VGG image classifier. We plot the 5 most similar
 images for each image in the database, and plot the tSNE for all
 our image feature vectors.

"""
import sys, os
import numpy as np
import json
from keras.preprocessing import image
from keras.models import Model
sys.path.append("src")

from vgg19 import VGG19
from imagenet_utils import preprocess_input
from plot_utils import plot_query_answer
from sort_utils import find_topk_unique
from kNN import kNN
from tSNE import plot_tsne

def main():
    # ================================================
    # Load pre-trained model and remove higher level layers
    # ================================================
    base_model = VGG19(weights='imagenet')
    model = Model(input=base_model.input,
                  output=base_model.get_layer('block4_pool').output)

    source_path = "db"
    source_paths = np.array(list(filter(lambda path : os.path.splitext(path)[1] in ['.jpg', '.jpeg'], np.array(os.listdir(source_path)))))

    # ================================================
    # Read images and convert them to feature vectors
    # ================================================

    imgs, filename_heads, X = [], [], []
    for f in [sys.argv[1]]:
        # Process filename
        filename = os.path.splitext(f)  # filename in directory
        head, ext = filename[0], filename[1]
        if ext.lower() not in [".jpg", ".jpeg"]:
            continue

        # Read image file
        img = image.load_img(f, target_size=(224, 224))  # load
        imgs.append(np.array(img))  # image
        filename_heads.append(head)  # filename head

        # Pre-process for model input
        img = image.img_to_array(img)  # convert to array
        img = np.expand_dims(img, axis=0)
        img = preprocess_input(img)
        features = model.predict(img).flatten()  # features
        X.append(features)  # append feature extractor

    X = np.array(X)  # feature vectors
    imgs = np.array(imgs)  # images

    # ===========================
    # Find k-nearest images to each image
    # ===========================
    n_neighbours = 3
    pre_X = np.load('feature_matrix.npy')
    knn = kNN()  # kNN model
    knn.compile(n_neighbors=n_neighbours, algorithm="brute", metric="cosine")
    knn.fit(pre_X)

    n_imgs = len(imgs)
    ypixels, xpixels = imgs[0].shape[0], imgs[0].shape[1]
    for ind_query in range(n_imgs):
        # Find top-k closest image feature vectors to each vector
        distances, indices = knn.predict(np.array([X[ind_query]]))
        distances = distances.flatten()
        indices = indices.flatten()
        indices, distances = find_topk_unique(indices, distances, n_neighbours)
        print(json.dumps(source_paths[indices].flatten().tolist()))
        print(distances)

# Driver
if __name__ == "__main__":
    main()