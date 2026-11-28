NAME = "ep01"
N, D, P = ("am_michael", .94), ("am_liam", 1.05), ("af_bella", 1.05)
def n(t, sc, **k): return dict(text=t, v=N, who="n", sc=sc, **k)
def d(t, sc, **k): return dict(text=t, v=D, who="dave", sc=sc, **k)
def p(t, sc, **k): return dict(text=t, v=P, who="penny", sc=sc, **k)
LINES = [
 n("Most people work forty years, earn over a million dollars, and still end up with almost nothing.", "hook"),
 d("Where does it all go?!", "hook"),
 n("Not because they earn too little. Because nobody ever taught them seven simple rules.", "hook2"),
 n("In the next seven minutes, you'll learn all seven, and for each one, exactly what to do today. Rule number four alone can save you thousands of dollars.", "hook2"),
 # 1
 n("Rule one. Find out where your money really goes.", "rule", r=1, title="KNOW WHERE IT GOES"),
 n("You can't fix a leak you can't see. Most people guess their spending, and miss by hundreds of dollars a month.", "big3"),
 n("And it's usually not the coffee. It's the big three: housing, your car, and food, especially delivery.", "big3"),
 p("The latte is a mosquito, Dave. Delivery food is a bear.", "bear"),
 d("A bear?!", "bear"),
 n("Here's what to do today. Open your banking app and look at last month. Sort every expense into three groups: needs, wants, and why did I buy that.", "sort"),
 n("Ten minutes and a notes app are enough. Almost everyone who does this finds money they didn't know they were losing.", "sort"),
 # 2
 n("Rule two. Pay yourself first, automatically.", "rule", r=2, title="PAY YOURSELF FIRST"),
 n("Most people save whatever is left at the end of the month. And at the end of the month, nothing is left. So flip it.", "flip"),
 n("Set up an automatic transfer that moves money to savings on payday, before you can spend it.", "vault"),
 d("Hey! Come back!", "vault"),
 n("Start with ten percent. On a three thousand dollar paycheck, that's three hundred a month. Three thousand six hundred a year, without thinking about it.", "count"),
 n("Action for today: set up one automatic transfer for your next payday. Even fifty dollars counts. The habit matters more than the amount.", "count"),
 # 3
 n("Rule three. Build an emergency fund before anything else.", "rule", r=3, title="EMERGENCY FUND"),
 n("Life will throw rocks at you. A broken car. The dentist. A lost job. Without a cushion, every surprise goes on a credit card.", "car"),
 p("That's what the pillow is for.", "car"),
 n("The goal is three to six months of basic expenses. If you spend twenty-five hundred a month, that's seventy-five hundred to fifteen thousand.", "fund"),
 n("Sounds huge? Start with a first milestone of one thousand dollars. Keep it in a separate savings account. Safe, easy to reach, but not on your everyday card.", "fund"),
 # 4
 n("Rule four. Kill high-interest debt. This is the one that saves thousands.", "rule", r=4, title="KILL EXPENSIVE DEBT"),
 n("A typical credit card charges over twenty percent interest a year.", "dragon"),
 d("Why is it getting bigger?!", "dragon"),
 p("Because you only pay the minimum.", "dragon"),
 n("Say you owe three thousand dollars at twenty-two percent, and pay a hundred a month. It takes about forty-four months, and you hand the bank around fourteen hundred dollars in interest.", "debt"),
 n("Pay two hundred instead, and you're done in about eighteen months, with roughly five hundred forty in interest. Same debt. Almost nine hundred dollars saved.", "debt"),
 n("The method: pay the minimum on everything, then throw every extra dollar at the debt with the highest interest rate first.", "aval"),
 # 5
 n("Rule five. Convert prices into hours of your life.", "rule", r=5, title="PRICE = HOURS"),
 n("Before you buy anything you don't need, divide the price by what you take home per hour. At twenty dollars an hour, those two hundred dollar sneakers cost ten hours of work.", "hours"),
 d("Ten hours? For shoes?", "hours"),
 n("Still want them? Buy them guilt-free. Not sure? Wait thirty days. Most of the time, you won't even remember them.", "subs"),
 n("And while you're at it, check your statement for subscriptions. Many people pay for services they forgot they have.", "subs"),
 # 6
 n("Rule six. When you earn more, don't spend more.", "rule", r=6, title="DON'T LET SPENDING CLIMB"),
 n("You get a raise, and somehow you're still broke a year later. Economists call it lifestyle creep. Your income goes up, and your spending quietly follows.", "stairs"),
 p("Snip.", "stairs"),
 n("The fix: every time your income rises, save at least half of the increase. A three hundred dollar raise? One fifty for you, one fifty for your future.", "stairs2"),
 # 7
 n("Rule seven. Make your money work, because cash slowly melts.", "rule", r=7, title="LET MONEY GROW"),
 n("With three percent inflation, ten thousand dollars under your mattress buys only about seventy-four hundred dollars' worth of stuff after ten years.", "melt"),
 p("Money that sits still, melts.", "melt"),
 n("So once you have an emergency fund and no expensive debt, invest for the long term. Two hundred dollars a month, growing around seven percent a year on average, becomes roughly two hundred forty thousand after thirty years.", "snow"),
 n("You only put in seventy-two thousand. The rest is compound interest. Nothing is guaranteed, markets go up and down, but time is your most powerful tool.", "snow"),
 # outro
 n("So here's your checklist. Track where your money goes. Pay yourself first. Build an emergency fund. Kill expensive debt. Convert prices into hours. Save half of every raise. And let your money grow.", "check"),
 n("Don't do all seven this week. Pick one, and do it today. Then tell me in the comments: which rule are you starting with?", "check2"),
 n("Next time on Money With Penny: how scammers steal money from smart people, and the one question that stops them.", "end"),
]
SFX = [("forty", "pop", .6), ("million", "kaching", .8), ("nothing", "slide_down", .6), ("where", "boing", .6), ("seven", "pop", .6), ("four", "stamp", .6),
 ("guess", "pop2", .5), ("hundreds", "stamp", .6), ("coffee", "pop", .5), ("housing", "pop2", .6), ("car", "pop2", .6), ("food", "pop2", .6),
 ("mosquito", "pop", .5), ("bear", "roar", .8), ("banking", "notify", .6), ("needs", "pop", .6), ("wants", "pop", .6), ("why", "pop", .6), ("ten", "clock", .6), ("finds", "coins", .7),
 ("flip", "slide_up", .6), ("payday", "buzz", .8), ("hey", "slam", .8), ("percent", "pop", .6), ("six", "coins", .6), ("action", "pop", .5), ("fifty", "pop", .6),
 ("broken", "sputter", .8), ("dentist", "pop", .5), ("lost", "stamp", .6), ("pillow", "boing", .6), ("milestone", "success", .6),
 ("twenty", "stamp", .7, 1), ("bigger", "roar", .6), ("fortyfour", "clock", .5), ("fourteen", "kaching", .6), ("eighteen", "pop", .6), ("saved", "success", .7), ("highest", "slide_up", .6),
 ("sneakers", "pop", .6), ("hours", "clock", .6, 1), ("shoes", "boing", .6), ("subscriptions", "scribble", .6), ("forgot", "snip", .5),
 ("lifestyle", "slide_down", .6), ("snip", "snip", .9), ("half", "coins", .6), ("inflation", "melt", .7), ("compound", "success", .6), ("checklist", "pop", .6),
 ("comments", "pop", .6), ("scammers", "glitch", .7)]
