(function() {
  // --- SCROLL PROGRESS BAR ---
  const progressBar = document.getElementById('scroll-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // --- NAV GLASS EFFECT ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  // --- MOBILE DRAWER ---
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

  // --- TEXT SCRAMBLE ON HERO (INDEX ONLY) ---
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

  // --- REVEAL ANIMATIONS (homepage) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- CASE STUDY SECTION REVEAL (with fallback) ---
  const csSections = document.querySelectorAll('.cs-section');
  if (csSections.length) {
    const csObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          csObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    csSections.forEach(section => csObserver.observe(section));

    // FALLBACK: after 1 second, reveal any section that still isn't visible
    setTimeout(() => {
      csSections.forEach(section => {
        if (!section.classList.contains('visible')) {
          section.classList.add('visible');
        }
      });
    }, 1000);
  }

  // --- 3D CARD TILT (Bento cards) ---
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

  // --- MAGNETIC CONTACT LINKS ---
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

  // --- SKILL TAGS STAGGER ---
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

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
