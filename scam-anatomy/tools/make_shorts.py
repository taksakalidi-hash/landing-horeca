"""Cut vertical 9:16 Shorts from a built cartoon video.
python make_shorts.py <video_dir>
Uses final-cartoon/tmp (segments, list.txt, mix.wav) and captions.srt.
"""
import os, re, sys, subprocess, json
VDIR = os.path.abspath(sys.argv[1]); FC = os.path.join(VDIR, "final-cartoon"); TMP = os.path.join(FC, "tmp")
OUT = os.path.join(FC, "shorts"); os.makedirs(OUT, exist_ok=True)

SHORTS = [
    ("short1-is-this-a-scam", ["p33", "p35"], "IS THIS|A SCAM?", "Count the red flags"),
    ("short2-caller-id-lies", ["p10", "p11"], "YOUR BANK|IS CALLING…", "…or is it?"),
    ("short3-the-code-is-the-key", ["p15", "p16", "p17", "p18", "p19"], "NEVER READ|THIS CODE", "Here's why"),
    ("short4-one-text", ["p00", "p01", "p02"], "ONE TEXT.|$18,400 GONE", "Don't reply to this"),
]

SF = os.path.join(VDIR, "shorts.py")
if os.path.exists(SF): exec(open(SF, encoding="utf-8").read())

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
starts, t = {}, 0.0
for line in open(os.path.join(TMP, "list.txt")):
    f = line.strip()[6:-1]; sid = os.path.basename(f)[:-4]; d = dur(f); starts[sid] = (t, t + d); t += d

nocap = os.path.join(TMP, "nocap.mp4")
if not os.path.exists(nocap):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"), "-i", os.path.join(TMP, "mix.wav"),
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", nocap], check=True)

def srt_parse(p):
    items = []
    for blk in open(p).read().strip().split("\n\n"):
        L = blk.splitlines()
        if len(L) < 3: continue
        a, b = L[1].split(" --> ")
        f = lambda s: (lambda h, m, r: int(h) * 3600 + int(m) * 60 + float(r.replace(",", ".")))(*s.split(":"))
        items.append((f(a), f(b), " ".join(L[2:])))
    return items
caps = srt_parse(os.path.join(FC, "captions.srt"))
def ts(x):
    h, r = divmod(max(x, 0), 3600); m, s = divmod(r, 60); return f"{int(h)}:{int(m):02d}:{s:05.2f}"

for name, ids, title, sub in SHORTS:
    t0, t1 = starts[ids[0]][0], starts[ids[-1]][1]; D = min(t1 - t0, 58.0)
    l1, l2 = title.split("|")
    ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "", "[V4+ Styles]",
           "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
           "Style: Title,Anton,118,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,6,0,8,40,40,150,1",
           "Style: Sub,Inter,52,&H0066D1FF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,4,0,8,40,40,420,1",
           "Style: Cap,Inter,64,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,6,2,2,70,70,330,1",
           "Style: End,Anton,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,5,0,2,40,40,170,1",
           "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
    ass.append(f"Dialogue: 1,{ts(0)},{ts(D)},Title,,0,0,0,,{{\\fad(150,0)}}{l1}\\N{{\\c&H4639E6&}}{l2}")
    ass.append(f"Dialogue: 1,{ts(0.4)},{ts(D)},Sub,,0,0,0,,{{\\fad(200,0)}}{sub}")
    for a, b, c in caps:
        if b <= t0 or a >= t0 + D: continue
        ass.append(f"Dialogue: 0,{ts(a - t0)},{ts(min(b, t0 + D) - t0)},Cap,,0,0,0,,{c}")
    ass.append(f"Dialogue: 2,{ts(D - 2.2)},{ts(D)},End,,0,0,0,,{{\\fad(200,0)}}FULL STORY ON\\N{{\\c&H4639E6&}}SCAM ANATOMY")
    af = os.path.join(TMP, name + ".ass"); open(af, "w").write("\n".join(ass))
    fc = ("[0:v]split[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=24:2,eq=brightness=-0.25[bg];"
          "[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2+40,"
          f"subtitles={af}:fontsdir=" + os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts") + "[v]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", nocap, "-filter_complex", fc, "-map", "[v]", "-map", "0:a",
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", os.path.join(OUT, name + ".mp4")], check=True)
    print(name, round(D, 1), "s", flush=True)
