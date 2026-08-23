# RM General Contractor Inc — Website

One-page marketing site for RM General Contractor Inc (North York, ON).
Pure static HTML/CSS/JS — no build step, no dependencies.

```
index.html          the whole site
assets/css/         stylesheet
assets/js/          content loader and site interactions
assets/img/         real project photography
content/site.json   owner-editable website copy and gallery data
admin/              Decap CMS browser editor
```

## Deploy on Replit

1. Replit → **Create Repl → Import from GitHub** → paste this repo's URL.
2. The included `.replit` config serves the site in dev and sets
   **Static Deployment** with the repo root as the public directory.
3. Click **Deploy → Static** to publish.

Works the same on any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages): serve the repo root, no build command.

## Before go-live

- Form + estimate quiz currently open a pre-filled email to
  `info@rmgeneralcontractor.ca` (placeholder). Swap in the real address in
  `assets/js/main.js`, or wire a form service (Formspree/Netlify Forms).
- Update the `canonical` URL in `index.html` to the final domain.

## Owner editing

The browser editor lives at `/admin/`. It allows the owner to update approved
website copy, contact details, FAQs, service cards, and project gallery photos
without changing HTML or CSS.

One-time GitHub and Cloudflare authentication setup is required before the
editor can be used. Follow [CMS_SETUP.md](CMS_SETUP.md) to activate it safely.
