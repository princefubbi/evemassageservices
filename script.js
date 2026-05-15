  // ── QUICK BOOK ──
  const qbSt = {};
  document.getElementById('qbDate').min = new Date().toISOString().split('T')[0];

  function qbUpdateFill() {
    const done = [qbSt[1], qbSt[2], qbSt[3], qbSt[4]].filter(Boolean).length;
    document.getElementById('qbBarFill').style.width = (done / 4 * 100) + '%';
  }

  function qbOpenStep(e, n) {
    e.stopPropagation();
    const isOpen = document.getElementById('qhd'+n).classList.contains('open');
    qbCloseAll();
    if (!isOpen) {
      document.getElementById('qhd'+n).classList.add('open');
      document.getElementById('qhs'+n).classList.add('active');
    }
  }

  function qbCloseAll() {
    for (let i = 1; i <= 4; i++) {
      document.getElementById('qhd'+i).classList.remove('open');
      if (!qbSt[i]) document.getElementById('qhs'+i).classList.remove('active');
    }
  }

  function qbPick(e, step, val) {
    e.stopPropagation();
    qbSt[step] = val;
    document.getElementById('qhd'+step).querySelectorAll('.qb-opt, .qb-tcard').forEach(o => o.classList.remove('sel'));
    e.target.closest('.qb-opt, .qb-tcard').classList.add('sel');
    const valEl = document.getElementById('qhv'+step);
    valEl.textContent = val;
    valEl.classList.remove('placeholder');
    document.getElementById('qhs'+step).classList.add('done');
    qbUpdateFill();
    qbCloseAll();
    const next = document.getElementById('qhd'+(step+1));
    const nextStep = document.getElementById('qhs'+(step+1));
    if (next) setTimeout(() => { next.classList.add('open'); nextStep.classList.add('active'); }, 180);
    qbCheckReady();
  }

  function qbPickDT() {
    const d = document.getElementById('qbDate').value;
    const t = document.getElementById('qbTime').value;
    if (!d || !t) return;
    qbSt[4] = d + '|' + t;
    const parsed = new Date(d + 'T00:00:00');
    const dateStr = parsed.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });
    const valEl = document.getElementById('qhv4');
    valEl.textContent = dateStr + ' · ' + t;
    valEl.classList.remove('placeholder');
    document.getElementById('qhs4').classList.add('done');
    qbUpdateFill();
    setTimeout(() => qbCloseAll(), 300);
    qbCheckReady();
  }

  function qbCheckReady() {
    const ready = qbSt[1] && qbSt[2] && qbSt[3] && qbSt[4];
    const btn = document.getElementById('qbBookBtn');
    btn.className = 'qb-book-btn ' + (ready ? 'on pulse' : 'off');
  }

  function qbDoBook() {
    if (!(qbSt[1] && qbSt[2] && qbSt[3] && qbSt[4])) return;
    const [d, t] = qbSt[4].split('|');
    const parsed = new Date(d + 'T00:00:00');
    const dateStr = parsed.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const msg = encodeURIComponent(
      'Hello Eve Massage! 👋\n\nQuick booking request:\n\n' +
      'Massage type: ' + qbSt[1] + '\n' +
      'Service: ' + qbSt[2] + '\n' +
      'How: ' + qbSt[3] + '\n' +
      'Date: ' + dateStr + '\n' +
      'Time: ' + t + '\n\n' +
      'Please confirm. Thank you!'
    );
    window.open('https://wa.me/2349055853040?text=' + msg, '_blank');
  }

  // ── HERO FACT CAROUSEL ──
  const heroFacts = document.querySelectorAll('.hero-fact');
  const heroDotsContainer = document.getElementById('heroCarouselDots');
  const HERO_DURATION = 9000;
  let heroCurrent = 0;
  let heroTimer = null;

  heroFacts.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'q-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Health fact ${i + 1}`);
    dot.addEventListener('click', () => heroGoTo(i));
    heroDotsContainer.appendChild(dot);
  });

  function getHeroDots() { return heroDotsContainer.querySelectorAll('.q-dot'); }

  function heroGoTo(index) {
    clearTimeout(heroTimer);
    const outgoing = heroFacts[heroCurrent];
    outgoing.style.position = 'absolute';
    outgoing.style.opacity = '0';
    outgoing.style.pointerEvents = 'none';
    outgoing.classList.remove('active');
    getHeroDots()[heroCurrent].classList.remove('active');
    heroCurrent = (index + heroFacts.length) % heroFacts.length;
    const incoming = heroFacts[heroCurrent];
    incoming.style.position = 'relative';
    incoming.style.opacity = '0';
    incoming.classList.add('active');
    getHeroDots()[heroCurrent].classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { incoming.style.opacity = '1'; });
    });
    heroTimer = setTimeout(() => heroGoTo(heroCurrent + 1), HERO_DURATION);
  }

  heroFacts.forEach(f => { f.style.transition = 'opacity 0.9s ease'; });
  heroTimer = setTimeout(() => heroGoTo(1), HERO_DURATION);

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.classList.add('visible'); }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ── MOBILE MENU ──
  function toggleMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileMenuDrawer');
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
  }

  document.querySelectorAll('.drawer-link, .drawer-book-btn').forEach(l => {
    l.addEventListener('click', () => {
      document.getElementById('mobileMenuBtn').classList.remove('open');
      document.getElementById('mobileMenuDrawer').classList.remove('open');
    });
  });

  // ── SINGLE GLOBAL CLICK HANDLER ──
  document.addEventListener('click', (e) => {
    // Close quick book dropdowns
    if (!e.target.closest('.hbar-wrap')) {
      qbCloseAll();
    }
    // Close mobile menu
    if (!e.target.closest('.mobile-nav') && !e.target.closest('.mobile-menu-drawer')) {
      const btn = document.getElementById('mobileMenuBtn');
      const drawer = document.getElementById('mobileMenuDrawer');
      if (btn) btn.classList.remove('open');
      if (drawer) drawer.classList.remove('open');
    }
  });