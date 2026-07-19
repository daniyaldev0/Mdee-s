# PROJECT_CONTEXT.md
# MDEE'S Website

## Business

Name: MDEE'S

Tagline: Say Yes to Pizza

Type: Fast Food Restaurant

Location: Marghzar, Lahore, Pakistan

Hours: 3:30 PM – 3:30 AM

Instagram: @mdees_lhr

Ordering:
- Phone
- WhatsApp
- Foodpanda

Primary Goal:
Increase online orders while presenting MDEE'S as a premium modern fast-food brand.

---

## Brand

Style

- Bright
- Modern
- Energetic
- Premium
- Family Friendly
- Fast
- Clean

Avoid

- Generic templates
- Bootstrap look
- AI-generated appearance
- Overly flashy animations

The website should feel handcrafted and professionally designed.

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

No

- React
- Vue
- Angular
- Bootstrap
- Tailwind
- jQuery

---

## Engineering Rules

- Reuse existing components.
- Preserve completed work.
- Write semantic HTML.
- Keep CSS modular.
- Keep JavaScript modular.
- Use reusable functions.
- Mobile-first responsive design.
- Optimize performance.
- Avoid duplicate code.
- Maintain accessibility.

---

## Current Progress

Completed

✓ Foundation

✓ Navigation

✓ Hero

✓ Featured Categories

✓ Signature Menu Preview

✓ Why Choose Us

✓ About

✓ Location & Contact

✓ Google Maps

✓ Footer

✓ Mobile Optimization

✓ Brand Refresh

✓ Interactive Menu (v1.4) — category grid → category detail view, replaces long scrolling menu; per-item ordering now uses "Add to Cart" buttons (no functionality yet, pending Shopping Cart build)

✓ Shopping Cart (v1.5) — Add to Cart wired up, cart panel with quantity controls, localStorage persistence

✓ WhatsApp Checkout (v1.6) — "Continue to WhatsApp" button in cart summary; generates one formatted order message (items, sizes, quantities, item totals, subtotal, total) and opens wa.me with it URL-encoded; cart is preserved after checkout; empty-cart click shows a toast instead of opening WhatsApp

✓ Product Quick View (v1.7) — clicking any "Add to Cart" trigger (pizza size row, simple item, or deal) opens a Quick View panel (centered modal on desktop, bottom sheet on mobile) instead of adding immediately; shows product image placeholder, name, description, category, and price; pizzas require a size selection (Small/Medium/Large, pre-filled from the size row clicked, price updates live) before the item can be added; quantity stepper with live subtotal; confirming adds the configured item to the existing cart, closes the panel, shows an "Added to cart" toast, and updates the cart badge; closes via close button, outside click, or Esc

✓ Menu Search & Smart Filtering (v1.8) — search bar above the category grid in the Interactive Menu (full-width on desktop, sticky on mobile while browsing); filters instantly while typing (debounced, no page reload) against product name, category, and description, case-insensitive; matching results stay in their existing category groupings with the category name shown above each group, non-matching items and empty categories are hidden; matching text is highlighted inline in product names; "No matching menu items found." message when nothing matches; clear (×) button restores whichever view (category grid, or the specific category that was open) was showing before the search started; Ctrl+K / Cmd+K focuses the search field from anywhere, Esc clears an active query; reuses the existing product card DOM and Add to Cart / Quick View wiring untouched — no new markup was generated for results

✓ Production Optimization (v2.0) — see summary below

Current Version

v2.0 — Production Optimization (complete)

Next Task

Build ONLY the requested version.

Never regenerate completed sections.

Modify only the required files.

Update this file after each completed version.

---

## Quality Standard

The final website should look comparable to work from premium agencies.

Think

- Apple
- Stripe
- Framer
- Awwwards
- Foodpanda

Prioritize

- Excellent spacing
- Strong typography
- Smooth interactions
- Responsive layouts
- Accessibility
- Performance

Every design decision should feel intentional.

---

## Claude Workflow

Before coding

1. Read this file.
2. Continue from the existing project.
3. Build ONLY the requested version.
4. Preserve completed work.
5. Update the Current Progress section after finishing.
## Project Principles

- Preserve existing code.
- Never regenerate completed sections.
- Modify only the requested feature.
- Reuse existing CSS and JavaScript.
- Keep the code modular and maintainable.
- Do not change branding unless requested.

---

## Current Architecture

Files

- index.html
- style.css
- script.js
- robots.txt (v2.0)
- sitemap.xml (v2.0)
- site.webmanifest (v2.0)

The website is a single-page application.

Use vanilla JavaScript.

Avoid creating additional HTML pages unless explicitly requested.

---

## Current Features

- Responsive navigation
- Hero section
- Featured categories
- Interactive menu (category grid → category detail, "Add to Cart" buttons)
- About section
- Why Choose Us
- Location & Google Maps
- Footer
- Mobile optimization
- Brand refresh
- WhatsApp integration (contact/footer/deals CTAs)
- Shopping cart (add/update/remove, localStorage persistence)
- WhatsApp checkout (cart → formatted wa.me order message)
- Product Quick View (size selection for pizzas, quantity stepper, live subtotal, modal/bottom-sheet panel)
- Menu search & smart filtering (live filter by name/category/description, highlighted matches, Ctrl+K shortcut, sticky on mobile)
- robots.txt + sitemap.xml + site.webmanifest for production SEO

Upcoming

- Real production domain to replace the https://mdees.pk/ placeholder used in canonical/OG/JSON-LD/robots/sitemap
- Real og-image.jpg, favicon set, and logo.png assets (currently referenced but not part of this codebase)
- Full street address once provided (footer currently shows city/region only)
- Real Foodpanda restaurant URL (footer currently uses a placeholder)

---

## v2.0 — Production Optimization Summary

**Bug fixed:** The v1.8 Menu Search markup was missing from index.html — script.js and style.css both fully implemented the feature, but no `#menuSearchInput` / `#menuSearchClear` / `#menuNoResults` elements existed in the page, so it was silently non-functional. Added the missing markup (search field, clear button, hint, no-results message) matching the existing CSS/JS contracts exactly. No new visual design was introduced — it reuses the already-built `.menu-search` styles.

**SEO**
- Meta tags, Open Graph, Twitter Card, canonical, robots meta, and Organization/Restaurant/LocalBusiness JSON-LD were already in place from earlier versions — verified correct, left untouched
- Added `robots.txt` (references sitemap)
- Added `sitemap.xml`
- Added `site.webmanifest` (was linked in `<head>` but the file didn't exist)

**Accessibility**
- Audited color contrast across all text/background pairs in use — all pass WCAG AA (lowest was muted text at 4.59:1)
- Confirmed alt text present on all 13 images, correct heading hierarchy (h1 → h2 → h3 → h4), and `:focus-visible` states already implemented site-wide
- Added a proper `<label>` (visually hidden) for the new search input

**Performance / Code quality**
- Cached the Product Quick View panel's DOM references once instead of re-querying them on every render (size select, qty +/-) — same behavior, fewer DOM lookups
- Removed one unused CSS rule (`.btn-loading`, not referenced anywhere)
- Noted (not removed): ~20 additional CSS utility/variant classes with no current usage (`btn-ghost`, `btn-secondary`, `fade-left/right/down`, `pulse`, `scale-in`, `zoom-in`, `flex`, `gap-*`, `text-*`, `aspect-*`, `is-added`). These look like intentional design-system scaffolding rather than dead code from a refactor — flagging for your call rather than deleting, since removing them is irreversible and they may be intended for future versions.

**Files modified:** index.html, style.css, script.js
**Files added:** robots.txt, sitemap.xml, site.webmanifest