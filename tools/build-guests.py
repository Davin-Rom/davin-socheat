#!/usr/bin/env python3
"""បង្កើត js/guests.js ពីឯកសារបញ្ជីភ្ញៀវ

ដំណើរការ៖  /usr/bin/python3 tools/build-guests.py

ឯកសារ                                កូដ
  Guest-List-Davin-Socheat.xlsx      ជួរ ដក ៤          -> 1 ឡើង
  Guest-List-Davin-Socheat-2.xlsx    ជួរ ដក ៤ បូក ១០០០ -> 1001 ឡើង
  Guest-List-Davin-Socheat-3.xlsx    ជួរ ដក ៤ បូក ២០០០ -> 2001 ឡើង
លេខកូដចងនឹងលេខជួរ ដូច្នេះវាមិនរំកិលពេលលុបឈ្មោះចេញទេ ។
"""
import json, os, sys
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DATA = os.path.dirname(PROJ)
OUT  = os.path.join(PROJ, 'js', 'guests.js')

BOOKS = [
    ('Guest-List-Davin-Socheat.xlsx',      0),
    ('Guest-List-Davin-Socheat-2.xlsx', 1000),
    ('Guest-List-Davin-Socheat-3.xlsx', 2000),
]

def read(path, offset, guests):
    ws = openpyxl.load_workbook(path)['បញ្ជីភ្ញៀវ']
    n = 0
    for row in range(5, ws.max_row + 1):
        name = ws.cell(row, 2).value
        if name is None:
            continue
        name = str(name).strip()
        if not name:
            continue
        code = str(row - 4 + offset)
        if code in guests:
            sys.exit('លេខកូដជាន់គ្នា: ' + code)
        guests[code] = name
        n += 1
    return n

def main():
    guests = {}
    for fname, offset in BOOKS:
        path = os.path.join(DATA, fname)
        if not os.path.exists(path):
            print('រំលង (រកមិនឃើញ): ' + fname)
            continue
        print('  %-36s %3d នាក់' % (fname, read(path, offset, guests)))
    if not guests:
        sys.exit('គ្មានឈ្មោះភ្ញៀវ')
    body = json.dumps(guests, ensure_ascii=False, indent=2)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* បង្កើតដោយស្វ័យប្រវត្តិ — tools/build-guests.py · កុំកែដោយដៃ */\n')
        f.write('window.GUESTS = ' + body + ';\n')
    print('សរសេរ %s — សរុប %d នាក់' % (OUT, len(guests)))

if __name__ == '__main__':
    main()
