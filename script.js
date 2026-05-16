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
    const HERO_DURATION = 7000; // 7 seconds per fact — comfortable reading time
    let heroCurrent = 0;
    let heroTimer = null;
 
    // Build dots
    heroFacts.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'q-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Health fact ${i + 1}`);
      dot.addEventListener('click', () => heroGoTo(i));
      heroDotsContainer.appendChild(dot);
    });
 
    function getHeroDots() { return heroDotsContainer.querySelectorAll('.q-dot'); }
 
    // ── CAROUSEL: opacity-only crossfade — no position changes ever ──
    // All facts stay position:absolute at all times (set in CSS).
    // Only opacity and classList change. This guarantees zero layout shift.
 
    const FADE_DURATION = 500; // ms — fade speed
    let heroTransitioning = false;
 
    // Apply transition once to all facts
    heroFacts.forEach(f => {
      f.style.transition = `opacity ${FADE_DURATION}ms ease`;
    });
 
    function heroGoTo(index) {
      // Block if a fade is already in progress — prevents stacking
      if (heroTransitioning) return;
      heroTransitioning = true;
      clearTimeout(heroTimer);
 
      const outgoing = heroFacts[heroCurrent];
 
      // ── Step 1: fade out outgoing ──
      outgoing.style.opacity = '0';
      outgoing.style.pointerEvents = 'none';
      getHeroDots()[heroCurrent].classList.remove('active');
 
      // ── Step 2: after fade out, switch active class and fade in incoming ──
      setTimeout(() => {
        outgoing.classList.remove('active');
 
        heroCurrent = (index + heroFacts.length) % heroFacts.length;
        const incoming = heroFacts[heroCurrent];
 
        // Bring incoming to opacity:0 first (it may already be 0 from CSS)
        incoming.style.opacity = '0';
        incoming.classList.add('active');
        getHeroDots()[heroCurrent].classList.add('active');
 
        // Trigger fade in on the next two animation frames
        // (double-rAF ensures the browser has committed the opacity:0 before transitioning)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            incoming.style.opacity = '1';
            incoming.style.pointerEvents = 'auto';
          });
        });
 
        // Unlock and schedule next after fade in completes
        setTimeout(() => {
          heroTransitioning = false;
          heroTimer = setTimeout(() => heroGoTo(heroCurrent + 1), HERO_DURATION);
        }, FADE_DURATION + 50);
 
      }, FADE_DURATION); // wait for full fade out before touching incoming
    }
 
    // Ensure the first fact is visible immediately
    heroFacts[0].style.opacity = '1';
    heroFacts[0].style.pointerEvents = 'auto';
 
    // Kick off auto-advance
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


  (function () {
    // ── CONFIG ──────────────────────────────────────────────────
    // The number shown in the label can be updated anytime
    var bookedCount = 312;

    // Pre-filled WhatsApp message
    var waMessage = "Hello%2C%20I%20found%20you%20on%20your%20website%20and%20I%27d%20like%20to%20learn%20more%20about%20your%20services.";
    // ────────────────────────────────────────────────────────────

    var wrap    = document.getElementById('waFloatWrap');
    var btn     = document.getElementById('waFloatBtn');
    var carousel = document.getElementById('heroCarousel');

    if (!wrap || !carousel) return; // safety — do nothing if elements missing

    // Update WhatsApp link with config message
    btn.href = 'https://wa.me/2349055853040?text=' + waMessage;

    // ── INTERSECTION OBSERVER ──
    // Watches the carousel — when it leaves the viewport, show the button.
    // When it re-enters the viewport, hide the button.
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Carousel is visible — hide the button
            wrap.classList.remove('wa-visible');
            wrap.setAttribute('aria-hidden', 'true');
          } else {
            // Carousel has left the viewport — show the button
            wrap.classList.add('wa-visible');
            wrap.setAttribute('aria-hidden', 'false');
          }
        });
      },
      {
        // Fire when any part of the carousel enters/leaves the viewport.
        // threshold: 0 means "fire as soon as even 1px crosses the edge"
        threshold: 0,
        // rootMargin: give a small top buffer so the button appears
        // just after the carousel fully clears the top of the screen
        rootMargin: '-60px 0px 0px 0px'
      }
    );

    observer.observe(carousel);

  })();

  // For the cookies pop-up banner
(function () {

  // ── CONFIG ──────────────────────────────────────────────
  var GA_ID = 'G-NKT89FYGD0'; // Replace with your real Google Analytics ID
  var STORAGE_KEY = 'ems_cookie_consent';
  var SHOW_DELAY  = 1500; // ms before banner appears
  // ────────────────────────────────────────────────────────

  var wrap = document.getElementById('emsCookieWrap');
  if (!wrap) return;

  // ── CHECK IF USER HAS ALREADY CHOSEN ──
  // If they have, respect their choice and don't show the banner again
  var existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      var saved = JSON.parse(existing);
      if (saved && saved.analytics) loadGA();
    } catch (e) {
      if (existing === 'accepted') loadGA();
    }
    return; // Don't show banner — choice already made
  }

  // ── SHOW BANNER AFTER DELAY ──
  setTimeout(function () {
    wrap.classList.add('ems-visible');
  }, SHOW_DELAY);

  // ── LOAD GOOGLE ANALYTICS ──
  function loadGA() {
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return; // Skip if ID not set
    if (window._emsGALoaded) return; // Prevent double loading
    window._emsGALoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // ── HIDE BANNER ──
  function hideBanner() {
    wrap.classList.remove('ems-visible');
    setTimeout(function () {
      wrap.style.display = 'none';
    }, 400);
  }

  // ── ACCEPT ALL ──
  window.emsAcceptAll = function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    loadGA();
    hideBanner();
  };

  // ── REJECT ALL ──
  window.emsRejectAll = function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    hideBanner();
  };

  // ── DISMISS WITHOUT CHOOSING (X button) ──
  // Does NOT save a preference — banner will reappear next visit
  window.emsDismissBanner = function () {
    hideBanner();
  };

  // ── TOGGLE PREFERENCES PANEL ──
  window.emsTogglePrefs = function () {
    var panel = document.getElementById('emsPrefsPanel');
    var btn   = document.querySelector('.ems-btn-manage');
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.textContent = 'Manage preferences ▾';
    } else {
      panel.classList.add('open');
      btn.textContent = 'Manage preferences ▴';
    }
  };

  // ── SAVE CUSTOM PREFERENCES ──
  window.emsSavePrefs = function () {
    var analyticsOn = document.getElementById('emsAnalyticsToggle').checked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      necessary: true,
      analytics: analyticsOn,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    if (analyticsOn) loadGA();
    hideBanner();
  };

  // ── REOPEN BANNER (for footer "Cookie Settings" link) ──
  // Any element with class 'ems-cookie-settings-trigger' will reopen the banner
  window.emsOpenCookieSettings = function () {
    localStorage.removeItem(STORAGE_KEY);
    wrap.style.display = '';
    wrap.classList.add('ems-visible');
    document.getElementById('emsPrefsPanel').classList.remove('open');
    document.querySelector('.ems-btn-manage').textContent = 'Manage preferences ▾';
  };

  document.querySelectorAll('.ems-cookie-settings-trigger').forEach(function (el) {
    el.addEventListener('click', window.emsOpenCookieSettings);
  });

})();

// End of Cookies pop-up banner