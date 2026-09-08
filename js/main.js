/* =========================================================
   មង្គលការ រុំ ដាវីន & សុិន សុជាតិ — main.js
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ------------------- លេខខ្មែរ / Khmer numerals ------------------- */
  const KH_DIGITS = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
  const toKh = n => String(n).replace(/\d/g, d => KH_DIGITS[+d]);
  const pad2 = n => (n < 10 ? '0' : '') + n;

  const KH_DAYS = ['អាទិត្យ','ចន្ទ','អង្គារ','ពុធ','ព្រហស្បតិ៍','សុក្រ','សៅរ៍'];
  const KH_MONTHS = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
                     'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];

  /** '2026-02-14' -> Date (local, midday to dodge DST/offset edges) */
  function parseDate(iso, time) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    const [hh, mm] = (time || '12:00').split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0);
  }

  /** -> 'ថ្ងៃសៅរ៍ ទី១៤ ខែកុម្ភៈ ឆ្នាំ២០២៦' */
  function formatKhDate(dt) {
    if (!dt) return '';
    return 'ថ្ងៃ' + KH_DAYS[dt.getDay()] +
           ' ទី' + toKh(dt.getDate()) +
           ' ខែ' + KH_MONTHS[dt.getMonth()] +
           ' ឆ្នាំ' + toKh(dt.getFullYear());
  }

  const PLACEHOLDER = 'ថ្ងៃ… ខែ… ឆ្នាំ… (សូមបញ្ជាក់)';

  /* ------------------- បំពេញកាលបរិច្ឆេទ / fill dates ------------------- */
  const ceremony = parseDate(CONFIG.ceremonyDate, CONFIG.startTime);
  const rong     = parseDate(CONFIG.rongDate, '16:00');
  const ready    = !!(CONFIG.dateConfirmed && ceremony);

  const ceremonyText = ready ? formatKhDate(ceremony) : PLACEHOLDER;
  const rongText     = ready ? formatKhDate(rong || ceremony) : PLACEHOLDER;
  const lunar        = (CONFIG.lunarText || '').trim();

  ['coverDate', 'heroDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = ceremonyText + (lunar ? ' (' + lunar + ')' : '');
  });
  const d1 = document.getElementById('dayDate1');
  const d2 = document.getElementById('dayDate2');
  if (d1) d1.textContent = rongText;
  if (d2) d2.textContent = ceremonyText;

  /* ------------------- ឈ្មោះភ្ញៀវ ?to=... / guest name ------------------- */
  try {
    const to = new URLSearchParams(location.search).get('to');
    if (to) {
      const g = $('#guestName');
      if (g) g.textContent = decodeURIComponent(to).slice(0, 60);
    }
  } catch (e) { /* ignore */ }

  /* ------------------- ចម្រៀង / music ------------------- */
  const bgm = $('#bgm');
  const musicBtn = $('#musicBtn');
  let musicOn = false;
  let musicOk = true;

  // ដាក់ឯកសារចម្រៀងតាម config.js (ប្ដូរឈ្មោះឯកសារនៅទីនោះមួយកន្លែង)
  if (bgm && CONFIG.music) {
    bgm.src = CONFIG.music;
    bgm.addEventListener('error', () => {
      musicOk = false;
      if (musicBtn) musicBtn.hidden = true;   // គ្មានចម្រៀង -> លាក់ប៊ូតុង
      console.warn('[wedding] រកមិនឃើញឯកសារចម្រៀង: ' + CONFIG.music);
    });
  }

  function fadeIn() {
    let v = 0;
    const fade = setInterval(() => {
      v = Math.min(0.55, v + 0.04);
      try { bgm.volume = v; } catch (e) {}
      if (v >= 0.55) clearInterval(fade);
    }, 120);
  }
  function startMusic() {
    if (!bgm || !musicOk || !CONFIG.autoPlayMusic) { setBtn(false); return; }
    bgm.volume = 0;
    const p = bgm.play();
    if (p && p.then) {
      p.then(() => { setBtn(true); fadeIn(); }).catch(() => setBtn(false));
    } else {
      setBtn(true); fadeIn();
    }
  }
  function setBtn(on) {
    musicOn = on;
    if (!musicBtn) return;
    musicBtn.classList.toggle('playing', on);
    musicBtn.classList.toggle('muted', !on);
  }
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!bgm) return;
      if (musicOn) { bgm.pause(); setBtn(false); }
      else {
        bgm.volume = 0.55;
        const pr = bgm.play();
        if (pr && pr.then) pr.then(() => setBtn(true)).catch(() => toast('រកមិនឃើញឯកសារចម្រៀង assets/audio/song.mp3'));
        else setBtn(true);
      }
    });
  }

  /* ------------------- បើកធៀប / open the invitation ------------------- */
  const cover = $('#cover');
  const main = $('#main');

  function openInvitation() {
    if (!cover || cover.classList.contains('open')) return;
    cover.classList.add('open');
    document.body.classList.remove('locked');
    main.setAttribute('aria-hidden', 'false');
    main.classList.add('show');
    if (musicBtn && musicOk) musicBtn.hidden = false;
    startMusic();
    makePetals();
    setTimeout(() => { window.scrollTo({ top: 0 }); revealNow(); }, 60);
    setTimeout(() => { cover.style.display = 'none'; }, 1200);
  }
  const openBtn = $('#openBtn');
  if (openBtn) openBtn.addEventListener('click', openInvitation);

  /* ------------------- រាប់ថយក្រោយ / countdown ------------------- */
  const cdEls = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
  const cdNote = $('#cdNote');

  function tick() {
    if (!ready) {
      if (cdNote) cdNote.textContent = 'សូមបញ្ចូលកាលបរិច្ឆេទក្នុងឯកសារ js/config.js';
      return;
    }
    const diff = ceremony.getTime() - Date.now();
    if (diff <= 0) {
      Object.values(cdEls).forEach(el => el && (el.textContent = toKh(0)));
      if (cdNote) cdNote.textContent = 'ថ្ងៃមង្គលការបានមកដល់ហើយ ♡';
      return;
    }
    const s = Math.floor(diff / 1000);
    if (cdEls.d) cdEls.d.textContent = toKh(Math.floor(s / 86400));
    if (cdEls.h) cdEls.h.textContent = toKh(pad2(Math.floor(s / 3600) % 24));
    if (cdEls.m) cdEls.m.textContent = toKh(pad2(Math.floor(s / 60) % 60));
    if (cdEls.s) cdEls.s.textContent = toKh(pad2(s % 60));
    if (cdNote) cdNote.textContent = 'រហូតដល់ថ្ងៃមង្គលការ';
  }
  tick();
  setInterval(tick, 1000);

  /* ------------------- ប្រតិទិន / add to calendar ------------------- */
  const calBtn = $('#calBtn');
  if (calBtn) {
    calBtn.addEventListener('click', () => {
      if (!ready) { toast('សូមបញ្ចូលកាលបរិច្ឆេទជាមុនសិន'); return; }
      const start = parseDate(CONFIG.ceremonyDate, CONFIG.startTime);
      const end = parseDate(CONFIG.ceremonyDate, CONFIG.endTime);
      const fmt = dt => dt.getFullYear() + pad2(dt.getMonth() + 1) + pad2(dt.getDate()) +
                        'T' + pad2(dt.getHours()) + pad2(dt.getMinutes()) + '00';
      const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('មង្គលការ ' + CONFIG.groom + ' & ' + CONFIG.bride) +
        '&dates=' + fmt(start) + '/' + fmt(end) +
        '&details=' + encodeURIComponent('ទំនាក់ទំនង៖ ' + CONFIG.phones.join(' / ') + '\n' + CONFIG.mapUrl) +
        '&location=' + encodeURIComponent(CONFIG.venue) +
        '&ctz=Asia/Phnom_Penh';
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ------------------- ចែករំលែក / share ------------------- */
  const shareBtn = $('#shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const data = {
        title: 'មង្គលការ ' + CONFIG.groom + ' & ' + CONFIG.bride,
        text: 'សូមគោរពអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ',
        url: location.href.split('?')[0]
      };
      try {
        if (navigator.share) { await navigator.share(data); return; }
        await navigator.clipboard.writeText(data.url);
        toast('បានចម្លងតំណភ្ជាប់ធៀបហើយ');
      } catch (e) { /* user cancelled */ }
    });
  }

  /* ------------------- ផែនទី / map ------------------- */
  const mapBtn = $('#mapBtn');
  if (mapBtn && CONFIG.mapUrl) mapBtn.href = CONFIG.mapUrl;

  /* ------------------- ផ្កាធ្លាក់ / petals ------------------- */
  function makePetals() {
    const box = $('#petals');
    if (!box || box.childElementCount) return;
    const n = CONFIG.petalCount || 12;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'petal' + (i % 3 === 0 ? ' gold' : '');
      const size = 8 + Math.random() * 9;
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = (9 + Math.random() * 9) + 's';
      p.style.animationDelay = (-Math.random() * 12) + 's';
      box.appendChild(p);
    }
  }

  /* ------------------- បង្ហាញពេលរំកិល / scroll reveal ------------------- */
  let io = null;
  function revealNow() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }
    items.forEach((el, i) => {
      if (el.classList.contains('in')) return;
      el.style.transitionDelay = ((i % 5) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* ------------------- អាល់ប៊ុមទទេ / empty gallery ------------------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const g = $('#gallery'), empty = $('#galleryEmpty');
      if (g && empty && g.childElementCount === 0) { empty.hidden = false; }
    }, 800);
  });

  /* ------------------- Toast ------------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* បើកដោយស្វ័យប្រវត្តិបើគ្មានគម្រប / safety: no cover -> show main */
  if (!cover && main) { main.classList.add('show'); revealNow(); makePetals(); }
})();
