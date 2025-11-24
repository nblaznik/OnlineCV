import os
import random
import numpy as np
from PIL import Image, ImageDraw
import cv2
import json


def load_dna(path="final_dna.json"):
    with open(path, "r") as f:
        data = json.load(f)

    dna = []
    for poly in data:
        dna.append({
            "points": [tuple(p) for p in poly["points"]],
            "color": tuple(poly["color"])
        })
    return dna


def render_dna(dna, size):
    """Render polygons in dna onto a RGB image (Pillow)."""
    img = Image.new("RGB", size, (255, 255, 255))
    draw = ImageDraw.Draw(img, "RGBA")

    for poly in dna:
        draw.polygon(poly["points"], fill=poly["color"])

    return img


import matplotlib.pyplot as plt


for dna_link in ["dna_face.json", "dna_uni.json", "dna_lab.json", "dna_award.json", "dna_skill.json"]:
    dna = load_dna(dna_link)
    W = 1424
    H = 848

    img = render_dna(dna, (W, H))

    plt.figure(figsize=(8, 8))
    plt.title(dna_link)
    plt.imshow(img)
    plt.axis("off")

plt.show()