  (function() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-NG', { month: 'long' });
    const year = now.getFullYear();
    const suffix = d => [,'st','nd','rd'][d%10] && ![11,12,13].includes(d%100) ? [,'st','nd','rd'][d%10] : 'th';
    document.getElementById('verifiedDate').textContent = `${day}${suffix(day)} ${month} ${year}`;
  })();

  let sidebarType = 'all';

  function runSearch() {
    const query   = document.getElementById('mainSearch').value.toLowerCase();
    const lga     = document.getElementById('lgaSelect').value;
    const type    = document.getElementById('typeSelect').value;
    const feature = document.getElementById('featureSelect').value;
    const checkedFeats = [...document.querySelectorAll('.feature-check-item input:checked')].map(c => c.value);
    let totalVisible = 0;

    document.querySelectorAll('.lga-section').forEach(section => {
      const sectionLga = section.dataset.lga;
      section.style.display = (lga && sectionLga !== lga) ? 'none' : '';
    });

    document.querySelectorAll('.clinic-card').forEach(card => {
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
    document.getElementById('noResults').classList.toggle('visible', totalVisible === 0);
  }

  function setSidebarType(type, el) {
    document.querySelectorAll('.filter-opt').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    sidebarType = type;
    document.getElementById('typeSelect').value = type === 'all' ? '' : type;
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
    document.querySelectorAll('.lga-section, .clinic-card').forEach(el => el.style.display = '');
    document.getElementById('noResults').classList.remove('visible');
    document.getElementById('visibleCount').textContent = document.querySelectorAll('.clinic-card').length;
  }

  function suggestClinic() {
    const msg = encodeURIComponent('🩺 Clinic Suggestion — Akwa Ibom Health Directory\n\nClinic name:\nLGA / Location:\nPhone number (if known):\nType (Primary / Specialist / Maternity / Diagnostic / Dental / Eye):');
    window.open('https://wa.me/2349055853040?text=' + msg, '_blank');
  }

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

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.05 });
  revealEls.forEach(el => observer.observe(el));

  document.getElementById('visibleCount').textContent = document.querySelectorAll('.clinic-card').length;