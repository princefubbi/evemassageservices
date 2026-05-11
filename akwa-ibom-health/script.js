  // ── SEARCH ──
  function handleHeroSearch() {
    const query = document.getElementById('heroSearch').value.toLowerCase();
    const lga   = document.getElementById('lgaFilter').value;
    const type  = document.getElementById('typeFilter').value;
    const cards = document.querySelectorAll('.listing-card');
    cards.forEach(card => {
      const name    = card.querySelector('.listing-name').textContent.toLowerCase();
      const address = card.querySelector('.listing-address').textContent.toLowerCase();
      const cardLga = card.dataset.lga || '';
      const cardType= card.dataset.type || '';
      const matchQ  = !query || name.includes(query) || address.includes(query);
      const matchL  = !lga  || cardLga === lga;
      const matchT  = !type || cardType === type;
      card.style.display = (matchQ && matchL && matchT) ? 'flex' : 'none';
    });
  }

  // ── LGA FILTER ──
  function filterLGAs(phase, btn) {
    document.querySelectorAll('.lga-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.lga-card').forEach(card => {
      card.style.display = (phase === 'all' || card.dataset.phase === phase) ? '' : 'none';
    });
  }

  // ── SUGGEST ──
  function submitSuggestion() {
    const inputs = document.querySelectorAll('.suggest-input');
    const name = inputs[0].value.trim();
    if (!name) { alert('Please enter the facility name.'); return; }
    const lga  = inputs[1].value.trim();
    const phone= inputs[2].value.trim();
    const type = inputs[3].value.trim();
    const msg  = encodeURIComponent(
      '🏥 New Facility Suggestion — Akwa Ibom Health Directory\n\n' +
      'Facility: ' + name + '\n' +
      'LGA: ' + (lga || 'Not specified') + '\n' +
      'Phone: ' + (phone || 'Not provided') + '\n' +
      'Type: ' + (type || 'Not specified')
    );
    window.open('https://wa.me/2349055853040?text=' + msg, '_blank');
    inputs.forEach(i => i.value = '');
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
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));