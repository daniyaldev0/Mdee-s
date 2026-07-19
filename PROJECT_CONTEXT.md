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

✓ Hero Redesign (v2.1) — see summary below

✓ Hero Layout Fix (v2.2) — see summary below

Current Version

v2.2 — Hero Layout Fix (complete)

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
- Hero section — layered multi-product photo composition, WhatsApp-first CTA, trust-indicator bar
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

---

## v2.1 — Hero Redesign Summary

**Scope:** hero section only (`#hero`), per hero.md. No other sections, no JS, touched.

**Content**
- New headline: "Lahore's Favorite Late-Night Pizza." (was "Handmade Dough, Bold Flavor, Made To Order.")
- New supporting paragraph — trimmed to lead with the product range and close with the 3:30 PM–3:30 AM hours
- Primary CTA changed from "Order Now" (→ `#contact`) to "Order on WhatsApp" (→ `https://wa.me/923283470000` directly, matching the WhatsApp number already used site-wide), with an inline WhatsApp glyph reusing the existing icon system (24x24 viewBox, stroke-width 1.75, currentColor)
- Secondary CTA renamed "Explore Menu" → "Browse Menu" (target unchanged, `#menu`)
- Added a new trust-indicator bar below the CTAs: Fresh Ingredients, Open 3:30 PM – 3:30 AM, Foodpanda Available, Fast Delivery — each with a small stroke icon (clock and lightning-bolt icons reused verbatim from the Contact and Why-Choose-Us sections for visual consistency; leaf and delivery-bag icons are new but match the same icon spec)

**Visual**
- Replaced the single CSS-drawn pizza (`.pizza`/`.pizza__crust`/`.pizza__cheese`/`.pizza__pepperoni`) with a real, layered product composition: a large central photo (`assets/categories/pizza.jpg`) plus four smaller orbiting photos (burgers, shawarma, wings, pasta) — reuses the category images already live on the site rather than introducing new assets
- Removed the three floating info chips (Fresh Ingredients / Fast Delivery / Open Till 3:30 AM) from the visual since that information now lives in the new trust bar; kept the ★ 4.8 rating chip as the one non-duplicated accent on the visual
- Logo badge position/behavior unchanged (still supports the composition, doesn't dominate it)
- All composition pieces use the existing `.floating` utility and `--float-y` custom property with staggered `animation-delay`s, consistent with the site's existing motion language — no new animations introduced

**Performance**
- Main hero photo has `fetchpriority="high"` + a `<link rel="preload" as="image">` in `<head>`, since it's now the page's largest above-the-fold image and likely LCP element
- All hero images ship explicit `width`/`height` to prevent layout shift; none are `loading="lazy"` since the whole hero is above the fold

**Layout**
- Desktop: unchanged two-column grid (text left, visual right)
- Mobile: content now renders before the visual (headline → text → CTAs → trust bar → image) — previously the visual was reordered to appear first; that `order: -1` rule was removed to match the new spec

**Files modified:** index.html, style.css
**Files unchanged:** script.js (hero has no JS dependency), robots.txt, sitemap.xml, site.webmanifest

---

## v2.2 — Hero Layout Fix Summary

**Bug fixed:** the logo badge was absolutely positioned inside `.hero__visual`, overlapping the food photo composition at several breakpoints.

**Fix:** moved the logo out of the visual/food column entirely and into `.hero__content` (the text column), as the first element, above the "Say Yes to Pizza" tagline badge. Since it now lives in a different grid column than the food imagery — in normal document flow, not absolutely positioned — overlap with the hero photos is structurally impossible at any breakpoint, not just visually avoided.

- Logo now sizes itself with `clamp(56px, 5vw, 76px)`, so it scales fluidly across desktop/laptop/tablet without needing separate pixel overrides at each breakpoint (removed three now-redundant media-query rules as a result)
- `margin-block-end` gives it consistent spacing before the tagline badge/headline; on mobile it's centered via `margin-inline: auto`, matching the existing centering pattern already used for `.hero__text`
- Animation changed from the continuous `.floating` loop to the same one-time `.fade-up` entrance used by the tagline, headline, paragraph, CTAs, and trust bar — it now enters as part of the same content stagger rather than bobbing independently next to the headline
- `z-index` on the logo rule was removed entirely — no longer needed, since it's no longer stacked against other absolutely positioned elements
- Hero photo composition (plate + 4 orbiting photos + rating chip) and all its `.floating` animations are untouched

**Files modified:** index.html, style.css
**Files unchanged:** script.js, robots.txt, sitemap.xml, site.webmanifest