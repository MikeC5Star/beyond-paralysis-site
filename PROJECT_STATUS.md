# Beyond Paralysis — Project Status

## What Is This?
An Astro JS (SSG) website for a Spinal Cord Injury (SCI) research hub at **beyondparalysis.uk**. The repo auto-deploys to Cloudflare Pages via GitHub (`MikeC5Star/beyond-paralysis-site`, branch: `main`).

## Tech Stack
- **Astro v5.16.5** — static site generator
- **Tailwind CSS v3** — via `@astrojs/tailwind` integration
- **@tailwindcss/typography** — `prose` classes for markdown report rendering
- **astro-embed** — lite-youtube-embed `<YouTube />` component (fast static thumbnails, iframe on click)
- **@astrojs/mdx** + **@astrojs/sitemap** — MDX support and auto-generated sitemap
- **sharp** — image optimisation

## Design Theme: "Clinical Realism"
Dark mode default. Colours defined in `tailwind.config.mjs` under `theme.extend.colors.clinical`:
- **Background:** `#0f172a` (deep navy) — `bg-clinical-bg`
- **Cards/Containers:** `#1e293b` (dark slate) — `bg-clinical-card`
- **Accent:** `#00e5ff` (electric teal) — `text-clinical-accent`, `border-clinical-accent`
- **Text:** White for body, `text-slate-400` for secondary, `text-slate-500` for dates/meta

### Card Glow Effect
All cards use a custom `.card-glow` Tailwind component (defined in `tailwind.config.mjs`) with:
- Multi-layered cyan box-shadow (20px, 50px, 100px spread)
- Subtle rim-light border (`rgba(0, 229, 255, 0.15)`)
- Inset top highlight for depth

### Background Pattern
Two mirrored copies of `public/pattern.svg` are rendered as fixed overlays in `BaseLayout.astro`:
- Right copy: positioned at bottom quarter, pushed 10px past the right edge
- Left copy: horizontally mirrored with `scaleX(-1)`, pushed 10px past the left edge
- Both are `pointer-events-none` and `z-0` so they don't interfere with content

## Directory Structure
```
beyond-paralysis-site/
├── astro.config.mjs          # Site: beyondparalysis.uk, integrations: tailwind, mdx, sitemap
├── tailwind.config.mjs       # Clinical Realism theme + card-glow component + typography plugin
├── tsconfig.json
├── package.json
│
├── public/
│   ├── favicon.svg
│   ├── pattern.svg           # Line pattern SVG used as background decoration
│   └── pdfs/                 # Drop PDF files here for download links from reports
│       └── Griffith University OEC Nerve Bridge plus NervGenn 291.pdf
│
├── src/
│   ├── config/
│   │   └── youtube.ts        # Manual array of 4 YouTube video IDs + featured report slug
│   │
│   ├── content.config.ts     # Zod schemas for "news" and "reports" collections
│   │
│   ├── content/
│   │   ├── news/             # Organised by month/date folders (see below)
│   │   │   └── feb/
│   │   │       └── 130226/   # 5 articles from 13th Feb 2026
│   │   └── reports/
│   │       ├── Griffith_Uni.md   # Griffith OEC Nerve Bridge trial deep dive
│   │       └── NervGen.md        # NervGen NVG-291 CONNECT-SCI trial deep dive
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro  # HTML shell, Header, dark theme, dual SVG background overlays
│   │
│   ├── components/
│   │   ├── Header.astro      # Sticky nav: Home | News | Deep Dives
│   │   ├── HeroSection.astro # Personal story YouTube video embed (gPr4XiVQHf4)
│   │   ├── ResearchFeed.astro# Card-based sidebar feed with category badges + tech ratings
│   │   └── YouTubeSection.astro # 4-video grid using lite-youtube-embed
│   │
│   └── pages/
│       ├── index.astro       # Homepage: Hero (left) + ResearchFeed (right) + YouTube (bottom)
│       ├── news/
│       │   └── [...page].astro # Paginated news with category badges + tech ratings
│       └── reports/
│           ├── index.astro   # Reports listing page
│           └── [slug].astro  # Dynamic report page with section cards, sticky TOC, PDF download
```

## Content Collections (src/content.config.ts)

### News Collection
Loaded via glob from `./src/content/news` (recursive, picks up nested folders).
```yaml
# Required frontmatter for each news .md file:
title: "Article Title"
pubDate: 2026-02-13        # YYYY-MM-DD format
brief: "Layman's summary"
techRating: 3               # 1-5 scale (1=green, 2=lime, 3=yellow, 4=orange, 5=red)
category: ["Neuro-inflammation", "Pharmacology"]  # Array of categories
sourceUrl: "https://..."    # Link to original research
tags: ["Tag1", "Tag2"]      # Optional
```

**Category colour map** (used in ResearchFeed + /news/ page):
- Biomaterials / Biomaterials & Regenerative Medicine → emerald
- Pharmacology / Pharmacology & Biomaterials → purple
- Neuro-inflammation / Neuro-inflammation & Pharmacology → rose
- Rehabilitation & Assistive Technology → sky
- Robotics & Rehabilitation → cyan
- Clinical Trial → amber
- Neuromodulation → teal
- Preclinical → violet
- Gene Therapy → pink

### Reports Collection
Loaded via glob from `./src/content/reports`.
```yaml
# Required frontmatter for each report .md file:
title: "Report Title"
pubDate: 2026-02-13
executiveSummary: "One-paragraph summary"
pdfFilename: "filename.pdf"         # Optional — must match file in public/pdfs/
youtubeUrl: "https://youtube.com/..." # Optional
```

## News File Organisation
Files are stored in date-based folders for easy management:
```
src/content/news/
├── feb/
│   ├── 130226/     # ddmmyy format
│   │   ├── nanoparticle-hydrogel.md
│   │   ├── dual-drug-hydrogel.md
│   │   ├── upper-limb-splinting.md
│   │   ├── robotic-exoskeleton.md
│   │   └── ipa-astrocyte-inflammation.md
│   └── 140226/     # Tomorrow's articles go here
├── mar/
│   └── 010326/
└── april/
    └── 220426/
```
The glob loader picks up all nested `.md` files automatically — folder structure is purely organisational.

## Key Features & Behaviours

### Homepage
- **Hero Section** (left): Personal story YouTube video embed (video ID: `gPr4XiVQHf4`)
- **Research Feed** (right sidebar, 380px): Card-based news feed with category colour badges, tech rating indicators (green-to-red scale), max 20 items from last 30 days, custom teal scrollbar
- **YouTube Section** (bottom): 4-video grid from `src/config/youtube.ts`

### News Page (/news/)
- Full paginated view of last 30 days of news (20 per page)
- Same card styling as homepage feed with category badges + tech ratings
- Astro generates `/news/`, `/news/2/`, `/news/3/` etc. statically — zero JS
- Prev/Next pagination controls with disabled states

### Report Pages (/reports/[slug])
- **PDF download banner** at top (card-glow styled) if `pdfFilename` is set
- **Header** with date, "Deep Dive" label, title, and executive summary (italic with teal left border)
- **Section cards**: Client-side JS wraps each `h3` + following content into `.section-card` divs with glow effect
- **Sticky TOC sidebar** ("On This Page") using Astro's `render()` headings for accurate anchor links
- **Custom CSS** for report content: teal heading bars, teal list markers, styled links, bold text in white
- Back link to `/reports`

### Styling Details
- All cards site-wide use the `.card-glow` component class
- Report section cards get additional styling via `.section-card` class
- `h3` headings in reports have a `::before` teal bar and bottom border
- TOC uses `renderedHeadings` from `await render(report)` with `h.slug` for accurate anchor links (not custom regex IDs)

## YouTube Config (src/config/youtube.ts)
```ts
export const latestVideos = [
  'Pam3jzLaNaQ',
  'GzQmaBCJVcs',
  'Yxax9XBNbBo',
  '4SfBB5jq-0k',
];
export const featuredVideoId = 'Pam3jzLaNaQ';
export const featuredReportSlug = 'NervGen';
```
Update this file to change which videos appear on the homepage.

## Known Issues / Gotchas
- **Duplicate ID warnings on Windows**: The Astro dev server shows "Duplicate id" warnings for report files during hot reload. This is a known Astro/Windows quirk and does not affect the built site.
- **Content cache**: If news/reports aren't showing after adding new files, delete the `.astro/` directory and restart the dev server.
- **YAML quoting**: If a report title contains double quotes, use single quotes for the outer YAML string (e.g., `title: 'Title with "quotes"'`).

## What's NOT Built Yet
- News archive viewer (for articles older than 30 days)
- Auto-fetch YouTube videos (currently manual IDs)
- Mobile hamburger menu (nav links are there but no responsive menu toggle)
- Any branding/logo beyond the text "Beyond Paralysis"
- About page or any other pages beyond Home, News, Deep Dives

## Commands
```bash
npm run dev       # Local dev server (usually localhost:4321 or 4322 if port in use)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Deployment
Push to `main` on GitHub → Cloudflare Pages auto-deploys. No manual steps needed.
