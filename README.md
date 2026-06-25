# Sterling &amp; Vale Advisory

A single-page marketing website for **Sterling &amp; Vale Advisory**, a (fictional) wealth-management firm. Built with vanilla HTML, CSS, and JavaScript -- no frameworks, no build tools, no dependencies (apart from Google Fonts). Features a royal-amethyst theme and a lead-magnet enquiry section offering a free Wealth Strategy Review.

**Live site:** https://zhenjollyy.github.io/cleverclaude/

![Sterling & Vale Advisory — homepage](assets/screenshot.png)

## Features

- Sticky navigation bar with a mobile hamburger menu
- Full-height hero section with a clear call to action
- Services / about section
- Testimonials carousel (auto-rotating, with generated dots)
- Lead-magnet enquiry section: a "free Wealth Strategy Review" offer with benefit checklist and social proof, paired with a form (client-side validation + spam honeypot, posts via [FormSubmit](https://formsubmit.co/))
- Royal-amethyst design system — all colours driven from `:root` custom properties
- SEO: descriptive meta tags, Open Graph / Twitter cards, `FinancialService` JSON-LD structured data, plus `robots.txt` and `sitemap.xml`
- Scroll-reveal animations via `IntersectionObserver`
- Fully responsive (mobile-first) and respects `prefers-reduced-motion`

## Project structure

| File         | Purpose                                                               |
| ------------ | --------------------------------------------------------------------- |
| `index.html` | Semantic page structure (navbar, hero, services, testimonials, form). |
| `styles.css` | All styling. Design tokens live in `:root` custom properties.         |
| `script.js`  | Interactivity, organized as small self-contained IIFEs.               |
| `robots.txt` / `sitemap.xml` | SEO crawl directives and sitemap for search engines.  |

## Running locally

There is no build step. Just open the file in a browser:

```powershell
Start-Process "index.html"
```

Verify changes manually and check the browser console for errors. Key responsive breakpoints: ~375px (mobile), ~768px (hamburger nav), ~1280px (desktop).

## Deployment

The site auto-deploys to **GitHub Pages** on every push to `main` via the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). No manual steps required -- just push.

## Enquiry form

The form POSTs JSON to FormSubmit's AJAX endpoint. The destination address is the `FORMSUBMIT_EMAIL`
constant near the top of `script.js`. Note: the first submission to a new address triggers a one-time
FormSubmit activation email -- messages are not delivered until that link is clicked.