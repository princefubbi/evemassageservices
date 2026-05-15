  // ── HIGHLIGHT TODAY'S HOURS ──
  (function() {
    const today = new Date().getDay();
    const rows = document.querySelectorAll('.hours-row');
    rows.forEach(row => {
      if (parseInt(row.dataset.day) === today) {
        row.classList.add('today');
        const tds = row.querySelectorAll('td');
        if (tds[0]) {
          const badge = document.createElement('span');
          badge.className = 'open-now-badge';
          badge.innerHTML = '<span class="open-dot"></span> Today';
          tds[0].appendChild(badge);
        }
      }
    });
  })();

  // ── FORM SUBMISSION ──
  function submitForm() {
    const name    = document.getElementById('fname').value.trim();
    const phone   = document.getElementById('fphone').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const reason  = document.getElementById('freason').value;
    const service = document.getElementById('fservice').value;
    const message = document.getElementById('fmessage').value.trim();

    if (!name) { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }

    const reasonMap = {
      booking: 'Book a session', pricing: 'Pricing enquiry',
      'home-service': 'Home service availability', corporate: 'Corporate wellness',
      partnership: 'Partnership or referral', complaint: 'Feedback or complaint', other: 'General enquiry'
    };
    const serviceMap = {
      'deep-tissue': 'Deep Tissue Massage', aromatherapy: 'Aromatherapy Massage',
      'hot-stone': 'Hot Stone Therapy', lymphatic: 'Lymphatic Drainage',
      sports: 'Sports Recovery Massage', reflexology: 'Reflexology',
      steam: 'Herbal Steam Bath', pedicure: 'Pedicure & Manicure',
      stroke: 'Stroke Recovery Therapy', diabetes: 'Diabetes Support Therapy'
    };

    const msg = encodeURIComponent(
      '📋 New Contact Form Message\n\n' +
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      (email ? 'Email: ' + email + '\n' : '') +
      'Reason: ' + (reasonMap[reason] || 'General enquiry') + '\n' +
      (service ? 'Service interest: ' + (serviceMap[service] || service) + '\n' : '') +
      (message ? '\nMessage:\n' + message : '')
    );

    window.open('https://wa.me/2349055853040?text=' + msg, '_blank');

    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }

  // ── FAQ ACCORDION ──
  function toggleFaq(id) {
    const item = document.getElementById(id);
    item.classList.toggle('open');
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
  }, { threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));