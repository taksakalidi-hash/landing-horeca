# Shot plan for Video 02 — Money Mules. Executed by tools/build_cartoon.py and tools/preview_plan.py.
# Shots are keyed by the opening words of each narration paragraph (robust to inserting paragraphs).
JOBTXT = ["JOB OFFER: Payment Assistant.", "Earn $3,500/mo + 10%. Receive", "client payments to your bank,", "send the rest via Bitcoin ATM.", "Reply YES to start today!"]
HELLO = {"who": "in", "txt": ["Hi Tyler! 👋 Sarah from HR here.", "Loved your profile — you're hired!"], "at": -1}
SHOTS = [
 ("This is Tyler", ("room", {"brow": .3, "label": "TYLER, 24", "stampTxt": "KNOCK KNOCK"}, {"label": "This is Tyler", "stamp": "knock"}, None)),
 ("Because, without knowing", ("trace", {"env": "map"}, {"n0": "Remember Denise", "n1": "Tyler moved", "n2": 99, "n3": 99}, "glitch")),
 ("Tyler is what investigators", ("web", {"title": "MONEY MULES"}, {"m0": "money mule"}, "wipe")),
 ("This story is a composite", ("casefile", {"env": "desk", "name": "CASE FILE: TYLER M.", "lines": ["Based on real FBI and DOJ cases.", "Names changed.", "The playbook is real."]}, {"stamp": "composite"}, "wipe")),
 ("Tyler had just lost", ("room", {"brow": 1, "sweat": .5, "label": "JUST LOST HIS JOB", "apps": ["Warehouse Associate", "Delivery Driver", "Retail Clerk", "Customer Support", "Data Entry"]},
     {"label": "lost his warehouse", "apps": "every night"}, "wipe")),
 ("Then one morning", ("room", {"day": 1, "phone": "hands", "smile": 1, "notif": {"title": "📩 New email · GlobalPay", "lines": ["Congratulations! 🎉", "Remote Payment Assistant", "$3,500/mo + 10% bonus"], "hl": 2}},
     {"buzz": "one morning", "notif": "Congratulations"}, "wipe")),
 ("It looked professional", ("laptop", {"env": "desk", "kind": "collage"}, {"c0": 0.3, "c1": "website", "c2": "interview"}, "wipe")),
 ("Here's the thing: the FBI", ("laptop", {"env": "desk", "kind": "job", "fbi": 1, "hl": 1}, {"sal": -1, "rem": -1, "exp": -1, "now": -1, "hl": "exactly like this", "fbi": "FBI has warned"}, "glitch")),
 ("And Sarah from HR", ("laptop", {"env": "desk", "kind": "chat", "msgs": [{"who": "in", "txt": ["Hi Tyler! 👋 Sarah from HR here.", "Loved your profile — you're hired!"], "at": 0.1},
                                          {"who": "out", "txt": ["Thank you!! When can I start? 🙏"], "w": 560, "at": "KW:She doesn't"}]},
     {"reveal": "someone we"}, "wipe")),
 ("Within twenty minutes", ("laptop", {"env": "cafe", "kind": "form", "stampTxt": "EVERYTHING A SCAMMER NEEDS", "stampFs": 54},
     {"f0": "full name", "f1": "home address", "f2": "bank details", "f3": "for payroll", "submit": "Everything a", "stamp": "Everything a"}, "wipe")),
 ("Tyler's first task", ("split", {"left": "tyler", "lPhone": "type", "dSmile": 1, "tag": '"SARAH, HR"', "tag2": "(it's Mark)",
             "flow": [["💰", "CLIENTS PAY", "#2f7cf6"], ["🏦", "YOUR ACCOUNT", "#d9731a"], ["🕶️", '"PARTNER"', "#E63946"]]},
     {"tag": 0.2, "f0": "clients will send", "f1": "personal bank account", "f2": "send the rest"}, "wipe")),
 ("Tyler later said", ("docs", {"env": "cork", "title": "IT ALL FELT SO REAL", "stampTxt": "MORE REAL = FEWER QUESTIONS"},
     {"d0": "onboarding", "d1": "dashboard", "d2": "payslip", "stamp": "That's the point"}, "wipe")),
 ("Two days later", ("room", {"phone": "hands", "money": 1, "wide": 1.3, "smile": 1}, {"buzz": "phone buzzed", "money": "A deposit"}, "wipe")),
 ("Sarah's message came", ("laptop", {"env": "desk", "kind": "chat", "msgs": [HELLO, {"who": "in", "txt": ["Great job! 🎉 Withdraw the funds today", "and deposit them into this Bitcoin ATM."], "at": 0.3},
                                           {"who": "in", "txt": ["⏰ Time-sensitive. Our client is waiting."], "at": "KW:Time-sensitive"}]}, {"reveal": -1}, "wipe")),
 ("Tyler hesitated", ("atm", {"keep": 1}, {"cash": "fed cash", "sent": "and kept", "keep": "kept his"}, "wipe")),
 ("In less than an hour", ("trace", {"env": "map"}, {"n0": 0, "n1": 0.15, "n2": "cryptocurrency", "n3": "in a wallet", "fog": "no one could trace", "last": "last real name"}, "wipe")),
 ("Tyler wasn't the only one", ("web", {"env": "cork", "title": "MULES COME FROM EVERYWHERE"}, {"m0": 0.3}, "wipe")),
 ("Meet Linda", ("romance", {"from": "Captain Mike", "label": "LINDA, 67", "msgs": [{"who": "in", "txt": ["Good night, my love ❤️"], "ev": "m0"}, {"who": "in", "txt": ["You're the best thing in my life 🌹"], "ev": "m1"}]},
     {"label": "Meet Linda", "m0": "talking every night", "m1": "charming"}, "wipe")),
 ("One day, Mike asks", ("romance", {"from": "Captain Mike", "label0": "LINDA, 67", "label": "= MONEY MULE", "msgs": [{"who": "in", "txt": ["Good night, my love ❤️"], "at": -1}, {"who": "in", "txt": ["You're the best thing in my life 🌹"], "at": -1},
        {"who": "in", "txt": ["Darling, my account is frozen…", "Friends will send money to you.", "Can you forward it to me?"], "ev": "ask"}, {"who": "out", "txt": ["Of course ❤️"], "ev": "yes"}]},
     {"ask": "Darling", "yes": "Linda says yes", "label": "Of course she"}, "glitch")),
 ("Students get recruited", ("recruit", {"env": "bus"}, {"sell": "sell their bank", "bad": "nothing will happen"}, "wipe")),
 ("Every mule is a link", ("chain", {"env": "map", "title": "EVERY MULE IS A LINK IN THE CHAIN", "nodes": [{"label": "STOLEN $", "sub": "from victims", "icon": "💸"},
     {"label": "TYLER", "who": "tyler"}, {"label": "LINDA", "who": "linda"}, {"label": "STUDENT", "who": "person"}, {"label": '"CLEAN" $', "sub": "to scammers", "icon": "✨"}]},
     {"n0": 0.2, "n1": "link in a chain", "n2": "real people", "n3": "real bank accounts", "n4": "look clean"}, "wipe")),
 ("In fact, money mules", ("chain", {"mode": "pipe", "title": "THE HIDDEN BACKBONE OF FRAUD", "nodes": [{"label": "STOLEN", "sub": "dirty money", "col": "#E63946"},
     {"label": "MULES", "sub": "real accounts", "col": "#d9731a"}, {"label": '"CLEAN"', "sub": "looks legit", "col": "#2fb36b"}], "foot": "NO MULES = MONEY GETS STUCK"},
     {"n0": "backbone", "n1": "Without them", "n2": "stuck", "foot": "stop working"}, "wipe")),
 ("Six weeks later", [("room", {"phone": "hands", "brow": 1, "wide": 1.4, "sweat": 1, "notif": {"title": "🔒 ACCOUNT FROZEN", "tc": "#E63946", "stroke": "#E63946", "lines": ["Your account has been frozen.", "Please contact your branch."]}},
       {"buzz": 0.3, "notif": "banking app", "shock": "Account frozen"}, "wipe", 0),
      ("door", {"frozen": 1, "noFrozen": 1}, {"letter": "letter arrived", "k0": "knock on", "k1": "knock on+0.35", "k2": "knock on+0.7"}, "flash", "Then a letter")]),
 ("Moving money for criminals", ("law", {"env": "court"}, {"title": 0.2, "close": "Banks close", "report": "report them", "charges": "federal charges"}, "wipe")),
 ("And it's not rare", ("stat", {"env": "news", "ticker": "U.S. LAW ENFORCEMENT TARGETS MONEY MULES IN ANNUAL CRACKDOWN  •  FAKE JOB OFFERS USED TO RECRUIT", "value": 4000, "int": 1, "prefix": "", "suffix": "+",
     "label": "SUSPECTED MONEY MULES · ONE U.S. CRACKDOWN", "top": "Warning letters · frozen accounts · charges", "src": "Source: U.S. Department of Justice, Money Mule Initiative"}, {"top": "suspected money"}, "wipe")),
 ("And here's what most people", ("trace", {"env": "map"}, {"n0": 0, "n1": 0, "n2": 0, "n3": 0, "fog": 0, "last": "last real name"}, "wipe")),
 ("For Tyler, the consequences", ("checklist", {"env": "pad", "title": "What Tyler lost", "items": ["Bank account closed", "Flagged: hard to open a new account", "Had to pay the commission back"]},
     {"i0": "closed his account", "i1": "flagged", "i2": "pay it back"}, "wipe")),
 ("And Linda?", ("romance", {"from": "Captain Mike", "smile": -1, "brow": 1, "noHearts": 1, "vanish": 1, "msgs": [{"who": "in", "txt": ["Good night, my love ❤️"], "at": -1},
        {"who": "in", "txt": ["Can you forward it to me?"], "at": -1}]}, {"del": "disappeared overnight"}, "wipe")),
 ("Scammers know this", ("callcenter", {"smirk": 1, "monitor": [{"txt": "MULE: Tyler ✓"}, {"txt": "MULE: Linda ✓"}, {"txt": "MULE: Student ✓"}, {"txt": "OUR OWN ACCOUNTS: none", "c": "#7a1020"}]},
     {"m0": 0.2, "m1": 0.6, "m2": 1.0, "m3": "They use yours", "smirk": "never use"}, "glitch")),
 ("Quick test", ("quiz", {"env": "cafe", "big": 1, "from": "GlobalPay Recruiting", "msg": JOBTXT, "linkLine": 9,
              "flags": ["Unsolicited offer", "Uses YOUR bank account", "Crypto / gift cards", "Keep a %", "Urgent, chat only"]},
     {"pause": "PAUSE_START", "resume": "PAUSE_END", "f0": "REVEAL+0", "f1": "REVEAL+0.4", "f2": "REVEAL+0.8", "f3": "REVEAL+1.2", "f4": "REVEAL+1.6"}, "wipe")),
 ("So here are the five red flags", ("checklist", {"env": "board", "title": "5 red flags of a mule job", "items": ["Big pay for a job you didn't apply for", "Money lands in YOUR account",
     "You forward it: crypto / gift cards", "You keep a percentage", "Urgent, chat-only"]}, {"i0": "One:", "i1": "Two:", "i2": "Three:", "i3": "Four:", "i4": "five:"}, "wipe")),
 ("And if someone asks", ("costumes", {"env": "stage", "mode": "intro", "icons": [["❤️", "LOVE"], ["💼", "JOB"], ["🤝", "FAVOR"]]}, {"c0": "same scam"}, "glitch")),
 ("So how do you check", ("checklist", {"env": "board", "good": 1, "title": "The 5-minute job check", "items": ["Search: company + \"scam\"", "Video call + written contract", "Follow the money"]},
     {"i0": "check if", "i1": "three quick", "i2": "five minutes"}, "wipe")),
 ("Test one", ("laptop", {"env": "desk", "kind": "search", "q": "GlobalPay Solutions scam", "results": [
        ["⚠️ \"GlobalPay\" remote job = money mule scam", "Forum · 2 days ago · \"They asked me to buy Bitcoin with the money…\"", 1],
        ["⚠️ Scam report: fake payment processing job", "Consumer scam tracker · multiple reports this month", 1],
        ["globalpay-solutions.example — domain registered 3 weeks ago", "Website lookup · created recently · hidden owner", 1]]},
     {"q": 0.3, "r0": "scam", "r1": "official website", "r2": "few weeks old"}, "wipe")),
 ("Test two", ("laptop", {"env": "cafe", "kind": "chat", "msgs": [{"who": "out", "txt": ["Can we do a quick video call? Cameras on 🙂"], "w": 700, "at": "KW:video call"},
        {"who": "in", "txt": ["So busy today 😅 Let's keep it in chat!"], "at": "KW:Scammers suddenly"},
        {"who": "out", "txt": ["Can you send a written contract?"], "w": 600, "at": "KW:written contract"},
        {"who": "in", "txt": ["No need, trust me 😉"], "at": "KW:keep everything"}]}, {"reveal": -1}, "wipe")),
 ("Test three", ("chain", {"title": "FOLLOW THE MONEY", "nodes": [{"label": "STRANGER $", "sub": "not your money", "icon": "💸"}, {"label": "YOU", "who": "tyler"}, {"label": "???", "sub": "gift cards · crypto", "icon": "❓"}],
     "foot": "MONEY THROUGH YOU = YOU'RE A TOOL"}, {"n0": "receive money", "n1": "someone else", "n2": "gift cards", "foot": "You're a tool"}, "wipe")),
 ("Three tests. Five minutes", ("checklist", {"env": "sticky", "good": 1, "title": "3 TESTS · 5 MINUTES", "items": ["Search it", "Video call", "Follow the money"]},
     {"i0": 0.2, "i1": 0.7, "i2": 1.2}, "wipe")),
 ("If you're already involved", ("checklist", {"env": "pad", "good": 1, "title": "Already involved?", "items": ["STOP moving money", "Call your bank", "Report at ic3.gov"]},
     {"i0": "stop right now", "i1": "Call your bank", "i2": "I-C-3"}, "wipe")),
 ("And please, share this", ("share", {"env": "living", "famScale": 1.0, "fam": [["Students", 1130, 380, "#2a9d8f"], ["Parents", 1560, 460, "#3d5a80"], ["Grandparents", 1300, 700, "#8e7dbe"]]},
     {"send": "share this"}, "wipe")),
 ("Next time on Scam Anatomy", ("next", {"env": "tv", "title": '"GRANDMA, IT\'S ME"', "sub": "The AI voice clone scam", "fs": 110}, {}, "glitch")),
]
INSERT_AT = {"Tyler had just lost": [("anim", "intro-3d"), ("chapter", 1, "THE JOB")], "Tyler's first task": [("chapter", 2, "THE TASK")],
             "Tyler wasn't the only one": [("chapter", 3, "THE OTHER|MULES")], "Six weeks later": [("chapter", 4, "THE KNOCK"), ("anim", "alert-transition-3d")],
             "Quick test": [("chapter", 5, "PROTECT|YOURSELF")]}
MARKS = {"Quick test": "Quick test", "So here are the five red flags": "5 red flags", "So how do you check": "The 5-minute job check",
         "If you're already involved": "Already involved? Do this", "Next time on Scam Anatomy": "Next: the AI voice scam"}

def _idx(anchor):
    hits = [i for i, t in enumerate(paras) if t.startswith(anchor)]
    assert len(hits) == 1, (anchor, hits); return hits[0]
N_PARAS = len(SHOTS)
assert [_idx(a) for a, _ in SHOTS] == list(range(N_PARAS)), "SHOTS order must match script paragraphs"
PLAN = {i: shot for i, (a, shot) in enumerate(SHOTS)}
INSERT = {_idx(a): v for a, v in INSERT_AT.items()}
CHAPTER_MARKS = {_idx(a): v for a, v in MARKS.items()}
TENSE = set(range(_idx("Six weeks later"), _idx("Scammers know this") + 1))
HEART_IDX = {_idx("Tyler hesitated")}
LONG_PAUSE = {_idx("This story is a composite"), _idx("Next time on Scam Anatomy")}
CHAPTER_ENV = True
TTS_FIX = TTS_FIX + [("FBI", "F.B.I."), ("Sarah from HR", "Sarah from H.R.")]
CAP_FIX = [("eighteen thousand, four hundred dollars", "$18,400"), ("Three thousand five hundred dollars a month", "$3,500 a month"),
           ("one thousand, eight hundred and forty dollars", "$1,840"), ("ten percent", "10%"), ("more than four thousand", "more than 4,000"),
           ("I-C-3 dot gov", "ic3.gov"), ("twenty-four", "24"), ("sixty-seven", "67"), ("twenty minutes", "20 minutes")]
HIGHLIGHT = ["$18,400", "$3,500", "10%", "$1,840", "money mule", "money mules", "Sarah", "Bitcoin ATM", "frozen", "money laundering", "4,000",
             "red flags", "ic3.gov", "stop right now", "Denise", "AI", "scam", "video call", "follow the money"]
