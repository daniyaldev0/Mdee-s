# MDEE'S Website
## WhatsApp Smart Ordering

Before coding

1. Read BUSINESS_CONTEXT.md
2. Preserve the existing website.
3. Do NOT redesign any UI.
4. Implement only the functionality described below.

---

# OBJECTIVE

Implement a dynamic WhatsApp ordering system.

Whenever a customer clicks an "Order Now", "WhatsApp Order", or similar ordering button associated with a specific menu item or deal, WhatsApp should open with a pre-filled message containing the selected product.

The solution must be reusable, scalable and easy to maintain.

---

# REQUIREMENTS

Do NOT hardcode different JavaScript functions for every button.

Instead, create one reusable solution.

Each ordering button should contain a data attribute similar to

data-product="Chicken Tikka Pizza"

or

data-product="Family Deal"

The JavaScript should automatically read this value.

---

# WHATSAPP MESSAGE

Generate the following message dynamically.

Hi MDEE'S!

I'd like to order:

• {Selected Product}

Please let me know the available sizes, prices and estimated delivery time.

Thank you!

Replace

{Selected Product}

with the product associated with the clicked button.

---

# URL FORMAT

Generate the WhatsApp URL using

https://wa.me/

and encode the message correctly using JavaScript.

Never hardcode encoded text inside the HTML.

---

# JAVASCRIPT

Create

- one reusable function
- event listeners for all WhatsApp order buttons

The implementation should automatically work for future menu items without additional JavaScript.

---

# HTML

Update every ordering button.

Example

data-product="Chicken Tikka Pizza"

Use semantic HTML.

Do not duplicate unnecessary code.

---

# USER EXPERIENCE

When the user clicks

Order Now

or

WhatsApp Order

The browser should

- open WhatsApp
- insert the correct message
- require no manual typing

The transition should feel instant.

---

# ACCESSIBILITY

Maintain

- Keyboard accessibility
- Focus states
- Semantic buttons

---

# PERFORMANCE

Keep JavaScript lightweight.

Avoid duplicate functions.

Avoid inline onclick attributes if possible.

Use event delegation where appropriate.

---

# CODE QUALITY

The implementation should be

- Modular
- Reusable
- Easy to extend
- Production ready

Future menu items should require only changing the HTML data attribute.

No JavaScript modifications should be needed.

---

# IMPORTANT

Do NOT

- Redesign the website
- Change button styling
- Modify layouts
- Change animations

Only implement the WhatsApp ordering functionality.

---

# OUTPUT

Generate only the required changes for

- index.html
- script.js

Modify style.css only if absolutely necessary.

The final implementation should allow customers to click any menu item and instantly open WhatsApp with a professionally formatted message containing the selected product.