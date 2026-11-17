# Video 03 — AI voice clone scam. Paper style, channel colors.
import os, re
_md = open(os.path.join(VDIR, "script.md"), encoding="utf-8").read()
P = [m.group(1).strip() for l in _md.splitlines() if (m := re.match(r"^\| (.+?) \| (.+?) \|$", l)) and not l.startswith(("| EN", "|---"))]
assert len(P) == 44, len(P)

TTS_FIX = [("9:14", "nine fourteen"), ("I-C-3", "I C 3"), ("reportfraud dot FTC", "report fraud dot F T C")]
HIGHLIGHT = ["Rose", "Jake", "Mark", "nine thousand dollars", "twelve thousand", "safe word", "Three seconds", "AI"]
GAP = 0.5

def L(pre, shots, extra=0.0):
    m = [p for p in P if p.startswith(pre)]
    assert len(m) == 1, pre
    return (m[0], shots, extra)
ROSE_CALL = {}
LINES = [
 L('At 9:14 on a', [(0, "ring", {}, {"clock": 0.3, "pick": "phone rang+0.7", "cry": "crying"}, None, [(0.0, "ring"), ("phone rang+0.7", "pop"), ("clock", "pop")]),
       ("And twenty", "handoff", {"later": "20 MINUTES LATER", "cash": 1}, {"give": "handed", "amt": "nine thousand"}, "page", {"amt": "cash"})], 0.5),
 L("Here's the thing. Jake", [(0, "classroom", {}, {"never": 0.3, "mute": "silent", "miles": "two hundred"}, "iris", {"never": "stamp", "mute": "pop", "miles": "pop"})]),
 L('The voice Rose heard', [(0, "clone", {}, {"wave": "Made by", "copy": "Jake posted", "sec": "Three seconds"}, "page", {"wave": "glitch", "copy": "pop", "sec": "stamp"})], 0.4),
 L("Today, we're taking apart", [(0, "anat", {}, {"split": 0.5, "q": "one question", "w": "one word"}, "slide", {"split": "rip", "q": "pop", "w": "pop"})]),
 L('This story is a', [(0, "casefile", {}, {"fbi": "FBI", "ftc": "Federal Trade", "names": "Names are changed", "real": "playbook"}, "page",
       {"fbi": "stamp", "ftc": "stamp", "names": "stamp", "real": "stamp"})], 0.6),
 L('Rose is seventy-six. She', [(0, "garden", {}, {"name": "Rose is", "age": "seventy", "sunday": "every Sunday", "voice": "She knows"}, "iris", {"name": "pop", "age": "pop", "sunday": "pop", "voice": "ding"})]),
 L('So when the phone', [(0, "call", {"mood": "ok", "lines": [{"txt": ["Grandma? Grandma, it's me."]}]}, {"b0": "Grandma?"}, "page", [(0.0, "ring"), ("Grandma?", "pop")])]),
 L('"I messed up. I', [(0, "imagine", {}, {"cloud": 0.2, "crash": "car accident", "arrest": "arrested"}, None, {"cloud": "pop", "crash": "stamp", "arrest": "uhoh"})]),
 L('It was his voice.', [(0, "call", {"match": 1, "heart": 1}, {"m0": "It was his voice", "m1": "The way", "m2": "little crack", "heart": "heart was"}, "slide",
       {"m0": "pop", "m1": "pop", "m2": "stamp", "heart": "heart"})]),
 L('Then came the line', [(0, "call", {"tears": 1, "lines": [{"txt": ["Please don't tell Mom and Dad.", "They'll kill me.", "Promise me, Grandma."], "w": 960}]},
       {"b0": "Please don", "tears": 0}, None, {"b0": "pop"})]),
 L('And Rose promised. That', [(0, "call", {"promise": 1, "mood": "ok", "mouth": "flat"}, {"promise": 0.2}, None, {"promise": "pop"}),
        ("That single", "wall", {}, {"wall": "That single+0.3", "cut": "second opinion"}, "page", {"wall": "rip", "cut": "stamp"})], 0.4),
 L("Why does this work", [(0, "brain", {}, {"logic": "attack your logic", "love": "attacks your love", "flip": "rescue mode", "stop": "stop asking"}, "iris",
        {"logic": "pop", "love": "heart", "flip": "click", "stop": "stamp"})]),
 L('"Jake" said his lawyer', [(0, "call", {"lines": [{"txt": ["My lawyer will explain."], "w": 700}]}, {"b0": 0.3}, None, {"b0": "pop"}),
        ("A few seconds", "mark", {"talk": True}, {}, "page", {})]),
 L('"Ma\'am, my name is', [(0, "mark", {"name": "ROBERT DANIELS", "role": "Attorney at law", "fake": 1}, {"name": "Robert Daniels", "fake": "difficult situation"}, None,
        {"name": "pop", "fake": "stamp"})]),
 L("You've met this man", [(0, "costumes", {}, {"r0": "called Denise", "r1": "Sarah from HR", "r2": "Different costume", "same": "Same playbook"}, "iris",
        {"r0": "whoosh", "r1": "whoosh", "r2": "whoosh", "same": "stamp"})], 0.4),
 L('"The judge set bail', [(0, "mark", {"docTitle": "BAIL NOTICE", "doc": ["Bail: $9,000", "Pay TODAY", "CASH ONLY", "Tell NO ONE"]},
        {"doc": 0.2, "d0": "nine thousand", "d1": "pay today", "d2": "has to be cash", "d3": "gag order"}, "page",
        {"d0": "pop", "d1": "pop", "d2": "pop", "d3": "stamp"})]),
 L('Notice how fast it', [(0, "speed", {}, {"i0": "Accident", "i1": "arrest", "i2": "lawyer", "i3": "bail", "i4": "cash,", "i5": "secret", "fast": "under ten", "act": "want you to act"}, "slide",
        {"i0": "pop", "i1": "pop", "i2": "pop", "i3": "pop", "i4": "pop", "i5": "pop", "fast": "tick", "act": "stamp"})]),
 L('And for the record:', [(0, "cards", {"title": "REAL BAIL DOESN'T WORK LIKE THIS", "tfs": 74, "y0": 360, "h": 150,
        "items": [{"txt": "A court sends a courier to your house", "ok": False}, {"txt": "A lawyer asks you to keep bail secret", "ok": False}]},
        {"title": 0.3, "c0": "Courts don", "c1": "no real lawyer"}, "page", {"c0": "pop", "c1": "pop"})], 0.4),
 L('Rose drove to her', [(0, "bank", {}, {"ask": "teller asked", "lie": "said it was"}, "iris", {"ask": "pop", "lie": "pop"})]),
 L("That's not an accident", [(0, "mark", {"docTitle": "WHAT TO SAY", "doc": ["If the bank asks:", '"It\'s for a new roof."', "Never mention Jake."]},
        {"doc": 0.2, "d0": "coach", "d1": "exactly what", "d2": "at the bank"}, "page", {"d0": "pop", "d1": "pop", "d2": "pop"}),
        ("Because bank staff", "bank", {}, {"ask": -1, "lie": -1, "coach": "stop it"}, "slide", {"coach": "stamp"})]),
 L('An hour later, a', [(0, "handoff", {"later": "1 HOUR LATER", "secs": "IN 30 SECONDS"}, {"give": "handed him", "amt": "nine thousand", "gone": "He was gone", "secs": "thirty seconds"}, "page",
        [("knocked", "knock"), ("knocked+0.25", "knock"), ("handed him", "pop"), ("He was gone", "whoosh")])]),
 L('Then the phone rang', [(0, "mark", {"big": "+$12,000", "big2": "BAIL WENT UP", "bigY": 420}, {"big": "another twelve", "big2": "went up"}, "slide",
        [(0.0, "ring"), ("went up", "pop"), ("another twelve", "stamp")])]),
 L('This is the second', [(0, "hook", {}, {"hook": 0.3, "call": "called Jake"}, "page", {"hook": "boing", "call": "ding"})]),
 L('He picked up on', [(0, "split", {}, {"b0": "Grandma?", "relief": "What's going+0.4"}, "iris", [(0.0, "ring"), ("Grandma?", "pop"), ("What's going+0.4", "success")])], 0.8),
 L('So how did a', [(0, "puzzle", {"q": 1}, {"q": 0.4}, "page", {"q": "boing"})]),
 L('Jake had posted a', [(0, "clone", {"pub": "PUBLIC VIDEO", "sec": "15 SECONDS", "says": "Grandma, it's me."}, {"pub": "posted", "sec": "Fifteen seconds", "wave": "Researchers", "copy": "convincing copy"}, "slide",
        {"pub": "pop", "sec": "stamp", "wave": "glitch", "copy": "pop"})]),
 L("From there, it's a", [(0, "puzzle", {}, {"p0": "His name", "p1": "his school", "p2": "Grandma's name", "p3": "data leak", "tree": "family tree"}, "page",
        {"p0": "pop", "p1": "pop", "p2": "pop", "p3": "pop", "tree": "ding"})]),
 L("And the clone doesn't", [(0, "callerid", {}, {"panic": "Panic covers", "fake": "caller ID can be faked"}, "iris", [(0.0, "ring"), ("Panic covers", "pop"), ("caller ID can be faked", "rip"), ("caller ID can be faked+0.6", "stamp")])]),
 L('The FTC has warned', [(0, "stat", {}, {"ftc": 0.4, "fbi": "FBI reports"}, "page", {"ftc": "pop", "fbi": "cash"})]),
 L("And it's not only", [(0, "targets", {}, {"r0": "Parents", "r1": "Office workers", "rec": "The recipe"}, "slide", {"r0": "pop", "r1": "pop", "rec": "stamp"})], 0.4),
 L("But here's the good", [(0, "goodnews", {}, {"a": "copy how", "b": "can't copy"}, "slide", {"a": "ding", "b": "uhoh"})], 0.6),
 L('Quick test. Your phone', [(0, "quiz", {}, {"b0": "It's your son", "q": "What do you do", "pause": "Pause the video"}, "page", [(0.0, "ring"), ("What do you do", "pop"), ("Pause the video", "stamp")])], 1.5),
 L('The answer: hang up,', [(0, "callback", {}, {"hang": "hang up", "call": "call your son back", "sec": "Twenty seconds", "over": "scam is over"}, "iris",
        {"hang": "click", "call": "ding", "sec": "tick", "over": "success"})]),
 L("And if the caller", [(0, "donthang", {}, {"b0": "Don't hang", "hang": "exactly when", "sec": "twenty-second"}, "page", {"b0": "pop", "hang": "click", "sec": "success"})], 0.4),
 L('Here are the five', [(0, "flags", {}, {"f0": "Red flag one", "f1": "Red flag two"}, "page", {"f0": "stamp", "f1": "stamp"})]),
 L('Red flag three: they', [(0, "flags", {"pre": 2}, {"f2": "Red flag three", "f3": "Red flag four"}, None, {"f2": "stamp", "f3": "stamp"})]),
 L('And red flag five:', [(0, "flags", {"pre": 4}, {"f4": "red flag five"}, None, {"f4": "stamp"})], 0.6),
 L('Now, the one question', [(0, "call", {"bgk": "yellow", "mood": "ok", "mouth": "flat", "glitch": 1,
         "lines": [{"txt": ["Ask: \"What did we eat", "at Thanksgiving?\""], "w": 900, "fill": "#FFF6DA", "wavy": 0, "until": "glitch"}]},
        {"b0": "Ask something", "glitch": "A clone can't+-0.6", "fail": "can't answer"}, "page", {"b0": "pop", "glitch": "glitch", "fail": "stamp"})], 0.4),
 L('Even better: agree on', [(0, "safeword", {}, {"word": "family safe word", "fbi": "FBI recommends", "no": "doesn't know the word"}, "iris", {"word": "ding", "fbi": "stamp", "no": "pop"})]),
 L('Two more habits. Make', [(0, "cards", {"title": "TWO MORE HABITS", "y0": 360, "h": 150,
         "items": [{"txt": "Make your accounts private", "ok": True}, {"txt": "Let unknown numbers go to voicemail", "ok": True}]},
        {"title": 0.2, "c0": "private", "c1": "voicemail"}, "page", {"c0": "pop", "c1": "pop"})]),
 L('If it already happened', [(0, "cards", {"title": "IF IT ALREADY HAPPENED", "y0": 230, "h": 110, "foot": "DON'T BE ASHAMED",
         "items": [{"txt": "Call your bank right away", "ok": True}, {"txt": "Call the police", "ok": True}, {"txt": "reportfraud.ftc.gov", "ok": True}, {"txt": "ic3.gov", "ok": True}]},
        {"title": 0.2, "c0": "call the bank", "c1": "call the police", "c2": "reportfraud", "c3": "I-C-3", "foot": "don't be ashamed"}, "slide",
        {"c0": "pop", "c1": "pop", "c2": "pop", "c3": "pop", "foot": "ding"})], 0.4),
 L("Rose didn't get her", [(0, "ending", {}, {"lost": 0.4, "saved": "stop the next", "word": "safe word"}, "page", {"lost": "uhoh", "saved": "success", "word": "pop"})]),
 L("So here's your homework.", [(0, "share", {}, {"title": 0.2, "send": "Send this video", "call": "call them"}, "iris", {"send": "send", "call": "pop"})], 0.5),
 L('Next time on Scam', [(0, "next", {}, {"next": 0.3, "wave": "biggest scam", "sub": "Subscribe"}, "page", {"next": "whoosh", "wave": "stamp", "sub": "pop"})]),
]
