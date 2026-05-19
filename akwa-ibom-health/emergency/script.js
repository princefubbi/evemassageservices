  // ── FIRST AID ACCORDION ──
  function toggleFirstAid(id) {
    const card = document.getElementById(id);
    card.classList.toggle('open');
  }

  // ── PAGE TAB SCROLL HIGHLIGHTING ──
  const tabSections = [
    { tab: 0, id: 'emergency-numbers' },
    { tab: 1, id: 'ae-hospitals' },
    { tab: 2, id: 'first-aid' },
    { tab: 3, id: 'mental-health' },
    { tab: 4, id: 'poison-control' },
    { tab: 5, id: 'what-to-do' },
    { tab: 6, id: 'save-numbers' }
  ];
  const tabs = document.querySelectorAll('.page-tab');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = tabSections.find(s => s.id === entry.target.id);
        if (match) {
          tabs.forEach(t => t.classList.remove('active'));
          tabs[match.tab]?.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  tabSections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) sectionObserver.observe(el);
  });

  // ── SAVE NUMBERS ──
  function saveNumbers() {
    const msg = encodeURIComponent(
      '🚨 EMERGENCY NUMBERS — AKWA IBOM STATE\n\n' +
      'General Emergency: 112\n' +
      'Police: 199\n' +
      'Fire Service: 193\n' +
      'UUTH A&E (Uyo): 0803 359 7921\n' +
      'AKSG Health Hotline: 0803 084 1666\n' +
      'Mental Health Crisis (NSMHF): 0800 227 3835\n' +
      'MANI Crisis Line: 0809 111 6264\n' +
      'Poison Control (NAFDAC): 0800 123 4567\n\n' +
      'Save these numbers now — before you need them.\n' +
      'Full emergency resources: https://www.evemassages.com/akwa-ibom-health/emergency/'
    );
    window.open('https://wa.me/?text=' + msg, '_blank');
  }

  // ── SHARE PAGE ──
  function shareEmergencyPage() {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Healthcare Resources — Akwa Ibom State',
        text: 'Emergency numbers, A&E hospitals, first aid guidance and more for Akwa Ibom State. Share with your family.',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied! Share it with your family and friends.'))
        .catch(() => alert('Copy this link: ' + window.location.href));
    }
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
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.05 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ── OPEN FIRST CARD BY DEFAULT ──
  document.getElementById('fa-cardiac').classList.add('open');