"""Make contact sheets of every shot boundary in a built cartoon video.
python qa_transitions.py <video_dir> <out_dir>
For each boundary: last 4 frames of the outgoing shot + first 6 frames of the incoming one.
"""
import os, sys, subprocess, json
from PIL import Image, ImageDraw
VDIR = os.path.abspath(sys.argv[1]); OUT = os.path.abspath(sys.argv[2]); os.makedirs(OUT, exist_ok=True)
TMP = os.path.join(VDIR, "final-cartoon", "tmp"); VIDEO = os.path.join(VDIR, "final-cartoon", "video.mp4")
def nframes(f):
    return int(subprocess.check_output(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f]).decode())
segs = [l.strip()[6:-1] for l in open(os.path.join(TMP, "list.txt"))]
names = [os.path.basename(s)[:-4] for s in segs]; counts = [nframes(s) for s in segs]
bounds, acc = [], 0
for i in range(len(segs) - 1):
    acc += counts[i]; bounds.append((acc, names[i], names[i + 1]))
want = sorted({f for b, _, _ in bounds for f in list(range(b - 4, b)) + list(range(b, b + 6))})
fdir = os.path.join(OUT, "frames"); os.makedirs(fdir, exist_ok=True)
sel = "+".join(f"eq(n\\,{f})" for f in want)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", VIDEO, "-vf", f"select='{sel}',scale=384:216", "-vsync", "0", os.path.join(fdir, "f%05d.png")], check=True)
files = sorted(os.listdir(fdir)); fmap = dict(zip(want, files))
index = []
for k, (b, a, c) in enumerate(bounds):
    row = Image.new("RGB", (384 * 10, 216 + 30), "black"); d = ImageDraw.Draw(row)
    for j, f in enumerate(list(range(b - 4, b)) + list(range(b, b + 6))):
        if f in fmap: row.paste(Image.open(os.path.join(fdir, fmap[f])), (j * 384, 30))
    d.text((6, 6), f"#{k:02d}  {a} -> {c}  (boundary frame {b}, t={b/30:.2f}s)   [left 4 = end of {a} | right 6 = start of {c}]", fill="yellow")
    d.line([(4 * 384, 0), (4 * 384, 246)], fill="red", width=3)
    p = os.path.join(OUT, f"b{k:02d}_{a}_{c}.png"); row.save(p); index.append({"n": k, "from": a, "to": c, "t": round(b / 30, 2), "sheet": p})
json.dump(index, open(os.path.join(OUT, "index.json"), "w"), indent=1)
print(len(index), "boundaries ->", OUT)
