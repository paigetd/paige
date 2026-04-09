// ── Custom cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
  ring.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
});

document.querySelectorAll('a, button, .project-card, .skill-tag, .exp-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── Scroll reveals ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Nav background on scroll ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.backdropFilter = 'blur(14px)';
    nav.style.background = 'rgba(247,245,240,0.85)';
    nav.style.mixBlendMode = 'normal';
  } else {
    nav.style.backdropFilter = '';
    nav.style.background = '';
    nav.style.mixBlendMode = 'multiply';
  }
});
