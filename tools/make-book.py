#!/usr/bin/env python3
"""បង្កើត/សាងសង់ឯកសារបញ្ជីភ្ញៀវឡើងវិញ — ជួរឈរ ៣ (លេខកូដ · ឈ្មោះភ្ញៀវ · តំណ)

ប្រើជា module:  from make_book import build
    build(path, title, offset, names)   # names = list[str]
"""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

KH   = 'Khmer Sangam MN'
URL  = 'https://davin-rom.github.io/davin-socheat/?g='
SUB  = ('ថ្ងៃអាទិត្យ ទី០៣ ខែមករា ឆ្នាំ២០២៧ · ភូមិ ជ្រោយតាប៉ា ឃុំគគីរ ស្រុកកៀនស្វាយ ខេត្តកណ្ដាល'
        ' · ទំនាក់ទំនង ០៨៧ ៨៦៤ ៣៣២ / ០៩៦ ៤០២ ៩៧០៩')
LAST = 204
_thin = Side(style='thin', color='E3D8D2')
BORD  = Border(left=_thin, right=_thin, top=_thin, bottom=_thin)

def note_for(offset):
    base = ('របៀបប្រើ៖ បំពេញតែជួរឈរ «ឈ្មោះភ្ញៀវ» ។ ជួរឈរ «លេខកូដ» និង «តំណ» គណនាស្វ័យប្រវត្តិ — កុំកែ។ '
            'សរសេរឈ្មោះឲ្យពេញ រួមទាំងងារ ឧ. «លោក ...», «លោកស្រី ...», «បង ... និងភរិយា»។ ')
    if offset:
        base += 'លេខកូដ = លេខជួរ ដក ៤ បូក %s (ជួរ ៥ → %d) ដើម្បីកុំជាន់នឹងបញ្ជីផ្សេង ។ ' % (offset, offset + 1)
    else:
        base += 'លេខកូដ = លេខជួរ ដក ៤ ។ '
    return base + ('ដកភ្ញៀវចេញ = លុបអត្ថបទក្នុងប្រអប់ឈ្មោះ (Delete) — កុំលុបទាំងជួរ។ '
                   'កែរួចត្រូវប្រាប់ឲ្យបង្កើតតំណឡើងវិញ។')

def build(path, title, offset, names):
    wb = openpyxl.Workbook()
    ws = wb.active; ws.title = 'បញ្ជីភ្ញៀវ'

    for rng, text, fill, font, h in [
        ('A1:C1', title,            'A85F6B', Font(name=KH, sz=15, b=True, color='FFFFFF'), 32),
        ('A2:C2', SUB,               None,    Font(name=KH, sz=9,  color='7B5A5F'),         22),
        ('A3:C3', note_for(offset),  None,    Font(name=KH, sz=9,  color='7B5A5F'),         34),
    ]:
        ws.merge_cells(rng)
        c = ws[rng.split(':')[0]]
        c.value, c.font = text, font
        c.alignment = Alignment(horizontal='center' if fill else 'left',
                                vertical='center', wrap_text=True)
        if fill: c.fill = PatternFill('solid', fgColor=fill)
        ws.row_dimensions[int(rng[1])].height = h

    for col, head, w in [(1, 'លេខកូដ', 8), (2, 'ឈ្មោះភ្ញៀវ', 40),
                         (3, 'តំណធៀបផ្ទាល់ខ្លួន (ចម្លងបាន)', 50)]:
        c = ws.cell(4, col, head)
        c.font = Font(name=KH, sz=11, b=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor='7E434E')
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        c.border = BORD
        ws.column_dimensions[chr(64 + col)].width = w
    ws.row_dimensions[4].height = 30

    for r in range(5, LAST + 1):
        a = ws.cell(r, 1, '=IF($B%d="","",ROW()-4+%d)' % (r, offset))
        a.font = Font(name=KH, sz=11, color='3A2A2E')
        a.fill = PatternFill('solid', fgColor='F2EDE9')
        a.alignment = Alignment(horizontal='center')

        i = r - 5
        b = ws.cell(r, 2, names[i] if i < len(names) else None)
        b.font = Font(name=KH, sz=11, color='3A2A2E')
        b.alignment = Alignment(horizontal='left', vertical='center')

        c = ws.cell(r, 3, '=IF($B%d="","","%s"&(ROW()-4+%d))' % (r, URL, offset))
        c.font = Font(name=KH, sz=11, color='0563C1')
        c.fill = PatternFill('solid', fgColor='F2EDE9')
        c.alignment = Alignment(horizontal='left')

        for col in (1, 2, 3):
            ws.cell(r, col).border = BORD
        ws.row_dimensions[r].height = 20

    ws.freeze_panes = 'A5'
    ws.auto_filter.ref = 'A4:C%d' % LAST
    ws.sheet_view.showGridLines = False
    wb.save(path)
    return sum(1 for n in names if n)
