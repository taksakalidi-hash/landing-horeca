"""Copy uploaded scene images into a video's img/ folder, optionally stylize photo-like ones
into the graphic-novel look and blur regions (logos / brand names).
python prep_images.py <map.json> <out_dir>
map.json: {"NAME": {"src": path, "style": bool, "blur": [[x0,y0,x1,y1], ...] (fractions)}}
"""
import sys, json, os
import cv2, numpy as np

M = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)

def stylize(img):
    h, w = img.shape[:2]
    small = img
    for _ in range(2):
        small = cv2.bilateralFilter(small, 9, 60, 9)
    # posterize lightly (flat painted areas)
    q = (small.astype(np.float32) / 24).round() * 24
    paint = cv2.addWeighted(small.astype(np.float32), .55, q, .45, 0)
    # ink lines
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 7)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 7)
    edges = cv2.erode(edges, np.ones((2, 2), np.uint8))
    ink = (edges.astype(np.float32) / 255)[..., None]
    out = paint * (0.35 + 0.65 * ink)
    # split tone: navy shadows, amber highlights
    lum = cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)[..., None] / 255
    navy = np.array([32, 19, 11], np.float32)      # BGR of #0B1320
    amber = np.array([71, 179, 255], np.float32)   # BGR of #FFB347
    tone = navy * (1 - lum) + amber * lum
    out = out * .82 + tone * .18
    # paper grain
    noise = np.random.default_rng(3).normal(0, 4, (h, w, 1)).astype(np.float32)
    return np.clip(out + noise, 0, 255).astype(np.uint8)

def blur(img, boxes):
    h, w = img.shape[:2]
    for x0, y0, x1, y1 in boxes:
        a, b, c, d = int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)
        roi = img[b:d, a:c]
        k = max(31, (min(roi.shape[:2]) // 6) | 1)
        img[b:d, a:c] = cv2.GaussianBlur(roi, (k, k), 0)
    return img

for name, o in M.items():
    img = cv2.imread(o["src"])
    if img.shape[1] > 2400:
        img = cv2.resize(img, (2400, round(img.shape[0] * 2400 / img.shape[1])), interpolation=cv2.INTER_AREA)
    if o.get("blur"): img = blur(img, o["blur"])
    if o.get("style"): img = stylize(img)
    cv2.imwrite(os.path.join(OUT, name + ".jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(name, img.shape[1], img.shape[0], "styled" if o.get("style") else "", "blurred" if o.get("blur") else "")
