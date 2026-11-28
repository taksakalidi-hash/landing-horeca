"""Free 'Broke by Friday' money template (pinned-comment giveaway). python3 make_template.py out.xlsx"""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import PieChart, Reference
from openpyxl.formatting.rule import DataBarRule

NAVY, YEL, RED, GRN, GREY = "0B1320", "FFD166", "E63946", "2E9E5B", "F3F4F6"
H = Font(bold=True, color="FFFFFF", size=12); T = Font(bold=True, size=20, color=NAVY); B = Font(bold=True)
FH = PatternFill("solid", fgColor=NAVY); FY = PatternFill("solid", fgColor=YEL); FG = PatternFill("solid", fgColor=GREY)
thin = Side(style="thin", color="D1D5DB"); BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
USD = '"$"#,##0.00'; USD0 = '"$"#,##0'
wb = Workbook()

def sheet(name, title, sub, widths):
    ws = wb.create_sheet(name); ws.sheet_view.showGridLines = False
    ws["B2"] = title; ws["B2"].font = T; ws["B3"] = sub; ws["B3"].font = Font(italic=True, color="6B7280")
    for i, w in enumerate(widths): ws.column_dimensions[chr(65 + i)].width = w
    return ws
def head(ws, row, cols):
    for i, c in enumerate(cols):
        x = ws.cell(row, 2 + i, c); x.font = H; x.fill = FH; x.alignment = Alignment(horizontal="center"); x.border = BOX
def inp(c, fmt=None):
    c.fill = FY; c.border = BOX
    if fmt: c.number_format = fmt

# 0 Start
ws = wb.active; ws.title = "Start Here"; ws.sheet_view.showGridLines = False; ws.column_dimensions["B"].width = 95
rows = [("BROKE BY FRIDAY: FREE MONEY TEMPLATE", T), ("Yellow cells = type your numbers. Everything else calculates itself.", B), ("", None),
        ("1. Spending Tracker: log every expense for 30 days (Rule 1).", None),
        ("2. Monthly Budget: your income split with the 50/30/20 rule + pay yourself first (Rules 2 & 6).", None),
        ("3. Emergency Fund: your 3 to 6 month target and progress (Rule 3).", None),
        ("4. Debt Payoff: how long your debt takes and how much interest you pay (Rule 4).", None),
        ("5. Hours of Life: what a purchase really costs in hours of your work (Rule 5).", None),
        ("6. Growth: what monthly investing could grow into (Rule 7). Illustration only, not a guarantee.", None), ("", None),
        ("Not financial advice. For education only. Make a copy: File > Make a copy (Google Sheets) or Save As (Excel).", Font(italic=True, color="6B7280"))]
for i, (t, f) in enumerate(rows, 2):
    ws.cell(i, 2, t)
    if f: ws.cell(i, 2).font = f

# 1 Tracker
ws = sheet("Spending Tracker", "Spending Tracker", "Rule 1: write down every dollar for 30 days.", [3, 13, 34, 13, 20, 4, 22, 14, 10])
head(ws, 5, ["Date", "What", "Amount", "Group"])
dv = DataValidation(type="list", formula1='"Need,Want,Why did I buy that"', allow_blank=True); ws.add_data_validation(dv)
for r in range(6, 206):
    inp(ws.cell(r, 2), "yyyy-mm-dd"); inp(ws.cell(r, 3)); inp(ws.cell(r, 4), USD); inp(ws.cell(r, 5)); dv.add(ws.cell(r, 5))
ws["G5"], ws["H5"], ws["I5"] = "Group", "Total", "%"
for c in ("G5", "H5", "I5"): ws[c].font = H; ws[c].fill = FH
for i, g in enumerate(["Need", "Want", "Why did I buy that"], 6):
    ws.cell(i, 7, g); ws.cell(i, 8, f'=SUMIF($E$6:$E$205,G{i},$D$6:$D$205)').number_format = USD
    ws.cell(i, 9, f'=IF(SUM($H$6:$H$8)=0,0,H{i}/SUM($H$6:$H$8))').number_format = "0%"
ws["G9"] = "TOTAL"; ws["G9"].font = B; ws["H9"] = "=SUM(H6:H8)"; ws["H9"].number_format = USD; ws["H9"].font = B
pie = PieChart(); pie.title = "Where my money goes"; pie.add_data(Reference(ws, min_col=8, min_row=5, max_row=8), titles_from_data=True)
pie.set_categories(Reference(ws, min_col=7, min_row=6, max_row=8)); pie.height, pie.width = 7, 11; ws.add_chart(pie, "G11")

# 2 Budget
ws = sheet("Monthly Budget", "Monthly Budget (50/30/20)", "Rules 2 & 6: pay yourself first, then live on the rest.", [3, 34, 16, 16, 16])
ws["B5"] = "Monthly take-home pay"; inp(ws["C5"], USD); ws["C5"] = 3000
head(ws, 7, ["Bucket", "Target", "Planned", "Left"])
plan = [("Needs (50%): rent, bills, groceries, transport", .5), ("Wants (30%): fun, eating out, hobbies", .3), ("Savings & debt (20%): pay yourself first", .2)]
for i, (n, p) in enumerate(plan, 8):
    ws.cell(i, 2, n); ws.cell(i, 3, f"=$C$5*{p}").number_format = USD0; inp(ws.cell(i, 4), USD0); ws.cell(i, 5, f"=C{i}-D{i}").number_format = USD0
head(ws, 12, ["Expense", "Bucket", "Amount", ""])
items = [("Rent / mortgage", "Need"), ("Utilities", "Need"), ("Groceries", "Need"), ("Transport / car", "Need"), ("Insurance", "Need"), ("Phone & internet", "Need"),
         ("Eating out / delivery", "Want"), ("Subscriptions", "Want"), ("Shopping", "Want"), ("Fun", "Want"), ("Automatic savings transfer", "Save"), ("Extra debt payment", "Save")]
dv2 = DataValidation(type="list", formula1='"Need,Want,Save"'); ws.add_data_validation(dv2)
for i, (n, b) in enumerate(items, 13):
    inp(ws.cell(i, 2)); ws.cell(i, 2, n); inp(ws.cell(i, 3)); ws.cell(i, 3, b); dv2.add(ws.cell(i, 3)); inp(ws.cell(i, 4), USD0)
for i, b in zip((8, 9, 10), ("Need", "Want", "Save")): ws.cell(i, 4, f'=SUMIF($C$13:$C$40,"{b}",$D$13:$D$40)')
ws["B27"] = "Got a raise? Save at least half of it:"; ws["B27"].font = B; ws["B28"] = "Monthly raise"; inp(ws["C28"], USD0); ws["C28"] = 300
ws["B29"] = "Add to savings"; ws["C29"] = "=C28/2"; ws["C29"].number_format = USD0

# 3 Emergency fund
ws = sheet("Emergency Fund", "Emergency Fund", "Rule 3: 3 to 6 months of basic expenses. First milestone: $1,000.", [3, 34, 16])
for r, (n, v, f) in enumerate([("Basic monthly expenses", 2500, True), ("Saved so far", 400, True), ("First milestone", 1000, False),
                               ("3-month target", "=C5*3", False), ("6-month target", "=C5*6", False)], 5):
    ws.cell(r, 2, n); c = ws.cell(r, 3, v); c.number_format = USD0
    if f: inp(c, USD0)
for r, (n, tgt) in enumerate([("Progress to $1,000", "C7"), ("Progress to 3 months", "C8"), ("Progress to 6 months", "C9")], 11):
    ws.cell(r, 2, n); ws.cell(r, 3, f"=MIN(1,C6/{tgt})").number_format = "0%"
ws.conditional_formatting.add("C11:C13", DataBarRule(start_type="num", start_value=0, end_type="num", end_value=1, color=GRN))

# 4 Debt payoff
ws = sheet("Debt Payoff", "Debt Payoff", "Rule 4: pay extra on the highest interest rate first.", [3, 24, 14, 12, 16, 14, 18])
head(ws, 5, ["Debt", "Balance", "APR %", "Monthly payment", "Months", "Total interest"])
for i, (n, b, a, p) in enumerate([("Credit card", 3000, 22, 100), ("Credit card (paying more)", 3000, 22, 200), ("", None, None, None)] + [("", None, None, None)] * 5, 6):
    for j, (v, fmt) in enumerate([(n, None), (b, USD0), (a, "0.0"), (p, USD0)]):
        c = ws.cell(i, 2 + j, v); inp(c, fmt)
    ws.cell(i, 6, f'=IF(OR(C{i}="",E{i}=""),"",IF(E{i}<=C{i}*D{i}/1200,"never!",ROUNDUP(NPER(D{i}/1200,-E{i},C{i}),0)))')
    ws.cell(i, 7, f'=IF(OR(F{i}="",F{i}="never!"),"",E{i}*NPER(D{i}/1200,-E{i},C{i})-C{i})').number_format = USD0
ws["B15"] = '"never!" = your payment does not even cover the interest.'; ws["B15"].font = Font(italic=True, color=RED)

# 5 Hours of life
ws = sheet("Hours of Life", "Hours of Life", "Rule 5: price / take-home pay per hour = hours of your life.", [3, 30, 16, 16])
ws["B5"] = "Take-home pay per hour"; inp(ws["C5"], USD); ws["C5"] = 20
head(ws, 7, ["Thing I want", "Price", "Hours of work"])
for i, (n, p) in enumerate([("Sneakers", 200), ("New phone", 1000), ("Delivery dinner", 35)] + [("", None)] * 9, 8):
    inp(ws.cell(i, 2)); ws.cell(i, 2, n or None); c = ws.cell(i, 3, p); inp(c, USD0)
    ws.cell(i, 4, f'=IF(C{i}="","",C{i}/$C$5)').number_format = "0.0"
ws["B21"] = "Not sure? Wait 30 days. Still want it? Buy it guilt-free."; ws["B21"].font = Font(italic=True)

# 6 Growth
ws = sheet("Growth", "Growth (compound interest)", "Rule 7: illustration only. Real returns go up and down; nothing is guaranteed.", [3, 30, 16])
for r, (n, v, fmt) in enumerate([("Invest per month", 200, USD0), ("Average yearly return %", 7, "0.0"), ("Years", 30, "0")], 5):
    ws.cell(r, 2, n); inp(ws.cell(r, 3, v), fmt)
ws["B9"] = "You put in"; ws["C9"] = "=C5*12*C7"; ws["B10"] = "It could grow to"; ws["C10"] = "=FV(C6/1200,C7*12,-C5)"; ws["B11"] = "Growth from compound interest"; ws["C11"] = "=C10-C9"
for c in ("C9", "C10", "C11"): ws[c].number_format = USD0; ws[c].font = B
wb.save(sys.argv[1]); print("saved", sys.argv[1])
