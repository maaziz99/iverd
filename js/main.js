/* Iverd Studio portfolio: header, scroll spy, reveal-on-scroll, lightbox. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  const header = $('#header');
  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const links = $$('.nav-link');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = open => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Scroll spy + reveal on scroll ---------- */
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));

    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(el => reveal.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Lightbox ---------- */
  const lb = $('#lb');
  const lbImg = $('#lbImg');
  const lbTitle = $('#lbTitle');
  const lbCat = $('#lbCat');
  const lbCount = $('#lbCount');
  const items = $$('.lb-trigger');
  let current = 0;
  let lastFocus = null;

  const show = i => {
    current = (i + items.length) % items.length;
    const a = items[current];
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.dataset.title;
    lbTitle.textContent = a.dataset.title;
    lbCat.textContent = a.dataset.cat;
    lbCount.textContent = `${current + 1} / ${items.length}`;
  };
  const open = i => {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  };
  const close = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); open(i); }));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(current - 1));
  $('#lbNext').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* Touch swipe */
  let startX = null;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
