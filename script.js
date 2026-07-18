'use strict';

/* ==========================================================================
   DOM READY
   ========================================================================== */
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn, { once: true });
};

/* ==========================================================================
   SELECTORS
   ========================================================================== */
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* ==========================================================================
   PERFORMANCE HELPERS
   ========================================================================== */
const throttle = (fn, limit = 100) => {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => { waiting = false; }, limit);
  };
};

const debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ==========================================================================
   SCROLL HELPER
   ========================================================================== */
const onScroll = (fn, limit = 100) => {
  window.addEventListener('scroll', throttle(fn, limit), { passive: true });
};

/* ==========================================================================
   INTERSECTION OBSERVER / ANIMATION INITIALIZER
   ========================================================================== */
const initScrollReveal = (selector = '.reveal', options = { threshold: 0.15 }) => {
  const targets = qsa(selector);
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show content immediately rather than leaving it permanently
    // hidden (opacity: 0) on browsers without IntersectionObserver support.
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  targets.forEach((target) => observer.observe(target));
};

/* ==========================================================================
   BACK TO TOP
   ========================================================================== */
const initBackToTop = () => {
  const button = qs('#backToTop');
  if (!button) return;

  const SCROLL_THRESHOLD = 480;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > SCROLL_THRESHOLD);
  };

  updateVisibility();
  onScroll(updateVisibility, 150);

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
};

/* ==========================================================================
   FOOTER YEAR
   ========================================================================== */
const initFooterYear = () => {
  const yearEl = qs('#currentYear');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
};

/* ==========================================================================
   NAVBAR SCROLL STATE
   ========================================================================== */
const initNavbarScroll = () => {
  const navbar = qs('#navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 24;

  const updateState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateState();
  onScroll(updateState, 100);
};

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
const initMobileMenu = () => {
  const toggle = qs('#navToggle');
  const panel = qs('#navPanel');
  if (!toggle || !panel) return;

  const links = qsa('[data-nav-link]', panel);

  const openMenu = () => {
    panel.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    panel.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('no-scroll');
  };

  const isOpen = () => panel.classList.contains('is-open');

  toggle.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });

  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking the panel background itself (outside the menu's
  // interactive content), but not when clicking a link or the toggle.
  panel.addEventListener('click', (event) => {
    if (event.target === panel) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) closeMenu();
  });

  // If the viewport crosses back above the mobile breakpoint while the
  // panel is open (rotation, foldable, resize), drop the open/locked state
  // so the layout doesn't get stuck mid-transition on the desktop nav.
  const MOBILE_BREAKPOINT = 768;
  window.addEventListener(
    'resize',
    debounce(() => {
      if (isOpen() && window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
    }, 150),
    { passive: true }
  );
};

/* ==========================================================================
   ACTIVE NAV LINK
   ========================================================================== */
const initActiveNavLink = () => {
  const links = qsa('[data-nav-link]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
};

/* ==========================================================================
   WHATSAPP SMART ORDERING
   ========================================================================== */
const WHATSAPP_NUMBER = '923283470000';

const buildWhatsAppOrderUrl = (product) => {
  const message = [
    "Hi MDEE'S!",
    '',
    "I'd like to order:",
    '',
    `• ${product}`,
    '',
    'Please let me know the available sizes, prices and estimated delivery time.',
    '',
    'Thank you!',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Single delegated listener: works for every current and future
// [data-product] ordering button with no additional JS required.
const initWhatsAppOrdering = () => {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-product]');
    if (!trigger) return;

    const product = trigger.getAttribute('data-product').trim();
    if (!product) return;

    event.preventDefault();
    window.open(buildWhatsAppOrderUrl(product), '_blank', 'noopener');
  });
};

/* ==========================================================================
   INIT
   ========================================================================== */
onReady(() => {
  initScrollReveal();
  initBackToTop();
  initNavbarScroll();
  initMobileMenu();
  initActiveNavLink();
  initFooterYear();
  initWhatsAppOrdering();
});
