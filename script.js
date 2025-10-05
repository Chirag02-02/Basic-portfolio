// Mobile nav toggle with improved functionality
const navToggleButton = document.querySelector('.nav-toggle');
const navLinksList = document.querySelector('.nav-links');

if (navToggleButton && navLinksList) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('active');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinksList.classList.contains('active') && 
        !navLinksList.contains(e.target) && 
        !navToggleButton.contains(e.target)) {
      navLinksList.classList.remove('active');
      navToggleButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksList.classList.contains('active')) {
      navLinksList.classList.remove('active');
      navToggleButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggleButton.focus();
    }
  });
}

// Theme toggle with persistence
const themeToggleButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
}
if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href') || '';
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinksList && navLinksList.classList.remove('open');
      navToggleButton && navToggleButton.setAttribute('aria-expanded', 'false');
    }
  });
});

// Current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Profile photo tilt effect
const tiltContainer = document.getElementById('photo3d');
const tiltCard = document.getElementById('photoCard');
const glareEl = tiltCard ? tiltCard.querySelector('.glare') : null;
const fireRing = document.getElementById('fireRing');

if (tiltContainer && tiltCard) {
  const maxTiltDeg = 14; // intensity
  const maxScale = 1.06;

  const handleMove = (event) => {
    const rect = tiltContainer.getBoundingClientRect();
    const clientX = (event.touches ? event.touches[0].clientX : event.clientX) || 0;
    const clientY = (event.touches ? event.touches[0].clientY : event.clientY) || 0;
    const x = (clientX - rect.left) / rect.width; // 0..1
    const y = (clientY - rect.top) / rect.height; // 0..1

    const tiltX = (0.5 - y) * (maxTiltDeg * 2); // rotateX
    const tiltY = (x - 0.5) * (maxTiltDeg * 2); // rotateY

    const transformValue = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${maxScale})`;
    tiltCard.style.transform = transformValue;
    if (fireRing) fireRing.style.transform = transformValue;

    if (glareEl) {
      const angle = Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2));
      const deg = angle * 180 / Math.PI + 180;
      const gradient = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 35%, rgba(255,255,255,0) 60%)`;
      glareEl.style.background = gradient;
      glareEl.style.transform = `translateZ(40px) rotate(${deg.toFixed(0)}deg)`;
    }
  };

  const handleEnter = () => {
    tiltContainer.classList.add('is-hover');
    tiltCard.style.willChange = 'transform';
    if (fireRing) fireRing.style.willChange = 'transform';
  };

  const handleLeave = () => {
    tiltContainer.classList.remove('is-hover');
    tiltCard.style.willChange = '';
    tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    if (fireRing) {
      fireRing.style.willChange = '';
      fireRing.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }
    if (glareEl) {
      glareEl.style.background = 'none';
      glareEl.style.transform = 'translateZ(0)';
    }
  };

  // Mouse
  tiltContainer.addEventListener('mousemove', handleMove);
  tiltContainer.addEventListener('mouseenter', handleEnter);
  tiltContainer.addEventListener('mouseleave', handleLeave);
  // Touch
  tiltContainer.addEventListener('touchmove', handleMove, { passive: true });
  tiltContainer.addEventListener('touchstart', handleEnter, { passive: true });
  tiltContainer.addEventListener('touchend', handleLeave, { passive: true });
}

// Click ripple on profile photo
if (tiltCard) {
  const createRipple = (x, y) => {
    const rect = tiltCard.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const localX = x - rect.left;
    const localY = y - rect.top;
    ripple.style.left = `${localX}px`;
    ripple.style.top = `${localY}px`;

    // Scale based on farthest corner to fill the circle
    const dx = Math.max(localX, rect.width - localX);
    const dy = Math.max(localY, rect.height - localY);
    const maxDist = Math.hypot(dx, dy);
    const baseSize = Math.max(rect.width, rect.height) * 0.2;
    ripple.style.width = `${baseSize}px`;
    ripple.style.height = `${baseSize}px`;
    ripple.style.animationDuration = `${Math.min(900, Math.max(500, maxDist * 1.2))}ms`;

    tiltCard.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  tiltCard.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
  });

  tiltCard.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) createRipple(t.clientX, t.clientY);
  }, { passive: true });
}

// Like button logic with localStorage persistence
const likeButtons = Array.from(document.querySelectorAll('.like-btn'));
const LIKE_STORAGE_KEY = 'projectLikes:v1';

function readLikeStore() {
  try {
    return JSON.parse(localStorage.getItem(LIKE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLikeStore(store) {
  localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(store));
}

function renderLike(btn, liked, count) {
  btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
  const text = btn.querySelector('.like-text');
  const counter = btn.querySelector('.like-count');
  if (text) text.textContent = liked ? 'Liked' : 'Like';
  if (counter) counter.textContent = String(count || 0);
}

function burst(btn) {
  const burstEl = document.createElement('span');
  burstEl.className = 'like-burst';
  btn.appendChild(burstEl);
  setTimeout(() => burstEl.remove(), 600);
}

const store = readLikeStore();
likeButtons.forEach(btn => {
  const id = btn.getAttribute('data-like-id') || '';
  const record = store[id] || { liked: false, count: 0 };
  renderLike(btn, record.liked, record.count);

  btn.addEventListener('click', () => {
    const current = store[id] || { liked: false, count: 0 };
    const next = { liked: !current.liked, count: (current.count || 0) + (!current.liked ? 1 : -1) };
    next.count = Math.max(0, next.count);
    store[id] = next;
    writeLikeStore(store);
    renderLike(btn, next.liked, next.count);
    if (next.liked) burst(btn);
  });
});

// Button ripple effect for all .btn
(() => {
  const buttons = Array.from(document.querySelectorAll('.btn'));
  const addRipple = (btn, x, y) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const localX = x - rect.left;
    const localY = y - rect.top;
    ripple.style.left = `${localX}px`;
    ripple.style.top = `${localY}px`;
    const dx = Math.max(localX, rect.width - localX);
    const dy = Math.max(localY, rect.height - localY);
    const maxDist = Math.hypot(dx, dy);
    const baseSize = Math.max(24, Math.min(120, maxDist * 0.9));
    ripple.style.width = `${baseSize}px`;
    ripple.style.height = `${baseSize}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => addRipple(btn, e.clientX, e.clientY));
    btn.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (t) addRipple(btn, t.clientX, t.clientY);
    }, { passive: true });
  });
})();

// React: Availability banner with dismiss persistence
(() => {
  const rootEl = document.getElementById('availability-root');
  if (!rootEl || !window.React || !window.ReactDOM) return;

  const STORAGE_KEY = 'availabilityBanner:dismissed';
  const LIKE_KEY = 'availabilityBanner:like:v1';
  const { useEffect, useState } = React;

  function Availability() {
    const [dismissed, setDismissed] = useState(localStorage.getItem(STORAGE_KEY) === '1');
    const [likeState, setLikeState] = useState(() => {
      try { return JSON.parse(localStorage.getItem(LIKE_KEY) || '{"liked":false,"count":0}'); } catch { return { liked: false, count: 0 }; }
    });

    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, dismissed ? '1' : '0');
    }, [dismissed]);

    useEffect(() => {
      localStorage.setItem(LIKE_KEY, JSON.stringify(likeState));
    }, [likeState]);

    const onLike = (e) => {
      setLikeState((prev) => {
        const next = { liked: !prev.liked, count: Math.max(0, (prev.count || 0) + (!prev.liked ? 1 : -1)) };
        // burst animation
        const btn = e.currentTarget;
        if (next.liked && btn) {
          const burstEl = document.createElement('span');
          burstEl.className = 'like-burst';
          btn.appendChild(burstEl);
          setTimeout(() => burstEl.remove(), 600);
        }
        return next;
      });
    };

    if (dismissed) return null;
    return React.createElement(
      'div',
      { className: 'availability-inner' },
      React.createElement('span', { className: 'availability-dot', 'aria-hidden': 'true' }),
      React.createElement('span', { className: 'availability-text' }, 'Available for new opportunity'),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'availability-like',
          'aria-pressed': likeState.liked ? 'true' : 'false',
          title: 'Like this announcement',
          onClick: onLike
        },
        React.createElement('span', { className: 'heart', 'aria-hidden': 'true' }, '❤'),
        ' ',
        React.createElement('span', { className: 'like-text' }, likeState.liked ? 'Liked' : 'Like'),
        React.createElement('span', { className: 'like-count', 'aria-label': 'Likes' }, String(likeState.count || 0))
      ),
      React.createElement('button', {
        className: 'availability-close',
        type: 'button',
        'aria-label': 'Dismiss availability banner',
        onClick: () => setDismissed(true)
      }, '✕')
    );
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(Availability));
})();

// Contact form submission with validation and AJAX to contact.php
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('contactStatus');
  const setStatus = (msg, isError = false, isSuccess = false) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = isError ? 'status error' : isSuccess ? 'status success' : 'status sending';
    statusEl.style.color = isError ? '#ff6b6b' : isSuccess ? '#2ee47a' : 'var(--accent)';
  };

  const fields = {
    fullName: form.querySelector('#fullName'),
    email: form.querySelector('#email'),
    phone: form.querySelector('#phone'),
    message: form.querySelector('#message')
  };

  function setFieldError(id, message) {
    const err = form.querySelector(`.error[data-for="${id}"]`);
    if (err) err.textContent = message || '';
  }

  function validate() {
    let ok = true;
    setFieldError('fullName');
    setFieldError('email');
    setFieldError('phone');
    setFieldError('message');

    if (!fields.fullName.value.trim()) { setFieldError('fullName', 'Please enter your name'); ok = false; }
    const emailVal = fields.email.value.trim();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setFieldError('email', 'Enter a valid email'); ok = false; }
    const phoneVal = fields.phone.value.trim();
    if (phoneVal && !/^[0-9+\-()\s]{7,}$/.test(phoneVal)) { setFieldError('phone', 'Enter a valid number'); ok = false; }
    if (!fields.message.value.trim()) { setFieldError('message', 'Please add a message'); ok = false; }
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('Sending...');
    try {
      // Prepare data for Spring Boot API
      const contactData = {
        name: fields.fullName.value.trim(),
        email: fields.email.value.trim(),
        contactNumber: fields.phone.value.trim(),
        message: fields.message.value.trim()
      };
      
      const res = await fetch('http://localhost:8080/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Contact submitted successfully:', result);
      setStatus('✅ Message sent successfully! I\'ll get back to you soon.', false, true);
      form.reset();
      
      // Clear any existing errors
      Object.keys(fields).forEach(field => {
        setFieldError(field, '');
      });
    } catch (err) {
      console.error('Error submitting contact:', err);
      setStatus(err.message || 'Something went wrong. Please try again.', true);
    }
  });
})();

// Interests chips feature removed per request