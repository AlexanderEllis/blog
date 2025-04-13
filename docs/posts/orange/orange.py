import cv2
import numpy as np
import os

output_mask_dir = "masks"
output_orange_only_dir = "orange_only"



files = [
    "cropped/orange-1-with-cropped.jpeg",
    "cropped/orange-1-without-cropped.jpeg",
    "cropped/orange-2-with-cropped.jpeg",
    "cropped/orange-2-without-cropped.jpeg",
    "cropped/orange-3-with-cropped.jpeg",
    "cropped/orange-3-without-cropped.jpeg",
    "cropped/orange-4-with-cropped.jpeg",
    "cropped/orange-4-without-cropped.jpeg",
    "cropped/orange-5-with-cropped.jpeg",
    "cropped/orange-5-without-cropped.jpeg",
    "cropped/orange-6-with-cropped.jpeg",
    "cropped/orange-6-without-cropped.jpeg",
    "cropped/orange-7-with-cropped.jpeg",
    "cropped/orange-7-without-cropped.jpeg",
    "cropped/orange-10-with-cropped.jpeg",
    "cropped/orange-10-without-cropped.jpeg",
    "cropped/orange-11-with-cropped.jpeg",
    "cropped/orange-11-without-cropped.jpeg",
    "cropped/orange-12-with-cropped.jpeg",
    "cropped/orange-12-without-cropped.jpeg",
    "cropped/orange-13-with-cropped.jpeg",
    "cropped/orange-13-without-cropped.jpeg"
]

for file in files:
    # Load the image
    image = cv2.imread(file)

    # Convert to HSV color space (better for color detection)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define the range for orange in HSV
    lower_orange = np.array([3, 150, 150])
    upper_orange = np.array([20, 255, 255])

    # Mask the image to get only the orange parts
    mask = cv2.inRange(hsv, lower_orange, upper_orange)

    # Apply the mask to the image
    orange_pixels = cv2.bitwise_and(image, image, mask=mask)

    # Save the binary mask
    mask_filename = os.path.join(output_mask_dir, os.path.basename(file).replace(".jpeg", "_mask.png"))
    cv2.imwrite(mask_filename, mask)

    # Save the image with only orange areas
    orange_only_filename = os.path.join(output_orange_only_dir, os.path.basename(file).replace(".jpeg", "_orange.png"))
    cv2.imwrite(orange_only_filename, orange_pixels)


    # Calculate the average color of the orange pixels
    bgr_avg = cv2.mean(orange_pixels, mask=mask)[:3]
    rgb_avg = tuple(reversed(bgr_avg))
    hsv_avg = cv2.cvtColor(np.uint8([[bgr_avg]]), cv2.COLOR_BGR2HSV)[0][0]

    print(file, "Average RGB orange color:", rgb_avg, "HSV:", hsv_avg)

