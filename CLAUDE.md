# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page marketing website for "Sterling & Vale Advisory", a fictional wealth-management firm. **Vanilla HTML/CSS/JS only** — no frameworks, no build tools, no package manager, no dependencies except Google Fonts (loaded via `<link>` in `index.html`).

## Running & testing

There is no build step. Open `index.html` directly in a browser:

```powershell
Start-Process "index.html"
```

There is no test suite, linter, or dev server. Verify changes manually in the browser (check the console for errors). Key responsive breakpoints to check: ~375px (mobile), ~768px (mobile nav switches to hamburger), ~1280px (desktop).

## Architecture

Three files, separated by concern:

- **`index.html`** — semantic structure. Sections in order: sticky navbar, hero (85vh), services/about (`id="about"`), testimonials carousel, enquiry form (`id="contact"`), footer. The nav "About" link points at the services section by design.
- **`styles.css`** — all styling. The design system lives in `:root` custom properties (colors `--navy`/`--slate`/`--gold`/`--bg`, a `--space-1..6` spacing scale, `--maxw`, radii, shadows). **Change theme values there, not at usage sites.** Mobile-first; media queries at the bottom layer on tablet/desktop, the mobile nav (`max-width: 768px`), and a `prefers-reduced-motion` block.
- **`script.js`** — interactivity, organized as independent IIFEs: footer year, header scroll-shadow, mobile nav toggle, IntersectionObserver scroll-reveals, testimonials carousel, and the enquiry-form handler. Each guards on its elements existing, so they're self-contained.

### Cross-file conventions

- **Scroll-reveal animations:** add the `reveal` class to any element in HTML; `script.js` observes all `.reveal` nodes and adds `visible` when they scroll into view. CSS defines both states.
- **Reduced motion:** honored in two places that must stay in sync — the CSS `prefers-reduced-motion` block and the `prefersReducedMotion` checks in `script.js` (which disable scroll-reveal and carousel auto-rotation).
- **Carousel dots** are generated in JS from the `[data-slide]` elements, not hardcoded in HTML.

## Enquiry form (FormSubmit)

The form POSTs JSON to FormSubmit's AJAX endpoint via `fetch` (no page redirect). Client-side validation runs first; a hidden `_honey` honeypot guards against spam.

- The destination address is the `FORMSUBMIT_EMAIL` constant near the top of `script.js` — change it there.
- **One-time activation gotcha:** the first submission to a new email address triggers a FormSubmit confirmation email. The form does **not** deliver any messages until that activation link is clicked. A failed/unactivated submit will surface the inline error path, not the success path.
