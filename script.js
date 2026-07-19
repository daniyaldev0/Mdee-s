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
   INTERACTIVE MENU (category grid <-> category detail)
   ========================================================================== */
const initInteractiveMenu = () => {
  const menuSection = qs('#menu');
  const selectView = qs('#menuSelect');
  const detailView = qs('#menuDetail');
  const backBtn = qs('#menuBackBtn');
  if (!menuSection || !selectView || !detailView) return;

  const selectCards = qsa('[data-menu-target]', selectView);
  const categories = qsa('[data-menu-section]', detailView);
  if (!selectCards.length || !categories.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToMenuTop = () => {
    const top = menuSection.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const showCategory = (id, { scroll = true } = {}) => {
    const target = categories.find((section) => section.id === id);
    if (!target) return false;

    categories.forEach((section) => section.classList.toggle('is-active', section === target));

    selectView.hidden = true;
    detailView.hidden = false;

    // Keep the URL shareable/deep-linkable without adding a history entry
    // for every category switch.
    if (history.replaceState) history.replaceState(null, '', `#${id}`);

    if (scroll) scrollToMenuTop();
    return true;
  };

  const showGrid = () => {
    detailView.hidden = true;
    selectView.hidden = false;
    categories.forEach((section) => section.classList.remove('is-active'));
    if (history.replaceState) history.replaceState(null, '', '#menu');
    scrollToMenuTop();
  };

  selectCards.forEach((card) => {
    card.addEventListener('click', () => showCategory(card.dataset.menuTarget));
  });

  if (backBtn) backBtn.addEventListener('click', showGrid);

  // Any link elsewhere on the site (e.g. the homepage "Featured Categories"
  // teaser cards) that points at a specific category should open that
  // category's detail view directly, since categories are hidden until
  // selected.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#menu-"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (showCategory(id)) event.preventDefault();
  });

  // Support arriving directly via a #menu-xxx URL (shared link, browser
  // back/forward, or a fresh page load with that hash already in place).
  const openFromHash = () => {
    const id = window.location.hash.slice(1);
    if (id) showCategory(id, { scroll: false });
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
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
   SHOPPING CART — STATE & PERSISTENCE
   ========================================================================== */
const CART_STORAGE_KEY = 'mdees:cart';
let cartItems = [];

const parsePrice = (text = '') => {
  const digits = text.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

const formatPrice = (amount) => `Rs. ${amount.toLocaleString('en-PK')}`;

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const saveCart = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (err) {
    // Storage unavailable (private browsing, quota exceeded, etc.) — the
    // cart still works for the current page view, it just won't persist.
  }
};

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cartItems = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    cartItems = [];
  }
};

const findCartItem = (id) => cartItems.find((item) => item.id === id);

const cartItemCount = () => cartItems.reduce((sum, item) => sum + item.qty, 0);

const calculateTotal = () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

/* ==========================================================================
   SHOPPING CART — MUTATIONS
   ========================================================================== */
const addToCart = ({ id, name, category, size, unitPrice }) => {
  const existing = findCartItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ id, name, category, size, unitPrice, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartBadge();
};

const updateQuantity = (id, delta) => {
  const item = findCartItem(id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart({ bumpId: id });
  updateCartBadge();
};

const removeFromCart = (id) => {
  cartItems = cartItems.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  updateCartBadge();
};

/* ==========================================================================
   SHOPPING CART — RENDERING
   ========================================================================== */
const renderCartItem = (item) => `
  <div class="cart-item" data-cart-id="${item.id}">
    <div class="cart-item__info">
      <p class="cart-item__name">${item.name}</p>
      ${item.size ? `<p class="cart-item__size">${item.size}</p>` : ''}
      <p class="cart-item__unit-price">${formatPrice(item.unitPrice)} each</p>
    </div>
    <div class="cart-item__controls">
      <div class="cart-item__stepper">
        <button type="button" class="cart-item__stepper-btn" data-cart-action="decrease" aria-label="Decrease quantity of ${item.name}">−</button>
        <span class="cart-item__qty">${item.qty}</span>
        <button type="button" class="cart-item__stepper-btn" data-cart-action="increase" aria-label="Increase quantity of ${item.name}">+</button>
      </div>
      <span class="cart-item__subtotal">${formatPrice(item.unitPrice * item.qty)}</span>
      <button type="button" class="cart-item__remove" data-cart-action="remove" aria-label="Remove ${item.name} from cart">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6m2 0-.7 13a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 6"/></svg>
      </button>
    </div>
  </div>
`;

const renderCart = ({ bumpId } = {}) => {
  const body = qs('#cartBody');
  const summary = qs('#cartSummary');
  if (!body) return;

  if (!cartItems.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <p class="cart-empty__title">Your cart is empty.</p>
        <p class="cart-empty__text">Browse our menu to get started.</p>
        <button type="button" class="btn btn-primary" id="cartContinueBtn">Continue Browsing</button>
      </div>
    `;
    if (summary) summary.hidden = true;
    return;
  }

  body.innerHTML = cartItems.map(renderCartItem).join('');

  if (summary) {
    summary.hidden = false;
    const total = calculateTotal();
    qs('#cartSubtotal').textContent = formatPrice(total);
    qs('#cartTotal').textContent = formatPrice(total);
  }

  if (bumpId) {
    const qtyEl = qs(`.cart-item[data-cart-id="${bumpId}"] .cart-item__qty`);
    if (qtyEl) qtyEl.classList.add('is-updated');
  }
};

const updateCartBadge = () => {
  const badge = qs('#cartBadge');
  const toggleBtn = qs('#cartToggle');
  if (!badge || !toggleBtn) return;

  const count = cartItemCount();
  badge.textContent = count;
  badge.hidden = count === 0;
  toggleBtn.setAttribute(
    'aria-label',
    count ? `Open cart, ${count} item${count === 1 ? '' : 's'}` : 'Open cart, empty'
  );

  if (count > 0) {
    badge.classList.remove('is-bumping');
    void badge.offsetWidth; // restart the animation on every change
    badge.classList.add('is-bumping');
  }
};

/* ==========================================================================
   SHOPPING CART — ADD-TO-CART BUTTON FEEDBACK
   ========================================================================== */
const CHECK_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';

const showAddedFeedback = (button, { iconOnly = false } = {}) => {
  if (button.dataset.feedbackActive) return;
  button.dataset.feedbackActive = 'true';

  const originalContent = button.innerHTML;
  button.classList.add('is-added');
  button.innerHTML = iconOnly ? CHECK_ICON : 'Added ✓';

  setTimeout(() => {
    button.innerHTML = originalContent;
    button.classList.remove('is-added');
    delete button.dataset.feedbackActive;
  }, 900);
};

/* ==========================================================================
   SHOPPING CART — WIRING PRODUCT CARDS (menu + deals)
   ========================================================================== */
const initMenuCartActions = () => {
  document.addEventListener('click', (event) => {
    // Sized items: pizzas, cold drinks, water — each size row already has
    // its own dedicated order button, so clicking it both selects the size
    // and adds that exact size to the cart.
    const sizedBtn = event.target.closest('.menu-item__order');
    if (sizedBtn) {
      const article = sizedBtn.closest('.menu-item');
      const row = sizedBtn.closest('.menu-item__size-row');
      const section = sizedBtn.closest('[data-menu-section]');
      if (!article || !row || !section) return;

      const name = qs('.menu-item__title', article)?.textContent.trim() || 'Item';
      const size = qs('.menu-item__size-label', row)?.textContent.trim() || '';
      const unitPrice = parsePrice(qs('.menu-item__size-price', row)?.textContent);
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const id = slugify(`${section.id}-${name}-${size}`);

      addToCart({ id, name, category, size, unitPrice });
      showAddedFeedback(sizedBtn, { iconOnly: true });
      return;
    }

    // Simple single-price items (burgers, shawarma, sandwiches, pasta, etc.)
    const simpleBtn = event.target.closest('.menu-item__order-btn');
    if (simpleBtn) {
      const article = simpleBtn.closest('.menu-item');
      const section = simpleBtn.closest('[data-menu-section]');
      if (!article || !section) return;

      const name = qs('.menu-item__title', article)?.textContent.trim() || 'Item';
      const unitPrice = parsePrice(qs('.menu-item__price', article)?.textContent);
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const id = slugify(`${section.id}-${name}`);

      addToCart({ id, name, category, size: null, unitPrice });
      showAddedFeedback(simpleBtn);
      return;
    }

    // Deals listed inside the Interactive Menu's own "Deals" category.
    // (The separate homepage #deals section still orders via WhatsApp
    // directly and is intentionally left untouched.)
    const dealBtn = event.target.closest('#menu-deals .deal-card__footer button');
    if (dealBtn) {
      const article = dealBtn.closest('.deal-card');
      const section = dealBtn.closest('[data-menu-section]');
      if (!article || !section) return;

      const name = qs('.menu-deal-card__title', article)?.textContent.trim() || 'Deal';
      const unitPrice = parsePrice(qs('.deal-card__price', article)?.textContent);
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const id = slugify(`${section.id}-${name}`);

      addToCart({ id, name, category, size: null, unitPrice });
      showAddedFeedback(dealBtn);
    }
  });
};

/* ==========================================================================
   SHOPPING CART — PANEL OPEN/CLOSE + ITEM CONTROLS
   ========================================================================== */
const initCartPanel = () => {
  const panel = qs('#cartPanel');
  const overlay = qs('#cartOverlay');
  const toggleBtn = qs('#cartToggle');
  const closeBtn = qs('#cartCloseBtn');
  if (!panel || !overlay || !toggleBtn) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isOpen = () => panel.classList.contains('is-open');

  const openCart = () => {
    overlay.hidden = false;
    // Force layout so the opacity transition on the overlay actually runs.
    void overlay.offsetWidth;
    panel.classList.add('is-open');
    overlay.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    (closeBtn || panel).focus({ preventScroll: true });
  };

  const closeCart = () => {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    toggleBtn.focus({ preventScroll: true });
    setTimeout(() => { if (!isOpen()) overlay.hidden = true; }, prefersReducedMotion ? 0 : 500);
  };

  toggleBtn.addEventListener('click', () => (isOpen() ? closeCart() : openCart()));
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) closeCart();
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('#cartContinueBtn')) {
      closeCart();
      return;
    }

    const actionBtn = event.target.closest('[data-cart-action]');
    if (!actionBtn) return;

    const row = actionBtn.closest('[data-cart-id]');
    if (!row) return;

    const id = row.dataset.cartId;
    const action = actionBtn.dataset.cartAction;

    if (action === 'increase') updateQuantity(id, 1);
    else if (action === 'decrease') updateQuantity(id, -1);
    else if (action === 'remove') {
      row.classList.add('is-removing');
      setTimeout(() => removeFromCart(id), prefersReducedMotion ? 0 : 220);
    }
  });
};

/* ==========================================================================
   SHOPPING CART — TOAST (lightweight status message, e.g. empty-cart notice)
   ========================================================================== */
let cartToastTimer;

const showCartToast = (message) => {
  const toast = qs('#cartToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(cartToastTimer);
  cartToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
};

/* ==========================================================================
   SHOPPING CART — WHATSAPP CHECKOUT
   ========================================================================== */
const WHATSAPP_ORDER_DIVIDER = '━━━━━━━━━━━━━━';

// Builds the full order message from the current cart. Kept separate from
// the URL/open logic so it can be reused (tests, future "copy order" button,
// etc.) without triggering a WhatsApp redirect as a side effect.
const generateWhatsAppMessage = () => {
  const subtotal = calculateTotal();

  const itemLines = cartItems.flatMap((item) => {
    const itemTotal = formatPrice(item.unitPrice * item.qty);
    const nameLine = item.size ? `• ${item.name} (${item.size})` : `• ${item.name}`;
    return [nameLine, `   Qty: ${item.qty}  •  Item Total: ${itemTotal}`, ''];
  });

  return [
    "Hi MDEE'S,",
    '',
    "I'd like to place the following order.",
    '',
    WHATSAPP_ORDER_DIVIDER,
    '',
    ...itemLines,
    WHATSAPP_ORDER_DIVIDER,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    'Delivery: To be confirmed',
    `Total: ${formatPrice(subtotal)}`,
    '',
    WHATSAPP_ORDER_DIVIDER,
    '',
    'Name:',
    'Phone:',
    'Delivery Address:',
    'Additional Notes:',
    '',
    'Thank you.',
  ].join('\n');
};

const buildWhatsAppCheckoutUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Cart is intentionally left untouched here — per spec, order data stays in
// localStorage so the customer can return and keep editing.
const openWhatsAppCheckout = () => {
  if (!cartItems.length) {
    showCartToast('Your cart is empty.');
    return;
  }

  const message = generateWhatsAppMessage();
  window.open(buildWhatsAppCheckoutUrl(message), '_blank', 'noopener');
};

const initCartCheckout = () => {
  const checkoutBtn = qs('#cartCheckoutBtn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', openWhatsAppCheckout);
};

/* ==========================================================================
   SHOPPING CART — INIT
   ========================================================================== */
const initCart = () => {
  loadCart();
  renderCart();
  updateCartBadge();
  initMenuCartActions();
  initCartPanel();
  initCartCheckout();
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
  initInteractiveMenu();
  initFooterYear();
  initWhatsAppOrdering();
  initCart();
});
