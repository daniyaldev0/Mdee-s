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
   FOCUS TRAP (shared by the cart panel and Quick View modal)
   ========================================================================== */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps Tab/Shift+Tab cycling inside `container` while it's open, instead of
// leaking focus out to the page underneath. Call from a keydown listener
// that's already scoped to "only while this panel is open".
const trapFocus = (container, event) => {
  if (event.key !== 'Tab') return;

  const focusable = qsa(FOCUSABLE_SELECTOR, container).filter(
    (el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
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
   MENU SEARCH & SMART FILTERING (v1.8)
   ========================================================================== */
const escapeHtml = (text = '') =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeRegExp = (text = '') => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const initMenuSearch = () => {
  const input = qs('#menuSearchInput');
  const clearBtn = qs('#menuSearchClear');
  const searchBar = qs('#menuSearch');
  const selectView = qs('#menuSelect');
  const detailView = qs('#menuDetail');
  const noResultsEl = qs('#menuNoResults');
  if (!input || !clearBtn || !searchBar || !selectView || !detailView) return;

  // Snapshot which view (category grid, or a specific open category) was
  // showing before a search started, so clearing the search can restore it
  // without disturbing scroll position or the user's prior browsing state.
  let preSearchView = null; // { grid: true } | { categoryId: string }
  let isSearching = false;

  // Build the search index once. Every menu item and deal card in the
  // Interactive Menu is indexed by name, category, and description — the
  // underlying DOM nodes are reused (never cloned/recreated) so existing
  // Add to Cart / Quick View wiring keeps working untouched.
  const sections = qsa('[data-menu-section]', detailView);
  const index = sections.map((section) => {
    const categoryName = qs('.menu-category__title', section)?.textContent.trim() || '';
    const items = qsa('.menu-item, .deal-card', section).map((article) => {
      const titleEl = qs('.menu-item__title, .menu-deal-card__title', article);
      const descEl = qs('.menu-item__desc, .deal-card__desc', article);
      const name = titleEl?.textContent.trim() || '';
      const desc = descEl?.textContent.trim() || '';
      return {
        article,
        titleEl,
        name,
        haystack: `${name} ${categoryName} ${desc}`.toLowerCase(),
      };
    });
    return { section, categoryName, items };
  });

  const clearHighlight = () => {
    index.forEach(({ items }) => {
      items.forEach(({ titleEl, name }) => {
        if (titleEl) titleEl.textContent = name;
      });
    });
  };

  const applyHighlight = (item, query) => {
    if (!item.titleEl) return;
    if (!query || !item.name.toLowerCase().includes(query)) {
      item.titleEl.textContent = item.name;
      return;
    }
    const re = new RegExp(`(${escapeRegExp(query)})`, 'ig');
    item.titleEl.innerHTML = escapeHtml(item.name).replace(re, '<mark class="menu-search__mark">$1</mark>');
  };

  const enterSearchMode = () => {
    if (isSearching) return;
    isSearching = true;
    preSearchView = detailView.hidden
      ? { grid: true }
      : { categoryId: sections.find((s) => s.classList.contains('is-active'))?.id || null };

    selectView.hidden = true;
    detailView.hidden = false;
    detailView.classList.add('is-search-active');
  };

  const exitSearchMode = () => {
    if (!isSearching) return;
    isSearching = false;

    detailView.classList.remove('is-search-active');
    index.forEach(({ section, items }) => {
      section.classList.remove('is-search-match');
      items.forEach(({ article }) => article.classList.remove('is-search-hidden'));
    });
    clearHighlight();
    if (noResultsEl) noResultsEl.hidden = true;

    if (preSearchView && preSearchView.categoryId) {
      // A specific category was open before searching — nothing else to do,
      // its .is-active class was never touched.
      detailView.hidden = false;
      selectView.hidden = true;
    } else {
      detailView.hidden = true;
      selectView.hidden = false;
    }
    preSearchView = null;
  };

  const runSearch = (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();

    if (!query) {
      exitSearchMode();
      return;
    }

    enterSearchMode();

    let anyMatch = false;
    index.forEach(({ section, items }) => {
      let sectionHasMatch = false;
      items.forEach((item) => {
        const isMatch = item.haystack.includes(query);
        item.article.classList.toggle('is-search-hidden', !isMatch);
        applyHighlight(item, isMatch ? query : '');
        if (isMatch) sectionHasMatch = true;
      });
      section.classList.toggle('is-search-match', sectionHasMatch);
      if (sectionHasMatch) anyMatch = true;
    });

    if (noResultsEl) noResultsEl.hidden = anyMatch;
  };

  const handleInput = debounce(() => {
    clearBtn.hidden = input.value.length === 0;
    runSearch(input.value);
  }, 120);

  const clearSearch = () => {
    input.value = '';
    clearBtn.hidden = true;
    runSearch('');
  };

  input.addEventListener('input', handleInput);
  clearBtn.addEventListener('click', () => {
    clearSearch();
    input.focus();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      clearSearch();
    }
  });

  // Ctrl+K / Cmd+K focuses the search field from anywhere on desktop.
  document.addEventListener('keydown', (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (!isShortcut) return;
    event.preventDefault();
    input.focus();
    input.select();
  });
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
const addToCart = ({ id, name, category, size, unitPrice, qty = 1 }) => {
  const existing = findCartItem(id);
  if (existing) {
    existing.qty += qty;
  } else {
    cartItems.push({ id, name, category, size, unitPrice, qty });
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
   SHOPPING CART — WIRING PRODUCT CARDS (menu + deals)
   ========================================================================== */
const initMenuCartActions = () => {
  document.addEventListener('click', (event) => {
    // Sized items: pizzas, cold drinks, water — each size row has its own
    // order button. Clicking any of them opens Quick View for the whole
    // product with all its sizes on offer, pre-selecting the size that was
    // actually clicked.
    const sizedBtn = event.target.closest('.menu-item__order');
    if (sizedBtn) {
      const article = sizedBtn.closest('.menu-item');
      const clickedRow = sizedBtn.closest('.menu-item__size-row');
      const section = sizedBtn.closest('[data-menu-section]');
      if (!article || !clickedRow || !section) return;

      const name = qs('.menu-item__title', article)?.textContent.trim() || 'Item';
      const desc = qs('.menu-item__desc', article)?.textContent.trim() || '';
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const clickedSize = qs('.menu-item__size-label', clickedRow)?.textContent.trim() || '';

      const sizes = qsa('.menu-item__size-row', article).map((row) => {
        const label = qs('.menu-item__size-label', row)?.textContent.trim() || '';
        return {
          label,
          unitPrice: parsePrice(qs('.menu-item__size-price', row)?.textContent),
          id: slugify(`${section.id}-${name}-${label}`),
        };
      });

      openQuickView({
        type: 'sized',
        name,
        desc,
        category,
        sizes,
        selectedLabel: clickedSize,
        triggerEl: sizedBtn,
      });
      return;
    }

    // Simple single-price items (burgers, shawarma, sandwiches, pasta, etc.)
    const simpleBtn = event.target.closest('.menu-item__order-btn');
    if (simpleBtn) {
      const article = simpleBtn.closest('.menu-item');
      const section = simpleBtn.closest('[data-menu-section]');
      if (!article || !section) return;

      const name = qs('.menu-item__title', article)?.textContent.trim() || 'Item';
      const desc = qs('.menu-item__desc', article)?.textContent.trim() || '';
      const unitPrice = parsePrice(qs('.menu-item__price', article)?.textContent);
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const id = slugify(`${section.id}-${name}`);

      openQuickView({ type: 'simple', id, name, desc, category, unitPrice, triggerEl: simpleBtn });
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
      const desc = qs('.deal-card__desc', article)?.textContent.trim() || '';
      const unitPrice = parsePrice(qs('.deal-card__price', article)?.textContent);
      const category = qs('.menu-category__title', section)?.textContent.trim() || '';
      const id = slugify(`${section.id}-${name}`);

      openQuickView({ type: 'simple', id, name, desc, category, unitPrice, triggerEl: dealBtn });
    }
  });
};

/* ==========================================================================
   PRODUCT QUICK VIEW — STATE
   ========================================================================== */
let qvProduct = null; // currently open product config (see openQuickView)
let qvSelectedSizeIndex = null;
let qvQty = 1;
let qvTriggerEl = null;

// Looked up once (script.js runs with `defer`, so the DOM is already parsed)
// instead of re-querying the same elements on every render/open/close call.
const qvEls = {
  overlay: qs('#quickViewOverlay'),
  panel: qs('#quickViewPanel'),
  closeBtn: qs('#quickViewCloseBtn'),
  category: qs('#qvCategory'),
  title: qs('#qvTitle'),
  desc: qs('#qvDesc'),
  sizesWrap: qs('#qvSizes'),
  sizeOptions: qs('#qvSizeOptions'),
  sizeHint: qs('#qvSizeHint'),
  qty: qs('#qvQty'),
  subtotal: qs('#qvSubtotal'),
  addBtn: qs('#qvAddBtn'),
};

const qvUnitPrice = () => {
  if (!qvProduct) return 0;
  if (qvProduct.type === 'sized') {
    return qvSelectedSizeIndex === null ? 0 : qvProduct.sizes[qvSelectedSizeIndex].unitPrice;
  }
  return qvProduct.unitPrice;
};

const qvIsReady = () => qvProduct && (qvProduct.type === 'simple' || qvSelectedSizeIndex !== null);

/* ==========================================================================
   PRODUCT QUICK VIEW — RENDER
   ========================================================================== */
const renderQuickView = () => {
  if (!qvProduct) return;

  qvEls.category.textContent = qvProduct.category || '';
  qvEls.category.hidden = !qvProduct.category;
  qvEls.title.textContent = qvProduct.name;

  qvEls.desc.textContent = qvProduct.desc || '';
  qvEls.desc.hidden = !qvProduct.desc;

  if (qvProduct.type === 'sized') {
    qvEls.sizesWrap.hidden = false;
    qvEls.sizeOptions.innerHTML = qvProduct.sizes
      .map((size, index) => `
        <button
          type="button"
          class="quickview-size-btn${index === qvSelectedSizeIndex ? ' is-selected' : ''}"
          data-size-index="${index}"
          aria-pressed="${index === qvSelectedSizeIndex}"
        >
          ${size.label}
          <span class="quickview-size-btn__price">${formatPrice(size.unitPrice)}</span>
        </button>
      `)
      .join('');
    qvEls.sizeHint.hidden = qvSelectedSizeIndex !== null;
  } else {
    qvEls.sizesWrap.hidden = true;
  }

  qvEls.qty.textContent = qvQty;
  qvEls.subtotal.textContent = formatPrice(qvUnitPrice() * qvQty);
  qvEls.addBtn.disabled = !qvIsReady();
};

/* ==========================================================================
   PRODUCT QUICK VIEW — OPEN/CLOSE
   ========================================================================== */
const quickViewIsOpen = () => qvEls.panel?.classList.contains('is-open') || false;

const openQuickView = (product) => {
  const { overlay, panel, closeBtn } = qvEls;
  if (!overlay || !panel || !closeBtn) return;

  qvProduct = product;
  qvTriggerEl = product.triggerEl || null;
  qvQty = 1;
  qvSelectedSizeIndex =
    product.type === 'sized'
      ? Math.max(0, product.sizes.findIndex((size) => size.label === product.selectedLabel))
      : null;

  renderQuickView();

  overlay.hidden = false;
  void overlay.offsetWidth;
  panel.classList.add('is-open');
  overlay.classList.add('is-visible');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  closeBtn.focus({ preventScroll: true });
};

const closeQuickView = () => {
  const { overlay, panel } = qvEls;
  if (!overlay || !panel) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  panel.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (qvTriggerEl) qvTriggerEl.focus({ preventScroll: true });
  setTimeout(() => { if (!quickViewIsOpen()) overlay.hidden = true; }, prefersReducedMotion ? 0 : 500);
  qvProduct = null;
  qvTriggerEl = null;
};

const initQuickView = () => {
  const { overlay, panel, closeBtn } = qvEls;
  if (!overlay || !panel || !closeBtn) return;

  closeBtn.addEventListener('click', closeQuickView);
  overlay.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', (event) => {
    if (!quickViewIsOpen()) return;
    if (event.key === 'Escape') closeQuickView();
    else trapFocus(panel, event);
  });

  panel.addEventListener('click', (event) => {
    const sizeBtn = event.target.closest('.quickview-size-btn');
    if (sizeBtn) {
      qvSelectedSizeIndex = Number(sizeBtn.dataset.sizeIndex);
      renderQuickView();
      return;
    }

    if (event.target.closest('#qvQtyIncrease')) {
      qvQty += 1;
      renderQuickView();
      return;
    }

    if (event.target.closest('#qvQtyDecrease')) {
      qvQty = Math.max(1, qvQty - 1);
      renderQuickView();
      return;
    }

    if (event.target.closest('#qvAddBtn')) {
      if (!qvIsReady()) return;

      if (qvProduct.type === 'sized') {
        const size = qvProduct.sizes[qvSelectedSizeIndex];
        addToCart({
          id: size.id,
          name: qvProduct.name,
          category: qvProduct.category,
          size: size.label,
          unitPrice: size.unitPrice,
          qty: qvQty,
        });
      } else {
        addToCart({
          id: qvProduct.id,
          name: qvProduct.name,
          category: qvProduct.category,
          size: null,
          unitPrice: qvProduct.unitPrice,
          qty: qvQty,
        });
      }

      closeQuickView();
      showCartToast('Added to cart');
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
    if (!isOpen()) return;
    if (event.key === 'Escape') closeCart();
    else trapFocus(panel, event);
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
  initQuickView();
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
  initMenuSearch();
  initFooterYear();
  initWhatsAppOrdering();
  initCart();
});
