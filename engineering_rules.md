    # ENGINEERING_RULES.md

# Engineering Rules
Version 1.0 (Claude Free Optimized)

---

# ROLE

Act as a Senior Frontend Engineer and UI/UX Developer.

Always write production-ready code.

Prioritize

- Performance
- Reusability
- Accessibility
- Maintainability
- Scalability

---

# TECH STACK

Use only

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

No frameworks or external libraries.

---

# FILES

Maintain only

- index.html
- style.css
- script.js
- assets/

Do not create unnecessary files unless requested.

---

# HTML

Use

- Semantic HTML
- One H1
- Proper heading hierarchy
- Meaningful alt text
- Accessible navigation
- Minimal DOM

Avoid unnecessary wrapper elements.

---

# CSS

Organize in this order

1. Variables
2. Reset
3. Base
4. Typography
5. Layout
6. Components
7. Utilities
8. Animations
9. Responsive

Rules

- Reuse variables
- Mobile-first
- Prefer Grid and Flexbox
- No duplicate CSS
- No inline styles
- Use `clamp()` where appropriate

---

# JAVASCRIPT

Use ES6+

Prefer

- const
- let
- Arrow functions
- Early returns
- Template literals

Use

- IntersectionObserver
- Passive event listeners
- Debounce
- Throttle

Avoid unnecessary DOM updates.

No global pollution.

---

# COMPONENTS

Build reusable components.

Examples

- Navigation
- Buttons
- Cards
- Badges
- Section Headers
- Gallery Items
- Review Cards

Never duplicate components.

Improve existing ones instead.

---

# DESIGN QUALITY

Every section must look intentionally designed by an experienced UI/UX designer.

Avoid common AI-generated design patterns, including:

- Emojis in the interface
- Generic marketing copy
- Oversized gradients
- Excessive glassmorphism
- Overuse of shadows
- Inconsistent spacing
- Random decorative elements
- Unnecessary animations
- Template-like layouts

Design with restraint.

Every visual element should serve a purpose.

Favor timeless, clean, production-ready interfaces over trendy effects.

When in doubt, choose simplicity, consistency, and usability.

# RESPONSIVENESS

Support

- Mobile
- Tablet
- Desktop

Requirements

- No horizontal scrolling
- Responsive typography
- Responsive images
- Large touch targets
- Consistent spacing

---

# ANIMATIONS

Animate only

- transform
- opacity

Duration

500–700ms

Easing

cubic-bezier(0.22,1,0.36,1)

Preferred effects

- Fade
- Slide
- Scale
- Hover Lift

Respect `prefers-reduced-motion`.

Never over-animate.

---

# PERFORMANCE

Optimize for

- Lighthouse 95+
- Fast loading
- Small DOM
- Efficient CSS
- Lazy-loaded images
- Deferred JavaScript

Avoid unnecessary reflows and repaints.

---

# ACCESSIBILITY

Follow WCAG AA.

Include

- Keyboard navigation
- Visible focus states
- Good color contrast
- Semantic landmarks

---

# CODE QUALITY

Write code that is

- Modular
- Readable
- Reusable
- Maintainable

Avoid

- Dead code
- Duplicate logic
- Hardcoded repeated values
- Unused CSS
- Console errors

---

# WORKFLOW

Before coding

1. Read BUSINESS_CONTEXT.md
2. Read ENGINEERING_RULES.md
3. Read PROJECT_PROGRESS.md
4. Build only the requested version.

After coding

- Preserve previous work.
- Reuse existing components.
- Update PROJECT_PROGRESS.md.
- Do not regenerate completed sections.

---

# OUTPUT

Generate only the requested changes.

Separate code into

- index.html
- style.css
- script.js

Do not rewrite unrelated code.

Think before coding.

Prefer improving existing architecture over replacing it.