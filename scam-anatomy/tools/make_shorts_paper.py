"""Vertical 9:16 Shorts from a paper-style build.
python make_shorts_paper.py <video_dir> [plan_name=paper_plan]
Reads <video_dir>/shorts_paper.py: SHORTS = [(name, first_line_prefix, last_line_prefix, "TITLE|LINE2", "sub"), ...]
optional TEASE = {name: (line_prefix, seconds_from_line_end, duration)}
"""
import os, re, sys, json, subprocess
VDIR = os.path.abspath(sys.argv[1]); NAME = sys.argv[2] if len(sys.argv) > 2 else "paper_plan"
TMP = os.path.join(VDIR, "final-paper", "tmp-" + NAME); OUT = os.path.join(VDIR, "final-paper", "shorts"); os.makedirs(OUT, exist_ok=True)
G = {}; exec(open(os.path.join(VDIR, "shorts_paper.py"), encoding="utf-8").read(), G)
LN = json.load(open(os.path.join(TMP, "lines.json")))
def line(pre):
    m = [l for l in LN if l["text"].startswith(pre)]; assert len(m) == 1, pre; return m[0]
nocap = os.path.join(TMP, "nocap.mp4")
if not os.path.exists(nocap):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"), "-i", os.path.join(TMP, "mix.wav"),
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", nocap], check=True)
caps = []
for l in open(os.path.join(TMP, "cap.ass")):
    if l.startswith("Dialogue:"):
        f = l.rstrip("\n").split(",", 9)
        tsec = lambda s: (lambda h, m, x: int(h) * 3600 + int(m) * 60 + float(x))(*s.split(":"))
        caps.append((tsec(f[1]), tsec(f[2]), re.sub(r"\{[^}]*\}", "", f[9])))
def ts(x):
    h, r = divmod(max(x, 0), 3600); m, s = divmod(r, 60); return f"{int(h)}:{int(m):02d}:{s:05.2f}"
fonts = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
TEASE = G.get("TEASE", {})
for name, a_pre, b_pre, title, sub in G["SHORTS"]:
    t0 = line(a_pre)["start"] - 0.3; lb = line(b_pre); t1 = lb["start"] + lb["dur"] + 0.6
    tz = TEASE.get(name); TD = tz[2] if tz else 0.0
    if tz: lz = line(tz[0]); tt = lz["start"] + lz["dur"] - tz[1] - tz[2]
    D = min(t1 - t0, 58.0 - TD); TOT = D + TD
    l1, l2 = title.split("|")
    ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "", "[V4+ Styles]",
           "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
           "Style: Title,Anton,118,&H00FFFFFF,&H00FFFFFF,&H00201308,&H00000000,0,0,0,0,100,100,2,0,1,7,0,8,40,40,150,1",
           "Style: Sub,Inter,52,&H0066D1FF,&H00FFFFFF,&H00201308,&H00000000,1,0,0,0,100,100,0,0,1,5,0,8,40,40,420,1",
           "Style: Cap,Inter,64,&H00FFFFFF,&H00FFFFFF,&H4020130B,&H4020130B,1,0,0,0,100,100,0,0,3,12,0,2,70,70,330,1",
           "Style: End,Anton,84,&H00FFFFFF,&H00FFFFFF,&H00201308,&H00000000,0,0,0,0,100,100,2,0,1,6,0,2,40,40,170,1",
           "Style: Tease,Anton,96,&H0066D1FF,&H00FFFFFF,&H00201308,&H00000000,0,0,0,0,100,100,2,0,1,6,0,2,40,40,330,1",
           "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
    ass.append(f"Dialogue: 1,{ts(0)},{ts(TOT)},Title,,0,0,0,,{{\\fad(150,0)}}{l1}\\N{{\\c&H4639E6&}}{l2}")
    ass.append(f"Dialogue: 1,{ts(0.4)},{ts(TOT)},Sub,,0,0,0,,{{\\fad(200,0)}}{sub}")
    if TD: ass.append(f"Dialogue: 2,{ts(0)},{ts(TD)},Tease,,0,0,0,,{{\\fad(0,150)}}HOW DID IT COME TO THIS?")
    for a, b, c in caps:
        if b <= t0 or a >= t0 + D: continue
        ass.append(f"Dialogue: 0,{ts(a - t0 + TD)},{ts(min(b, t0 + D) - t0 + TD)},Cap,,0,0,0,,{c}")
    ass.append(f"Dialogue: 2,{ts(TOT - 2.2)},{ts(TOT)},End,,0,0,0,,{{\\fad(200,0)}}FULL STORY ON\\N{{\\c&H4639E6&}}SCAM ANATOMY")
    af = os.path.join(TMP, name + ".ass"); open(af, "w").write("\n".join(ass))
    # paper bg: blurred + darkened navy tint; main picture slightly zoomed (crop sides) for a bigger image
    layout = ("split[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=24:2,colorchannelmixer=rr=.55:gg=.6:bb=.75[bg];"
              "[b]crop=1500:1080:210:0,scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2+40," f"subtitles={af}:fontsdir={fonts}[v]")
    if TD:
        inputs = ["-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", nocap, "-ss", f"{tt:.3f}", "-t", f"{TD:.3f}", "-i", nocap,
                  "-f", "lavfi", "-t", f"{TD:.3f}", "-i", "aevalsrc=0.9*sin(2*PI*(38+70*exp(-3*t))*t)*exp(-2.5*t):s=48000"]
        fc = ("[1:v]setpts=PTS-STARTPTS,fps=30[tv];[0:v]setpts=PTS-STARTPTS,fps=30[mv];"
              "[2:a]aformat=sample_rates=48000:channel_layouts=stereo[ta];[0:a]aresample=48000,aformat=sample_rates=48000:channel_layouts=stereo[ma];"
              "[tv][ta][mv][ma]concat=n=2:v=1:a=1[cv][ca];[cv]" + layout + ";[ca]loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
    else:
        inputs = ["-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", nocap]
        fc = "[0:v]" + layout + ";[0:a]loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + inputs + ["-filter_complex", fc, "-map", "[v]", "-map", "[aout]",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
                    "-movflags", "+faststart", os.path.join(OUT, name + ".mp4")], check=True)
    print(name, round(TOT, 1), "s", flush=True)
