/* ============================================
   MEGH BAME — Portfolio JS
   ============================================ */

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followX += (mouseX - followX) * 0.12;
  followY += (mouseY - followY) * 0.12;
  follower.style.left = followX + 'px';
  follower.style.top = followY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover
document.querySelectorAll('a, button, .portfolio-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    follower.style.width = '48px';
    follower.style.height = '48px';
    follower.style.borderColor = 'rgba(0,245,196,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    follower.style.width = '32px';
    follower.style.height = '32px';
    follower.style.borderColor = 'rgba(0,245,196,0.4)';
  });
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  menuToggle.children[0].style.transform = menuOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
  menuToggle.children[1].style.transform = menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

function closeMobile() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  menuToggle.children[0].style.transform = '';
  menuToggle.children[1].style.transform = '';
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function initReveal() {
  const revealEls = document.querySelectorAll(
    '.portfolio-card, .service-card, .proof-card, .contact-card, .testimonial, .about-visual, .about-content, .section-header, .filter-tabs, .contact-form'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });
}
initReveal();

// ── COUNTER ANIMATION ──
function animateCounter(el, target) {
  let current = 0;
  const step = target / 50;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 30);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── PORTFOLIO FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioCards.forEach((card, i) => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${i * 0.05}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── CONTACT FORM ──
async function sendMessage() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const service = document.getElementById('fservice').value;
  const msg = document.getElementById('fmsg').value.trim();
  const btn = document.getElementById('sendBtn');
  const formMsg = document.getElementById('formMsg');

  if (!name || !email || !msg) {
    shakeBtn(btn);
    return;
  }

  btn.querySelector('span').textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service, message: msg })
    });
    const data = await res.json();

    if (data.status === 'success') {
      formMsg.style.display = 'block';
      document.getElementById('fname').value = '';
      document.getElementById('femail').value = '';
      document.getElementById('fmsg').value = '';
      document.getElementById('fservice').selectedIndex = 0;
      btn.querySelector('span').textContent = 'Sent!';
      setTimeout(() => {
        btn.querySelector('span').textContent = 'Send Message';
        btn.disabled = false;
      }, 3000);
    }
  } catch (e) {
    btn.querySelector('span').textContent = 'Send Message';
    btn.disabled = false;
    console.error(e);
  }
}

function shakeBtn(btn) {
  btn.style.animation = 'shake 0.4s ease';
  setTimeout(() => { btn.style.animation = ''; }, 400);
}

// Inject shake keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    60% { transform: translateX(6px); }
    80% { transform: translateX(-3px); }
  }
`;
document.head.appendChild(style);

// ── SMOOTH PARALLAX HERO ──
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = 1 - scrollY / 600;
  }
});

// ── MAGNETIC EFFECT ON BUTTONS ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translateX(${x * 0.15}px) translateY(${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── ACTIVE NAV LINK HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// Add active link style
const linkStyle = document.createElement('style');
linkStyle.textContent = `.nav-links a.active { color: var(--neon) !important; }`;
document.head.appendChild(linkStyle);

console.log('%c Megh Bame Portfolio ', 'background: #00f5c4; color: #000; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
