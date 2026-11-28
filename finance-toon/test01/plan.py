NAME = "broke-by-friday-test"
N, D = "am_michael", "am_liam"
LINES = [
    ("Meet Dave. Dave just got paid.", N, 1.0, "n"),
    ("Three thousand two hundred dollars. Dave feels rich.", N, 1.0, "n"),
    ("But his money has other plans.", N, 1.0, "n"),
    ("Wait. Where are you going?!", D, 1.05, "dave"),
    ("Rent. Takeout. Subscriptions he forgot exist.", N, 1.0, "n"),
    ("By Friday, Dave has twelve dollars. So where did it all go?", N, 1.0, "n"),
]
SFX = [("meet", "pop", .7, 0, .2), ("paid", "buzz", .9), ("three", "cash", .9), ("rich", "success", .7), ("plans", "steps", .8, 0, .3),
       ("wait", "hit", .8), ("rent", "stamp", .9), ("takeout", "stamp", .9), ("subscriptions", "stamp", .9),
       ("friday", "impact", .7), ("so", "glitch", .9, 0, .9)]
