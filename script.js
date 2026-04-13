/* =============================================
   Paige Simm — Portfolio JS
   ============================================= */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

/* ── Page transition overlay ── */
const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed;inset:0;background:#0e0d0b;z-index:9000;pointer-events:none;opacity:0;transition:opacity 0.4s ease;';
document.body.appendChild(overlay);

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  if (!href.endsWith('.html')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 420);
  });
});

/* ── Custom cursor ── */
// Only run on non-touch devices
if (window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  const ring = document.createElement('div');

  dot.style.cssText = [
    'position:fixed', 'width:8px', 'height:8px',
    'background:#0e0d0b', 'border-radius:50%',
    'pointer-events:none', 'z-index:8999',
    'left:0', 'top:0',
    'will-change:transform',
    'transition:background 0.2s, transform 0.15s ease'
  ].join(';');

  ring.style.cssText = [
    'position:fixed', 'width:36px', 'height:36px',
    'border:1.5px solid #0e0d0b', 'border-radius:50%',
    'pointer-events:none', 'z-index:8998',
    'left:0', 'top:0',
    'will-change:transform',
    'transition:width 0.3s, height 0.3s, border-color 0.3s'
  ].join(';');

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(loop);
  })();

  // Hover states
  function addHover(selector, dotScale, ringSize, color) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(${dotScale})`;
        dot.style.background = color;
        ring.style.width = ringSize + 'px';
        ring.style.height = ringSize + 'px';
        ring.style.borderColor = color;
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(1)`;
        dot.style.background = '#0e0d0b';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = '#0e0d0b';
      });
    });
  }

  addHover('.pcard', 3, 56, '#c8a96e');
  addHover('a:not(.pcard), button', 2, 48, '#c8a96e');
  addHover('.skill-tag', 2, 44, '#c8a96e');
}

/* ── Nav scroll ── */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Scroll progress bar ── */
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#c8a96e;z-index:8997;width:0;pointer-events:none;';
document.body.appendChild(bar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ── Text scramble ── */
function scramble(el, finalText, duration) {
  const orig = el.textContent;
  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const reveal = Math.floor(p * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      if (i < reveal || finalText[i] === ' ' || finalText[i] === '.') {
        out += finalText[i];
      } else {
        out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

window.addEventListener('load', () => {
  const l1 = document.querySelector('.hero-name-line:first-child');
  const l2 = document.querySelector('.hero-name-line:last-child');
  if (l1) setTimeout(() => scramble(l1, 'Paige', 700), 400);
  if (l2) setTimeout(() => scramble(l2, 'Simm.', 800), 650);
});

/* ── Card tilt ── */
document.querySelectorAll('.wcard--full, .wcard--half').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 5;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -4;
    card.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) scale(1.01)`;
    card.style.transition = 'transform 0.08s ease';
    card.style.zIndex = '2';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.6s ease';
    card.style.zIndex = '';
  });
});

/* ── Magnetic contact links ── */
document.querySelectorAll('.contact-link').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.2;
    const y = (e.clientY - r.top - r.height / 2) * 0.2;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform 0.5s ease';
  });
});

/* ── Skill tags stagger ── */
const tags = document.querySelectorAll('.skill-tag');
if (tags.length) {
  tags.forEach(t => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; t.style.transition = 'opacity 0.35s ease, transform 0.35s ease'; });
  const tagObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tags.forEach((t, i) => setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'none'; }, i * 35));
      tagObs.disconnect();
    }
  }, { threshold: 0.3 });
  tagObs.observe(tags[0].closest('section') || tags[0]);
}

/* ── Section fade-ins ── */
const fadeTargets = [
  '.about-left', '.about-body',
  '.work-header', '.pcard',
  '.exp-heading-col', '.exp-item',
  '.contact-left', '.contact-right'
];
const fadeEls = document.querySelectorAll(fadeTargets.join(','));
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });
fadeEls.forEach(el => fadeObs.observe(el));
// Fallback
setTimeout(() => fadeEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }), 2500);

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});
