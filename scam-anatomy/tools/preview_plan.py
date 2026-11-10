"""Fast storyboard preview of a video's shot plan (no TTS): python preview_plan.py <video_dir> <out_dir>
Estimates paragraph timing from word count, renders 2 frames per shot (40% and 85%), makes contact sheets."""
import os, re, sys, json, subprocess
VDIR = os.path.abspath(sys.argv[1]); OUT = os.path.abspath(sys.argv[2]); os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
md = open(os.path.join(VDIR, "script.md"), encoding="utf-8").read().split("## Чистый текст")[0]
paras = [m.group(1).strip() for l in md.splitlines() if (m := re.match(r"^\| (.+?) \| (.+?) \|$", l)) and not l.startswith(("| EN", "|---"))]
TTS_FIX = []; CAP_FIX = []; HIGHLIGHT = []; CHAPTER_ENV = False
exec(open(os.path.join(VDIR, "plan.py"), encoding="utf-8").read())
def kw(text, key, voiced):
    if isinstance(key, (int, float)): return float(key)
    m = re.match(r"^(.*)\+(\d+(?:\.\d+)?)$", key)
    if m: return kw(text, m.group(1), voiced) + float(m.group(2))
    i = text.lower().find(key.lower())
    if i < 0: print("WARN keyword:", key); return voiced * .5
    return voiced * i / len(text)
def res(o, text, voiced):
    if isinstance(o, str) and o.startswith("KW:"): return kw(text, o[3:], voiced)
    if isinstance(o, dict): return {k: res(v, text, voiced) for k, v in o.items()}
    if isinstance(o, list): return [res(v, text, voiced) for v in o]
    return o
jobs = []
for idx, text in enumerate(paras):
    for ins in INSERT.get(idx, []):
        if ins[0] == "chapter": jobs.append({"id": f"c{ins[1]}", "shot": {"scene": "chapter", "dur": 2, "p": {"n": ins[1], "title": ins[2], "env": CHAPTER_ENV}}, "ts": [1.2]})
    voiced = len(text.split()) / 2.3; special = {}
    if "…" in text:
        a, b = text.split("…", 1); va = len(a.split()) / 2.3; special = {"PAUSE_START": va, "PAUSE_END": va + 4, "REVEAL": voiced + 4.2}; voiced += 4
    entry = PLAN[idx]; parts = entry if isinstance(entry, list) else [tuple(entry) + (0,)]
    def evt(v):
        if isinstance(v, str) and special and v.split("+")[0] in special:
            b_, _, o_ = v.partition("+"); return special[b_] + (float(o_) if o_ else 0)
        return kw(text, v, voiced)
    d = voiced + (3.2 if special else .5)
    st = [0] + [kw(text, pt[4], voiced) for pt in parts[1:]] + [d]
    for k_, pt in enumerate(parts):
        dd = st[k_ + 1] - st[k_]
        jobs.append({"id": f"p{idx:02d}{'' if k_ == 0 else 'abcdefg'[k_]}", "shot": {"scene": pt[0], "dur": dd, "p": res(pt[1], text, voiced), "ev": {k: evt(v) - st[k_] for k, v in pt[2].items()}}, "ts": [dd * .4, dd * .85]})
json.dump(jobs, open(os.path.join(OUT, "jobs.json"), "w"))
js = os.path.join(OUT, "r.js")
open(js, "w").write("""const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const jobs=JSON.parse(fs.readFileSync(process.argv[2]));const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('file://'+process.argv[3]);await p.waitForFunction('window.DONE===true');
for(const j of jobs){await p.evaluate(s=>setup(s),j.shot);for(let k=0;k<j.ts.length;k++){await p.evaluate(t=>frame(t),j.ts[k]);await p.screenshot({path:`${process.argv[4]}/${j.id}_${k}.png`});}}
await b.close();})();""")
subprocess.run(["node", js, os.path.join(OUT, "jobs.json"), os.path.join(HERE, "cartoon", "engine.html"), OUT], check=True, cwd=OUT)
from PIL import Image, ImageDraw
files = sorted(f for f in os.listdir(OUT) if re.match(r"^[pc]\d+[a-g]?_\d\.png$", f))
for n in range(0, len(files), 12):
    sub = files[n:n + 12]; sh = Image.new("RGB", (640 * 3, 380 * 4), "black"); d = ImageDraw.Draw(sh)
    for i, f in enumerate(sub):
        im = Image.open(os.path.join(OUT, f)).convert("RGB").resize((640, 360)); sh.paste(im, ((i % 3) * 640, (i // 3) * 380 + 20)); d.text(((i % 3) * 640 + 6, (i // 3) * 380 + 4), f, fill="yellow")
    sh.save(os.path.join(OUT, f"sheet{n // 12}.png"))
print("sheets:", (len(files) + 11) // 12)
