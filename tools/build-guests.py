#!/usr/bin/env python3
"""បង្កើត js/guests.js ពី Guest-List-Davin-Socheat.xlsx

ដំណើរការ៖  /usr/bin/python3 tools/build-guests.py
លេខកូដ = លំដាប់ឈ្មោះដែលមិនទទេ ក្នុងជួរឈរ ខ (ដូច «ល.រ» ក្នុង Excel)
"""
import json, os, sys
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
XLSX = os.path.join(os.path.dirname(PROJ), 'Guest-List-Davin-Socheat.xlsx')
OUT  = os.path.join(PROJ, 'js', 'guests.js')

def main():
    if not os.path.exists(XLSX):
        sys.exit('រកមិនឃើញ: ' + XLSX)
    ws = openpyxl.load_workbook(XLSX)['បញ្ជីភ្ញៀវ']
    guests, n = {}, 0
    for row in range(5, ws.max_row + 1):
        name = ws.cell(row, 2).value
        if name is None:
            continue
        name = str(name).strip()
        if not name:
            continue
        n += 1
        guests[str(n)] = name
    body = json.dumps(guests, ensure_ascii=False, indent=2)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* បង្កើតដោយស្វ័យប្រវត្តិ — tools/build-guests.py · កុំកែដោយដៃ */\n')
        f.write('window.GUESTS = ' + body + ';\n')
    print('សរសេរ %s — ភ្ញៀវ %d នាក់' % (OUT, n))

if __name__ == '__main__':
    main()
