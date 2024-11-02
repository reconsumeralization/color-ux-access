import cv2
import numpy as np

def apply_colorblind_filter(image: np.ndarray, type: str) -> np.ndarray:
    """
    Apply a colorblind filter to the image based on the type.
    Types: 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'
    """
    color_conversion_matrices = {
        'protanopia': np.array([[0.56667, 0.43333, 0],
                                [0.55833, 0.44167, 0],
                                [0, 0.24167, 0.75833]]),
        'deuteranopia': np.array([[0.625, 0.375, 0],
                                  [0.7, 0.3, 0],
                                  [0, 0.3, 0.7]]),
        'tritanopia': np.array([[0.95, 0.05, 0],
                                [0, 0.43333, 0.56667],
                                [0, 0.475, 0.525]]),
        'achromatopsia': np.array([[0.299, 0.587, 0.114],
                                   [0.299, 0.587, 0.114],
                                   [0.299, 0.587, 0.114]])
    }
    
    matrix = color_conversion_matrices.get(type, np.identity(3))
    filtered_image = cv2.transform(image, matrix)
    filtered_image = np.clip(filtered_image, 0, 255).astype(np.uint8)
    return filtered_image 