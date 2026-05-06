// ============================================================
// LANGUAGE
// ============================================================

const Lang = {
  current: 'ru',

  init() {
    const saved = localStorage.getItem('pb-lang');
    if (saved === 'en' || saved === 'ru') this.current = saved;
    this.apply();
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.current = btn.dataset.lang;
        localStorage.setItem('pb-lang', this.current);
        this.apply();
        Lightbox.updateCaption();
      });
    });
  },

  apply() {
    const html = document.documentElement;
    html.classList.remove('lang-ru', 'lang-en');
    html.classList.add('lang-' + this.current);
    html.lang = this.current;
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.current);
    });
  }
};

// ============================================================
// LIGHTBOX
// ============================================================

const Lightbox = {
  el: null,
  items: [],
  idx: 0,

  init() {
    this.el = document.querySelector('.lightbox');
    if (!this.el) return;

    document.querySelectorAll('.lightbox-trigger').forEach((t, i) => {
      this.items.push({
        src: t.dataset.src || '',
        captionRu: t.dataset.captionRu || '',
        captionEn: t.dataset.captionEn || ''
      });
      t.addEventListener('click', () => this.open(i));
    });

    if (!this.items.length) return;

    this.el.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.el.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.el.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    this.el.addEventListener('click', e => { if (e.target === this.el) this.close(); });

    document.addEventListener('keydown', e => {
      if (!this.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  },

  open(i) {
    this.idx = i;
    this.render();
    this.el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.el.classList.remove('is-open');
    document.body.style.overflow = '';
  },

  prev() { this.idx = (this.idx - 1 + this.items.length) % this.items.length; this.render(); },
  next() { this.idx = (this.idx + 1) % this.items.length; this.render(); },

  render() {
    const item = this.items[this.idx];
    const img = this.el.querySelector('.lightbox-media');
    if (item.src) { img.src = item.src; img.style.display = ''; }
    else img.style.display = 'none';
    this.updateCaption();
    this.el.querySelector('.lightbox-counter').textContent = `${this.idx + 1} / ${this.items.length}`;
  },

  updateCaption() {
    if (!this.el || !this.items.length) return;
    const item = this.items[this.idx];
    const cap = this.el.querySelector('.lightbox-cap');
    if (!cap) return;
    cap.textContent = Lang.current === 'en' && item.captionEn ? item.captionEn : item.captionRu;
  }
};

// ============================================================
// MOBILE NAV
// ============================================================

const MobileNav = {
  init() {
    const btn = document.querySelector('.nav-hamburger');
    const right = document.querySelector('.nav-right');
    if (!btn || !right) return;

    btn.addEventListener('click', () => {
      const open = right.classList.toggle('is-open');
      btn.classList.toggle('open', open);
    });

    right.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        right.classList.remove('is-open');
        btn.classList.remove('open');
      });
    });
  }
};

// ============================================================
// ACTIVE NAV LINK
// ============================================================

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

// ============================================================
// FOOTER YEAR
// ============================================================

function setYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  Lang.init();
  Lightbox.init();
  MobileNav.init();
  setActiveNav();
  setYear();
});
