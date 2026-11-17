# Prototype of the new "paper" style: the hook of video 02 (Tyler, money mule)
TTS_FIX = [("twenty-four", "twenty four")]
HIGHLIGHT = ["Tyler", "eighteen thousand, four hundred dollars", "money mule", "Denise"]
LINES = [
 ("This is Tyler. He's twenty-four. He has never stolen anything in his life.",
  [(0, "intro", {}, {"name": "Tyler", "age": "twenty", "never": "never stolen", "weeks": "@1:six weeks", "fed": 1e3},
    None, {"name": "pop", "age": "pop", "never": "boing@1.4", "weeks": ["pop", "rip@0.55", "rip@0.85", "rip@1.15", "rip@1.45", "rip@1.75", "pop@2.1"]})]),
 ("And in about six weeks,", [], 1.6),
 ("federal agents are going to knock on his door.",
  [(0, "knock", {}, {"knock": "knock on+0.2"}, "page",
    [(0.1, "steps"), ("knock on+0.2", "knock"), ("knock on+0.5", "knock"), ("knock on+0.8", "knock")])], 0.9),
 ("Because, without knowing it, Tyler moved eighteen thousand, four hundred dollars of stolen money. Remember Denise, from our last video? That was her money.",
  [(0, "flow", {}, {"count": "eighteen", "denise": "Remember", "her": "her money"}, "page",
    {"count": "cash", "denise": "pop", "her": "uhoh"})]),
 ("Tyler is what investigators call a money mule. And today, we're taking apart the scam that turns ordinary people into criminals, so it never happens to you, or to someone you love.",
  [(0, "mule", {}, {"mule": "money mule"}, "page", {"mule": ["stamp", "boing@0.2"]}),
   ("taking apart", "apart", {}, {"split": 0.5, "crim": "criminals", "you": "someone you love"}, "page", {"split": "rip", "crim": "stamp", "you": "pop"})]),
]
