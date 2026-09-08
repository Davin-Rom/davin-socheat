# 💍 ធៀបអញ្ជើញមង្គលការ — រុំ ដាវីន & សុិន សុជាតិ

ធៀបអាពាហ៍ពិពាហ៍លើទូរស័ព្ទ (Mobile Wedding Invitation) — HTML/CSS/JS សុទ្ធ គ្មាន build, គ្មាន framework។

## ▶️ របៀបបើកមើល
```bash
cd /Users/soramitsukh/Documents/Playwright/WeddingMobile
python3 -m http.server 8080
# បើក http://localhost:8080  (Chrome DevTools → mobile view)
```

## ⚠️ ត្រូវកែមុនផ្សាយ (សំខាន់)
កែក្នុងឯកសារ **`js/config.js`**៖

| ការកំណត់ | អត្ថន័យ |
|---|---|
| `dateConfirmed` | ប្ដូរទៅ `true` ពេលដឹងថ្ងៃច្បាស់ (បើ `false` គេហទំព័របង្ហាញ «ថ្ងៃ… ខែ… ឆ្នាំ…» និងបិទការរាប់ថយក្រោយ) |
| `ceremonyDate` | ថ្ងៃមង្គលការ (ហែជំនូន → ជប់លៀង) ទម្រង់ `YYYY-MM-DD` |
| `rongDate` | ថ្ងៃចូលរោង (សែនក្រុងពាលី) |
| `lunarText` | ថ្ងៃខែច័ន្ទគតិ (ជម្រើស) ឧ. `ថ្ងៃ៦រោច ខែមាឃ ឆ្នាំម្សាញ់…` |

កែផ្សេងទៀតក្នុង `index.html`៖
- ឈ្មោះឪពុកម្ដាយខាងស្រី (ឥឡូវទុកជា `.....................`)
- អត្ថបទសេចក្ដីអញ្ជើញ

## 🖼 រូបភាព និងចម្រៀង
ដាក់ឯកសារទាំងនេះ (ឈ្មោះត្រូវតែដូចនេះ)៖

```
assets/images/couple.jpg    ← រូបគូស្នេហ៍ (រាងការ៉េ ~1000×1000) សម្រាប់ផ្ទាំងខាងលើ
assets/images/photo1.jpg    ← អាល់ប៊ុម (រាងបញ្ឈរ 3:4)
assets/images/photo2.jpg
assets/images/photo3.jpg
assets/images/photo4.jpg
assets/audio/song.mp3       ← ចម្រៀងផ្ទៃខាងក្រោយ
```
រូបណាដែលមិនមាន វានឹងលាក់ដោយស្វ័យប្រវត្តិ (មិនខូចទំព័រទេ)។

## ✨ មុខងារ
- ផ្ទាំងគម្របធៀប + ប៊ូតុង «បើកធៀបអញ្ជើញ» (animation)
- ចម្រៀងផ្ទៃខាងក្រោយ + ប៊ូតុងបិទ/បើក (ចាប់ផ្ដើមពេលចុចបើកធៀប — តាមច្បាប់ browser)
- រាប់ថយក្រោយជាលេខខ្មែរ (០១២៣…)
- កម្មវិធីមង្គលការជា timeline ២ថ្ងៃ
- ប៊ូតុងផែនទី Google Maps / ហៅទូរស័ព្ទ / ចែករំលែក / រក្សាទុកក្នុងប្រតិទិន
- ផ្កាធ្លាក់ + animation ពេលរំកិល
- ដាក់ឈ្មោះភ្ញៀវផ្ទាល់ខ្លួនតាម URL៖ `index.html?to=លោក សុខ សំណាង`

## 🌐 ការផ្សាយ (Hosting ឥតគិតថ្លៃ)
- **GitHub Pages** — push ថត នេះ រួច Settings → Pages
- **Netlify Drop** — អូសថតទាំងមូលទៅ https://app.netlify.com/drop
- **Cloudflare Pages** — ភ្ជាប់ repo ឬ upload ថត

## 📁 រចនាសម្ព័ន្ធ
```
WeddingMobile/
├── index.html
├── css/style.css
├── js/config.js   ← កែព័ត៌មានទីនេះ
├── js/main.js
├── assets/images/ (motif.svg + រូបភាពរបស់អ្នក)
└── assets/audio/
```
