"""Build the animated (cartoon) version of a Scam Anatomy video.

python build_cartoon.py <video_dir> <kokoro_dir> [voice] [speed]
Output: <video_dir>/final-cartoon/video.mp4, captions.srt, build.json
"""
import re, sys, os, json, math, subprocess
import numpy as np, soundfile as sf

VDIR = os.path.abspath(sys.argv[1]); KDIR = os.path.abspath(sys.argv[2])
VOICE = sys.argv[3] if len(sys.argv) > 3 else "af_heart"
SPEED = float(sys.argv[4]) if len(sys.argv) > 4 else 0.92
FPS, SR = 30, 24000
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(VDIR, "final-cartoon"); TMP = os.path.join(OUT, "tmp"); SEG = os.path.join(TMP, "seg")
os.makedirs(SEG, exist_ok=True)

md = open(os.path.join(VDIR, "script.md"), encoding="utf-8").read().split("## Чистый текст")[0]
paras = [m.group(1).strip() for l in md.splitlines() if (m := re.match(r"^\| (.+?) \| (.+?) \|$", l)) and not l.startswith(("| EN", "|---"))]
assert len(paras) == 39, len(paras)

# ---------------- shot plan ----------------
ALERT = ['FRAUD ALERT: Did you attempt', 'a purchase of $1,249.99?', 'Reply YES or NO']
PLAN = {
 0: ("kitchen", {}, {"buzz": "got a text", "bubble": "Fraud alert"}, None),
 1: ("kitchen", {}, {"bubble": -5, "reply": 0.1, "spin": "Forty", "balance": "eighteen", "gone": "gone"}, None),
 2: ("kitchen", {"phone": "ear", "talk": 1, "zoom": 1.3, "cx": 820, "cy": 500}, {"shield": "whole time", "crack": "stopping"}, "glitch"),
 3: ("anatomy", {}, {"l0": "apart", "l1": "piece by", "l2": "By the end", "l3": "exactly what"}, "wipe"),
 4: ("casefile", {}, {"stamp": "composite"}, "wipe"),
 5: ("phone", {"lens": 1, "msgs": [{"who": "in", "txt": ALERT, "at": -1}], "checks": [{"txt": "No link"}, {"txt": "No typos"}, {"txt": "Looks harmless", "bad": 1}]},
     {"c0": "no link", "c1": "spelling", "c2": "Just a simple"}, "wipe"),
 6: ("guard", {}, {"nolink": "no link at all", "down": "guard goes down"}, "wipe"),
 7: ("kitchen", {"worried": 1, "zoom": 1.12, "cx": 1000}, {"bubble": 0.05, "think": "Over a thousand", "reply": "reply NO"}, "wipe"),
 8: ("callcenter", {"smirk": 1, "monitor": [{"txt": 'NEW REPLY: "NO"', "c": "#7a1020"}, {"txt": "✓ Real person"}, {"txt": "✓ Worried"}, {"txt": "✓ Ready to talk"}]},
     {"m0": 0.2, "m1": "real person", "m2": "is worried", "m3": "ready to talk", "smirk": "ready to talk"}, "glitch"),
 9: ("phone", {"msgs": [{"who": "in", "txt": ALERT, "at": -1}, {"who": "out", "txt": ["NO"], "w": 110, "at": -1},
               {"who": "in", "txt": ["Thank you. A fraud specialist", "will contact you shortly.", "Do not use your card."], "at": "KW:reply almost", "typing": 0.8, "hl": "KW:Notice"}],
     "stampTxt": "THE SETUP"}, {"stamp": "setup"}, "wipe"),
 10: ("kitchen", {"ringDur": 99}, {"ring": "phone rings"}, "wipe"),
 11: ("callcenter", {"smirk": 1, "monitor": [{"txt": "Real number: +1 555-0199"}, {"txt": 'Shows as: "Your Bank"', "c": "#7a1020"}, {"txt": "= SPOOFING", "c": "#7a1020"}]},
      {"m0": "caller ID can lie", "m1": "any name", "m2": "spoofing"}, "glitch"),
 12: ("split", {"tag": '"MARK"', "tag2": '"Fraud Prevention" (fake)'}, {"tag": "Mark"}, "wipe"),
 13: ("split", {"tag": '"MARK"', "tag2": '"Fraud Prevention" (fake)', "cards": [["Full name", "Denise R."], ["Card ending", "•••• 4417"], ["Address", "✓ known"]]},
      {"tag": -5, "k0": "full name", "k1": "last four", "k2": "address"}, None),
 14: ("darkweb", {}, {"sold": "sold online"}, "glitch"),
 15: ("split", {"fake": "✓ Charge blocked", "say": '"Can you read me the code?"'}, {"fake": "blocked", "say": "read it back"}, "wipe"),
 16: ("phone", {"msgs": [{"who": "in", "txt": ["Your verification code is 482913.", "Never share this code. We will", "never call you to ask for it."], "at": "KW:real text", "hl": "KW:Never share"}],
      "title": "A REAL TEXT FROM HER REAL BANK"}, {"buzz": "real text"}, "wipe"),
 17: ("split", {"dTalk": 1, "sweat": 1, "dBrow": 1, "digits": 1}, {"dTalk": "reads the code", "digits": "reads the code"}, "wipe"),
 18: ("lock", {}, {"code": 0.3, "key": "key to her", "open": "last thing"}, "wipe"),
 19: ("callcenter", {"smirk": 1, "access": 1, "glow": "glowG", "monitor": [{"txt": "ACCOUNT: DENISE R.", "c": "#063", "tc": "#3ddc84"}]}, {"m0": 0.05, "access": 0.25}, "glitch"),
 20: ("split", {"red": 1, "angry": 1, "dBrow": 1, "dWide": 1.4, "sweat": 1}, {}, "flash"),
 21: ("transfer", {}, {"type": 0.3, "press": "Instant", "sent": "Confirmed"}, "wipe"),
 22: ("vault", {}, {"fall": "There is no secure", "say": "real bank will never"}, "wipe"),
 23: ("flow", {}, {"n0": 0.2, "n1": "money mule", "n2": "split", "n3": "crypto"}, "wipe"),
 24: ("kitchen", {"day": 1, "phone": "ear", "talk": 1, "brow": 1, "smile": -1, "morningTxt": "THE NEXT MORNING"}, {}, "flash"),
 25: ("verdict", {}, {"stamp": "authorized payment", "heart": "never hacked", "crack": "hacked Denise"}, "wipe"),
 26: ("ai", {}, {"write": "perfect messages", "voice": "clone voices", "tested": "tested on"}, "glitch"),
 30: ("psych", {}, {"i0": "Urgency", "i1": "Authority", "i2": "cruelest"}, "wipe"),
 31: ("stat", {}, {"top": "most reported"}, "wipe"),
 32: ("anatomy", {"weak": 1, "title": "THE WEAK SPOTS", "labels": ["URGENCY", "FAKE CALLER ID", '"READ ME THE CODE"', '"MOVE YOUR MONEY"']},
      {"l0": "good news", "l1": "same weak", "l2": "once you see", "l3": "unsee"}, "wipe"),
 34: ("checklist", {"title": "5 RED FLAGS", "items": ['A "fraud alert" that asks you to reply', "Caller ID shows your bank — it can be faked",
      "Anyone asking for a code you were texted", 'Any request to move money "to keep it safe"', 'Pressure: "do it right now"']},
      {"i0": "One:", "i1": "Two:", "i2": "Three:", "i3": "Four:", "i4": "five:"}, "wipe"),
 35: ("checklist", {"good": 1, "title": "WHAT TO DO", "items": ["Don't reply. Don't call numbers in the text.", "Hang up. Call the number on your card.",
      "Never share a code.", 'Never move money "to protect it".']}, {"i0": "Don't reply", "i1": "hang up", "i2": "Never share", "i3": "Never move"}, "wipe"),
 36: ("report", {}, {"u0": "ReportFraud", "u1": "I-C-3", "pw": "passwords"}, "wipe"),
 37: ("share", {}, {"send": "share this video"}, "wipe"),
 38: ("next", {}, {}, "glitch"),
 27: ("costumes", {"mode": "intro"}, {"c0": "different costumes"}, "glitch"),
 28: ("costumes", {"mode": "cards"}, {"c0": "package", "c1": "Amazon", "c2": "government"}, "wipe"),
 29: ("costumes", {"mode": "chips"}, {"e0": "Scare", "e1": "call you", "e2": "get the code", "e3": "move your money"}, None),
 33: ("quiz", {}, {"pause": "PAUSE_START", "resume": "PAUSE_END", "f0": "REVEAL+0", "f1": "REVEAL+0.5", "f2": "REVEAL+1.0", "f3": "REVEAL+1.5"}, "wipe"),
}
INSERT = {5: [("anim", "intro-3d"), ("chapter", 1, "THE TEXT")], 10: [("chapter", 2, "THE CALL"), ("anim", "ringing-phone-3d")],
          15: [("chapter", 3, "THE CODE")], 20: [("chapter", 4, 'THE "SAFE"|ACCOUNT'), ("anim", "alert-transition-3d")], 32: [("chapter", 5, "PROTECT|YOURSELF")]}
TENSE = set(range(17, 24))
SFX_FOR = {"buzz": "buzz", "bubble": "ding", "reply": "pop", "spin": "tick", "balance": "drain", "gone": "impact", "ring": "ring", "shield": "pop", "crack": "glass",
           "stamp": "stamp", "think": "pop", "m": "blip", "k": "blip", "c": "tick", "sold": "stamp", "digits": "blip", "open": "unlock", "access": "success", "press": "click",
           "sent": "cash", "fall": "impact", "say": "type", "n": "whoosh_s", "heart": "pop", "tested": "pop", "i": "pop", "u": "type", "pw": "pop", "send": "whoosh_s",
           "top": "pop", "f": "stamp", "e": "pop", "pause": "tick", "resume": "ding", "down": "whoosh_d", "nolink": "pop", "l": "pop", "code": "type", "key": "pop", "write": "type", "voice": "synth", "fake": "ding", "tag": "pop", "dTalk": None, "smirk": None, "type": "type"}
TRANS_SFX = {"wipe": "whoosh", "glitch": "glitch", "flash": "impact"}
TTS_FIX = [("FTC", "F.T.C."), ("Mrs. R.", "Missus R."), ("Mrs. R", "Missus R")]
CAP_FIX = [("one thousand, two hundred and forty-nine dollars", "$1,249"), ("eighteen thousand, four hundred dollars", "$18,400"), ("4-8-2-9-1-3", "482913"),
           ("fifteen point nine billion dollars", "$15.9 billion"), ("ReportFraud dot F-T-C dot gov, and I-C-3 dot gov", "ReportFraud.ftc.gov and ic3.gov")]
HIGHLIGHT = ["NO", "$18,400", "$1,249", "482913", "$15.9 billion", "code", "secure account", "caller ID can lie", "never", "red flags", "spoofing", "money mule",
             "hang up", "AI", "authorized payment", "trust"]

# ---------------- audio synth ----------------
rng = np.random.default_rng(5)
def tt(d): return np.arange(int(d * SR)) / SR
def envd(d, k): return np.exp(-tt(d) * k)
def lp(x, a):
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def sfx(name):
    if name == "whoosh":
        n = int(.7 * SR); x = rng.standard_normal(n); y = lp(x, .12); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2; return .6 * y / np.abs(y).max() * e
    if name == "whoosh_s": return sfx("whoosh")[: int(.4 * SR)] * .6
    if name == "whoosh_d":
        t = tt(.9); return .5 * np.sin(2 * np.pi * np.cumsum(600 * np.exp(-t * 3) + 80) / SR) * envd(.9, 3)
    if name == "buzz":
        t = tt(.8); g = ((t % .4) < .3).astype(float); return .35 * np.sign(np.sin(2 * np.pi * 160 * t)) * g * (.6 + .4 * np.sin(2 * np.pi * 9 * t))
    if name == "ding":
        t = tt(1.0); return .35 * (np.sin(2 * np.pi * 1320 * t) * envd(1, 5) + .7 * np.sin(2 * np.pi * 1760 * t) * envd(1, 6) * (t > .12))
    if name == "pop":
        t = tt(.12); return .45 * np.sin(2 * np.pi * np.cumsum(400 + 900 * t / .12) / SR) * envd(.12, 25)
    if name == "tick":
        t = tt(.06); return .5 * np.sin(2 * np.pi * 2400 * t) * envd(.06, 80)
    if name == "blip":
        t = tt(.09); return .3 * np.sin(2 * np.pi * 1200 * t) * envd(.09, 30)
    if name == "drain":
        t = tt(1.0); return .45 * np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 2.5) + 70) / SR) * (1 - t)
    if name == "impact":
        t = tt(1.4); f = 90 * np.exp(-t * 3) + 38; return .9 * np.sin(2 * np.pi * np.cumsum(f) / SR) * envd(1.4, 3.2) + .2 * rng.standard_normal(len(t)) * envd(1.4, 20)
    if name == "ring":
        t = tt(4.0); return .16 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * ((t % 2) < 1) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 20 * t)))
    if name == "glass":
        x = rng.standard_normal(int(.6 * SR)); y = x - lp(x, .3); return .5 * y / np.abs(y).max() * envd(.6, 9)
    if name == "stamp":
        t = tt(.4); return .8 * np.sin(2 * np.pi * 70 * t) * envd(.4, 14) + .3 * rng.standard_normal(len(t)) * envd(.4, 40)
    if name == "unlock":
        return np.concatenate([sfx("tick") * 1.4, np.zeros(int(.12 * SR)), sfx("stamp") * .6])
    if name == "success":
        out = np.zeros(int(1.0 * SR))
        for k, f in enumerate([523, 659, 784, 1047]):
            s0 = int(k * .1 * SR); t = tt(.5); out[s0:s0 + len(t)] += .25 * np.sin(2 * np.pi * f * t) * envd(.5, 6)
        return out
    if name == "click": return sfx("tick") * 1.2
    if name == "cash":
        out = sfx("success") * .5
        for k in range(6):
            s0 = int((.05 + k * .07) * SR); t = tt(.25); f = 3000 + rng.uniform(-400, 600); out[s0:s0 + len(t)] += .15 * np.sin(2 * np.pi * f * t) * envd(.25, 18)
        return out
    if name == "type":
        out = np.zeros(int(1.4 * SR))
        for k in range(14):
            s0 = int((k * .09 + rng.uniform(0, .03)) * SR); c = sfx("tick") * rng.uniform(.4, .8); out[s0:s0 + len(c)] += c
        return out
    if name == "glitch":
        n = int(.35 * SR); x = rng.standard_normal(n); x = np.repeat(x[::40], 40)[:n]; return .35 * x * ((np.arange(n) // 1500) % 2)
    if name == "synth":
        t = tt(1.2); return .2 * np.sin(2 * np.pi * (220 + 60 * np.sin(2 * np.pi * 7 * t)) * t) * np.sin(np.pi * t / 1.2)
    raise KeyError(name)
def heartbeat(d):
    out = np.zeros(int(d * SR)); t = tt(.18)
    beat = np.sin(2 * np.pi * 55 * t) * envd(.18, 18)
    for s in np.arange(0, d, .85):
        for o, g in ((0, 1), (.22, .7)):
            i = int((s + o) * SR); seg = beat[: max(0, len(out) - i)]; out[i:i + len(seg)] += .5 * g * seg
    return out
def music(n):
    t = np.arange(n) / SR; m = np.zeros(n)
    for f, a in [(55, .5), (82.41, .35), (110, .25), (130.81, .18), (164.81, .1)]:
        m += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (.6 + .4 * np.sin(2 * np.pi * t / rng.uniform(9, 17)))
    return m / np.abs(m).max()

# ---------------- TTS ----------------
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
def tts(text):
    for a, b in TTS_FIX: text = text.replace(a, b)
    a, sr = kok.create(text, voice=VOICE, speed=SPEED, lang="en-us"); return a.astype(np.float32)

def kw_time(text, key, voiced):
    if isinstance(key, (int, float)): return float(key)
    i = text.lower().find(key.lower())
    if i < 0: print("WARN keyword not found:", key, "|", text[:60]); return voiced * .5
    return voiced * i / len(text)

def resolve(obj, text, voiced):
    if isinstance(obj, str) and obj.startswith("KW:"): return kw_time(text, obj[3:], voiced)
    if isinstance(obj, dict): return {k: resolve(v, text, voiced) for k, v in obj.items()}
    if isinstance(obj, list): return [resolve(v, text, voiced) for v in obj]
    return obj

def anim_frames(name):
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(VDIR, "anim", name + ".mp4")]).decode())
    return int(round(d * FPS))

# ---------------- timeline ----------------
segs = []; audio = []; caps = []; jobs = []; chapters = {}; tense_ranges = []
frame = 0
def add_sfx(at_frame, name, g=.8):
    if name: audio.append((at_frame, sfx(name), g, "fx"))
for idx, text in enumerate(paras):
    for ins in INSERT.get(idx, []):
        if ins[0] == "anim":
            n = anim_frames(ins[1]); segs.append(("anim", ins[1], n))
            add_sfx(frame, {"intro-3d": "whoosh", "ringing-phone-3d": "ring", "alert-transition-3d": "impact"}[ins[1]], .9)
        else:
            n = 2 * FPS; sid = f"c{ins[1]}"; chapters[ins[2].replace("|", " ")] = frame / FPS
            jobs.append({"id": sid, "frames": n, "shot": {"scene": "chapter", "dur": 2, "p": {"n": ins[1], "title": ins[2]}, "trans": "wipe"}}); segs.append(("seg", sid, n))
            add_sfx(frame, "whoosh", .9); add_sfx(frame + 8, "stamp", .6)
        frame += n
    special = {}
    if "…" in text:
        pa_, pb_ = text.split("…", 1); A1 = tts(pa_.strip()); A2 = tts(pb_.strip()); gap = 4.0
        a = np.concatenate([A1, np.zeros(int(gap * SR), np.float32), A2]); special = {"PAUSE_START": len(A1) / SR, "PAUSE_END": len(A1) / SR + gap, "REVEAL": len(a) / SR + .2}
    else:
        a = tts(text)
    voiced = len(a) / SR; pause = .45 if idx not in (4, 38) else .9
    if special: pause = 3.2
    n = int(math.ceil((voiced + pause) * FPS)); d = n / FPS
    scene, p, ev, trans = PLAN[idx]
    def evt(v):
        if isinstance(v, str) and special and v.split("+")[0] in special:
            b_, _, o_ = v.partition("+"); return special[b_] + (float(o_) if o_ else 0)
        return kw_time(text, v, voiced)
    evr = {k: evt(v) for k, v in ev.items()}
    pr = resolve(p, text, voiced)
    sid = f"p{idx:02d}"
    jobs.append({"id": sid, "frames": n, "shot": {"scene": scene, "dur": d, "p": pr, "ev": evr, "trans": trans}}); segs.append(("seg", sid, n))
    audio.append((frame, a, 1.0, "voice"))
    if trans: add_sfx(frame, TRANS_SFX[trans], .7)
    for k, v in evr.items():
        if v is None or v < 0: continue
        key = k if k in SFX_FOR else re.sub(r"\d+$", "", k)
        add_sfx(frame + int(v * FPS), SFX_FOR.get(key), .7)
    for m in pr.get("msgs", []) if isinstance(pr, dict) else []:
        if isinstance(m.get("at"), (int, float)) and m["at"] >= 0: add_sfx(frame + int(m["at"] * FPS), "ding", .6)
    if idx in TENSE: tense_ranges.append((frame, frame + n))
    if idx == 17: audio.append((frame, heartbeat(d), .8, "fx"))
    # captions
    cap = text
    for x, y in CAP_FIX: cap = cap.replace(x, y)
    words = cap.split(); chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= 7 or (re.search(r"[.?!:]\"?$", w) and len(cur) >= 3): chunks.append(" ".join(cur)); cur = []
    if cur: chunks.append(" ".join(cur))
    tot = sum(len(c) for c in chunks); t0 = frame / FPS
    for c in chunks:
        dd = voiced * len(c) / tot; caps.append((t0, t0 + dd, c)); t0 += dd
    if idx in (27, 30, 33, 38): chapters[{27: "Same scam, different costumes", 30: "Why it works", 33: "Quick test + 5 red flags", 38: "Next: money mules"}[idx]] = frame / FPS
    if idx == 24: chapters["Why the bank said no"] = frame / FPS
    frame += n
jobs.append({"id": "end", "frames": 15 * FPS, "shot": {"scene": "endscreen", "dur": 15, "p": {}, "ev": {}, "trans": "wipe"}}); segs.append(("seg", "end", 15 * FPS))
add_sfx(frame, "whoosh", .7); frame += 15 * FPS
TOTAL = frame
print("total", TOTAL / FPS, "s; jobs", len(jobs), flush=True)

# ---------------- render (parallel workers) ----------------
W = 4; buckets = [[] for _ in range(W)]; loads = [0] * W
for j in sorted(jobs, key=lambda j: -j["frames"]):
    k = loads.index(min(loads)); buckets[k].append(j); loads[k] += j["frames"]
procs = []
for k in range(W):
    jf = os.path.join(TMP, f"jobs{k}.json"); json.dump(buckets[k], open(jf, "w"))
    procs.append(subprocess.Popen(["node", os.path.join(HERE, "cartoon", "render_shots.js"), jf, SEG]))
for pr_ in procs: pr_.wait(); assert pr_.returncode == 0
lst = open(os.path.join(TMP, "list.txt"), "w")
for kind, name, n in segs:
    if kind == "anim":
        dst = os.path.join(SEG, name + ".mp4")
        if not os.path.exists(dst):
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(VDIR, "anim", name + ".mp4"), "-vf", "scale=1920:1080,fps=30", "-frames:v", str(n),
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", dst], check=True)
        lst.write(f"file '{dst}'\n")
    else: lst.write(f"file '{os.path.join(SEG, name + '.mp4')}'\n")
lst.close()

# ---------------- mix ----------------
N = int(TOTAL / FPS * SR) + SR
voice = np.zeros(N, np.float32); fx = np.zeros(N, np.float32)
for f0, smp, g, kind in audio:
    s0 = int(f0 / FPS * SR); seg = smp[: max(0, N - s0)] * g
    (voice if kind == "voice" else fx)[s0:s0 + len(seg)] += seg
voice = voice / np.abs(voice).max() * .9
mus = music(N) * .05
for a, b in tense_ranges:  # tension pulse
    s0, s1 = int(a / FPS * SR), int(b / FPS * SR); t = np.arange(s1 - s0) / SR
    mus[s0:s1] += .05 * np.sin(2 * np.pi * 41 * t) * (np.sin(2 * np.pi * 2 * t) > .6)
duck = np.convolve((np.abs(voice) > .02).astype(float), np.ones(SR // 4) / (SR // 4), "same")
mus *= 1 - .45 * np.clip(duck * 3, 0, 1)
mix = voice + fx * .55 + mus; mix = mix / np.abs(mix).max() * .95
sf.write(os.path.join(TMP, "mix.wav"), mix, SR)

# ---------------- captions ----------------
def ts(t, ass=True):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}" if ass else f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
def hl(c):
    for k in sorted(HIGHLIGHT, key=len, reverse=True):
        c = re.sub(r"(?<![\w$])(" + re.escape(k) + r")(?![\w])", r"{\\c&H66D1FF&}\1{\\c&HFFFFFF&}", c)
    return c
ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Cap,Inter,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,5,2,2,160,160,48,1", "", "[Events]",
       "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
srt = []
for i, (a_, b_, c) in enumerate(caps):
    ass.append(f"Dialogue: 0,{ts(a_)},{ts(b_)},Cap,,0,0,0,,{hl(c)}"); srt += [str(i + 1), f"{ts(a_, False)} --> {ts(b_, False)}", c, ""]
open(os.path.join(TMP, "cap.ass"), "w").write("\n".join(ass)); open(os.path.join(OUT, "captions.srt"), "w").write("\n".join(srt))

subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"), "-i", os.path.join(TMP, "mix.wav"),
                "-vf", f"subtitles={os.path.join(TMP, 'cap.ass')}:fontsdir=/usr/share/fonts/opentype/inter", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
                "-movflags", "+faststart", os.path.join(OUT, "video.mp4")], check=True)
json.dump({"duration_s": TOTAL / FPS, "voice": VOICE, "speed": SPEED, "chapters": chapters}, open(os.path.join(OUT, "build.json"), "w"), indent=1)
print("done", os.path.join(OUT, "video.mp4"), flush=True)
