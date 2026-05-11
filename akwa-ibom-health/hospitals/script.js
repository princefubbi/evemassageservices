  // ── VERIFIED DATE ──
  (function() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-NG', { month: 'long' });
    const year = now.getFullYear();
    const suffix = d => [,'st','nd','rd'][d%10] && ![11,12,13].includes(d%100) ? [,'st','nd','rd'][d%10] : 'th';
    document.getElementById('verifiedDate').textContent = `${day}${suffix(day)} ${month} ${year}`;
  })();

  // ── SEARCH & FILTER ──
  let sidebarType = 'all';

  function runSearch() {
    const query   = document.getElementById('mainSearch').value.toLowerCase();
    const lga     = document.getElementById('lgaSelect').value;
    const type    = document.getElementById('typeSelect').value;
    const feature = document.getElementById('featureSelect').value;
    const checkedFeats = [...document.querySelectorAll('.feature-check-item input:checked')].map(c => c.value);

    let totalVisible = 0;

    // Show/hide full LGA sections based on LGA filter
    document.querySelectorAll('.lga-section').forEach(section => {
      const sectionLga = section.dataset.lga;
      if (lga && sectionLga !== lga) {
        section.style.display = 'none';
        return;
      }
      section.style.display = '';
    });

    // Filter individual cards
    document.querySelectorAll('.hospital-card').forEach(card => {
      const name      = (card.dataset.name || '').toLowerCase();
      const cardType  = card.dataset.type || '';
      const cardFeats = card.dataset.features || '';

      const matchQ  = !query || name.includes(query);
      const matchT  = (!type && sidebarType === 'all') || cardType === type || (sidebarType !== 'all' && cardType === sidebarType);
      const matchF  = !feature || cardFeats.includes(feature);
      const matchCF = checkedFeats.length === 0 || checkedFeats.every(f => cardFeats.includes(f));
      const matchL  = !lga || card.closest('.lga-section')?.dataset.lga === lga;

      const show = matchQ && matchT && matchF && matchCF && matchL;
      card.style.display = show ? '' : 'none';
      if (show) totalVisible++;
    });

    document.getElementById('visibleCount').textContent = totalVisible;

    // Show/hide no-results
    document.getElementById('noResults').classList.toggle('visible', totalVisible === 0);
  }

  function setSidebarType(type, el) {
    document.querySelectorAll('.filter-opt').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    sidebarType = type;
    // Sync the strip select
    const stripSel = document.getElementById('typeSelect');
    stripSel.value = type === 'all' ? '' : type;
    runSearch();
  }

  function clearFilters() {
    document.getElementById('mainSearch').value = '';
    document.getElementById('lgaSelect').value = '';
    document.getElementById('typeSelect').value = '';
    document.getElementById('featureSelect').value = '';
    document.querySelectorAll('.feature-check-item input').forEach(c => c.checked = false);
    document.querySelectorAll('.filter-opt').forEach(o => o.classList.remove('active'));
    document.querySelector('.filter-opt').classList.add('active');
    sidebarType = 'all';
    document.querySelectorAll('.lga-section, .hospital-card').forEach(el => el.style.display = '');
    document.getElementById('noResults').classList.remove('visible');
    document.getElementById('visibleCount').textContent = document.querySelectorAll('.hospital-card').length;
  }

  // ── SUGGEST ──
  function suggestHospital() {
    const msg = encodeURIComponent('🏥 Hospital Suggestion — Akwa Ibom Health Directory\n\nHospital name:\nLGA / Location:\nPhone number (if known):\nType (Government / Private / Teaching):');
    window.open('https://wa.me/2349055853040?text=' + msg, '_blank');
  }

  // ── MOBILE MENU ──
  function toggleMobileMenu() {
    document.getElementById('mobileMenuBtn').classList.toggle('open');
    document.getElementById('mobileMenuDrawer').classList.toggle('open');
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-nav') && !e.target.closest('.mobile-menu-drawer')) {
      document.getElementById('mobileMenuBtn').classList.remove('open');
      document.getElementById('mobileMenuDrawer').classList.remove('open');
    }
  });

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.05 });
  revealEls.forEach(el => observer.observe(el));

  // Set initial count
  document.getElementById('visibleCount').textContent = document.querySelectorAll('.hospital-card').length;