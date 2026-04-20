/* Paige Simm — Combined Script */

(function() {
  'use strict';

  // ---------- SCROLL PROGRESS BAR ----------
  const progressBar = document.getElementById('scroll-bar') || document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // ---------- NAV GLASS EFFECT ----------
  const nav = document.querySelector('.nav') || document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  // ---------- MOBILE DRAWER ----------
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- TEXT SCRAMBLE ON HERO (INDEX ONLY) ----------
  const nameLine1 = document.getElementById('nameLine1');
  const nameLine2 = document.getElementById('nameLine2');
  if (nameLine1 && nameLine2) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
    function scrambleElement(el, finalText, duration) {
      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const revealUpTo = Math.floor(progress * finalText.length);
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === '.' || finalText[i] === ' ') {
            result += finalText[i];
          } else if (i < revealUpTo) {
            result += finalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = result;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = finalText;
      }
      requestAnimationFrame(step);
    }
    setTimeout(() => {
      scrambleElement(nameLine1, 'Paige', 700);
      setTimeout(() => scrambleElement(nameLine2, 'Simm.', 800), 250);
    }, 400);
  }

  // ---------- REVEAL ON SCROLL (Combined: homepage + case studies) ----------
  const revealElements = document.querySelectorAll('.reveal');
  const csSections = document.querySelectorAll('.cs-section');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        entry.target.classList.add('visible'); // for cs-section compatibility
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  
  revealElements.forEach(el => revealObserver.observe(el));
  csSections.forEach(section => revealObserver.observe(section));

  // Fallback: force reveal after 1 second for any cs-section not yet visible
  if (csSections.length) {
    setTimeout(() => {
      csSections.forEach(section => {
        if (!section.classList.contains('visible')) {
          section.classList.add('visible');
        }
      });
    }, 1000);
  }

  // ---------- STICKY SECTION DOTS (Case Studies) ----------
  const sections = document.querySelectorAll('.cs-section');
  const dotsWrap = document.getElementById('section-dots');
  if (dotsWrap && sections.length) {
    // Create dots
    sections.forEach((sec, i) => {
      const dot = document.createElement('div');
      dot.className = 'sdot';
      dot.title = sec.querySelector('.section-label')?.textContent || (i + 1);
      dot.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
      dotsWrap.appendChild(dot);
    });
    
    const dots = dotsWrap.querySelectorAll('.sdot');
    const dotObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = [...sections].indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { threshold: 0.4 });
    
    sections.forEach(s => dotObserver.observe(s));
  }

  // ---------- ANIMATED STAT COUNTERS ----------
  function animateCounter(el) {
    const raw = el.dataset.target;
    if (!raw) return;
    // Handle non-numeric values like "B2B", "SQL"
    if (!/^\d/.test(raw)) {
      el.textContent = raw;
      return;
    }
    const end = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[\d.]/g, '');
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (Number.isInteger(end) ? Math.round(eased * end) : (eased * end).toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-pill-val[data-target]').forEach(el => counterObserver.observe(el));

  // ---------- 3D CARD TILT (Bento Cards) ----------
  const tiltCards = document.querySelectorAll('.bento-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.015)`;
      card.style.transition = 'transform 0.1s ease';
      card.style.zIndex = '2';
      card.style.position = 'relative';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.5s ease';
      card.style.zIndex = '';
    });
  });

  // ---------- MAGNETIC CONTACT LINKS ----------
  const contactLinks = document.querySelectorAll('.contact-link');
  contactLinks.forEach(link => {
    link.addEventListener('mousemove', e => {
      const rect = link.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
      link.style.transform = `translate(${x}px, ${y}px)`;
      link.style.transition = 'transform 0.12s ease';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translate(0, 0)';
      link.style.transition = 'transform 0.5s ease';
    });
  });

  // ---------- SKILL TAGS STAGGER ----------
  const skillTags = document.querySelectorAll('.skill-tag');
  if (skillTags.length) {
    skillTags.forEach(tag => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(8px)';
      tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    const skillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillTags.forEach((tag, i) => {
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'none';
          }, i * 40);
        });
        skillObserver.disconnect();
      }
    }, { threshold: 0.2 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) skillObserver.observe(aboutSection);
  }

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
