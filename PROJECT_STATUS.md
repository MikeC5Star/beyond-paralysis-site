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
Two card glow components defined in `tailwind.config.mjs`:
- **`.card-glow`** — Standard teal: multi-layered cyan box-shadow (20px, 50px, 100px spread), subtle rim-light border, inset top highlight
- **`.card-glow-golden`** — Gold variant for "Golden Read" stories: amber box-shadow (`rgba(255, 193, 7, ...)`), gold border (`rgba(255, 193, 7, 0.3)`)

### Background Pattern
Two mirrored copies of `public/pattern.svg` are rendered as fixed overlays in `BaseLayout.astro`:
- Right copy: positioned at bottom quarter, pushed 10px past the right edge
- Left copy: horizontally mirrored with `scaleX(-1)`, pushed 10px past the left edge
- Both are `pointer-events-none` and `z-0` so they don't interfere with content

## Directory Structure
```
beyond-paralysis-site/
├── astro.config.mjs          # Site: beyondparalysis.uk, integrations: tailwind, mdx, sitemap
├── tailwind.config.mjs       # Clinical Realism theme + card-glow + card-glow-golden components
├── tsconfig.json
├── package.json
│
├── public/
│   ├── favicon.svg
│   ├── pattern.svg           # Line pattern SVG used as background decoration
│   └── sc_icon.png           # Cyan spinal cord graphic for header branding
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
│   │   │       ├── 130226/   # 5 articles from 13th Feb 2026
│   │   │       ├── 150226/   # 4 articles from 15th Feb 2026 (1 golden read)
│   │   │       └── 160226/   # 5 articles from 16th Feb 2026 (1 golden read)
│   │   └── reports/          # 10 deep dive reports (see Reports section)
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro  # HTML shell, Header, dark theme, dual SVG background overlays
│   │
│   ├── components/
│   │   ├── Header.astro      # Sticky nav with sc_icon.png (72px, offset 10px), hover glow + underline, text-4xl title
│   │   ├── HeroSection.astro # Featured video: "Is Paralysis Recovery on the Horizon?" (4SfBB5jq-0k)
│   │   ├── ResearchFeed.astro# Card-based sidebar feed with golden read + category badges + tech ratings
│   │   └── YouTubeSection.astro # 4-video grid using lite-youtube-embed
│   │
│   └── pages/
│       ├── index.astro       # Homepage: Hero (left) + ResearchFeed (right) + YouTube (bottom)
│       ├── about.astro       # About Mike — personal story text + "My Story" YouTube video (gPr4XiVQHf4)
│       ├── news/
│       │   └── [...page].astro # Paginated news with golden read + category badges + tech ratings
│       └── reports/
│           ├── index.astro   # Reports listing page with card-glow, Deep Dive + PDF Available badges
│           └── [slug].astro  # Dynamic report page with h2/h3 section cards, sticky TOC, PDF download
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
goldenRead: true            # Optional — marks as "Mike's Recommended Read" with gold glow
sourceUrl: "https://..."    # Link to original research
tags: ["Tag1", "Tag2"]      # Optional
```

**Golden Read feature**: Stories with `goldenRead: true` get a gold glow border (`.card-glow-golden`), a "★ Golden Read" badge, gold title colour, and a hover tooltip saying "Mike's Recommended Read".

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
- Regenerative Medicine → emerald
- Cellular Biology → indigo
- Neurology → fuchsia
- Bioengineering → lime
- Drug Delivery → orange
- Immunology → red
- Stem Cell Therapy → green
- Diagnostics → blue
- Machine Learning → slate/grey

### Reports Collection
Loaded via glob from `./src/content/reports`.
```yaml
# Required frontmatter for each report .md file:
title: "Report Title"
pubDate: 2026-02-13
executiveSummary: "One-paragraph summary"
pdfUrl: "https://assets.beyondparalysis.uk/filename.pdf"  # Optional — full URL to PDF on Cloudflare R2
youtubeUrl: "https://youtube.com/..."                      # Optional
```

**Current reports** (10 total):
1. Griffith_Uni.md — Griffith OEC Nerve Bridge trial (youtubeUrl: Pam3jzLaNaQ)
2. NervGen.md — NervGen NVG-291 CONNECT-SCI trial (youtubeUrl: Yxax9XBNbBo)
3. Polylaminin.md — Polylaminin: A New Biomaterial for Neural Repair (youtubeUrl: GzQmaBCJVcs)
4. Miami_Project.md — The Miami Project: Schwann Cell Transplantation
5. The_Cryo_Bridge.md — The Cryo Bridge: Temperature-Controlled Neural Repair
6. Auto_Dysreflexia.md — Autonomic Dysreflexia: The Hidden Danger After SCI
7. Light_Healing.md — Light Healing: Photobiomodulation for SCI
8. Neuromodulation.md — Neuromodulation: Electrical Stimulation for Recovery
9. SCI_2024_2026_Therapies.md — The Pivot Point: 2025-2026 SCI Research Dossier
10. Northwestern_Dancing_Molecules.md — Northwestern: Dancing Molecules and the SCI Research Ecosystem

**PDF hosting**: PDFs are hosted on Cloudflare R2 at `assets.beyondparalysis.uk`. The `pdfUrl` field contains the full URL (spaces encoded as `%20`). No local PDF storage — `public/pdfs/` has been removed.

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
│   └── 150226/
│       ├── paralysis-treatment-organoids.md  (goldenRead: true)
│       ├── hidden-brain-cells-spinal-repair.md
│       ├── elezanumab-cervical-sci.md
│       └── hydrogel-exosome-spinal-repair.md
│   └── 160226/
│       ├── placenta-protein-spinal-cord-regeneration.md  (goldenRead: true)
│       ├── hybrid-cryomicroneedles-sci.md
│       ├── mesenchymal-stem-cell-vesicles-pain.md
│       ├── mri-machine-learning-sci-detection.md
│       └── tissue-bridges-walking-prediction.md
├── mar/
│   └── 010326/
└── april/
    └── 220426/
```
The glob loader picks up all nested `.md` files automatically — folder structure is purely organisational.

## Key Features & Behaviours

### Header & Navigation
- **Spinal cord icon** (`sc_icon.png`) displayed next to "Beyond Paralysis" title
- **Nav links**: Home, Deep Dives, Research Feed, About Mike — right-aligned, `text-base` size
- **Active page detection**: `Astro.url.pathname` comparison highlights current page with teal colour
- **Hover effects**: Teal text-shadow glow + animated `::after` underline that expands to 60% width
- Sticky header with backdrop blur

### Homepage
- **Hero Section** (left): Featured video "Is Paralysis Recovery on the Horizon?" (video ID: `4SfBB5jq-0k`)
- **Research Feed** (right sidebar, 380px): Card-based news feed with golden read support, category colour badges, tech rating indicators (green-to-red scale), max 20 items from last 30 days, custom teal scrollbar
- **YouTube Section** (bottom): 4-video grid from `src/config/youtube.ts`

### News Page (/news/)
- Full paginated view of last 30 days of news (20 per page)
- Same card styling as homepage feed with golden read + category badges + tech ratings
- Golden read stories get gold glow, "★ Golden Read" badge, and hover tooltip
- Astro generates `/news/`, `/news/2/`, `/news/3/` etc. statically — zero JS
- Prev/Next pagination controls with disabled states

### Report Pages (/reports/[slug])
- **PDF download banner** at top (card-glow styled) if `pdfUrl` is set — links directly to R2 URL
- **Header** with date, "Deep Dive" label, title, and executive summary (italic with teal left border)
- **Dual heading structure**:
  - **H2-based reports** (newer): h2 = main section cards with glow, h3 = nested sub-cards inside
  - **H3-only reports** (legacy Griffith/NervGen): h3 = main section cards
  - Client-side JS detects which structure to use and wraps accordingly
- **Sticky TOC sidebar** ("On This Page") — shows h2 headings, falls back to h3 if no h2 found
- **H2 styling**: 1.5rem, 4px teal bar, bottom border
- **H3 styling**: 1.125rem, 3px softer teal bar, thinner bottom border
- **Custom CSS** for report content: teal heading bars, teal list markers, styled links, bold text in white
- Back link to `/reports`

### Reports Listing Page (/reports/)
- **Two-column grid layout**: report card (75%) + video thumbnail column (25%)
- Card-glow styled report cards with hover effects
- "Deep Dive" badge on every report
- "PDF Available" badge (emerald) shown when `pdfUrl` is set
- "Video" badge (red) shown when `youtubeUrl` is set
- YouTube thumbnail with play button overlay links to video (reports with `youtubeUrl`)
- Reports without video show subtle empty placeholder in video column
- Date display, executive summary preview (3-line clamp)

### About Page (/about)
- Personal story text about Mike's C4-5 SCI and Bangkok treatment journey
- Embedded "My Story" YouTube video (gPr4XiVQHf4) — moved here from homepage hero
- Card-glow container with spinal cord icon
- Back to Home link

### Styling Details
- All cards site-wide use `.card-glow` (or `.card-glow-golden` for golden reads)
- Report section cards get additional styling via `.section-card` class
- Sub-section cards use `.sub-section-card` for nested h3 content inside h2 cards
- TOC uses `renderedHeadings` from `await render(report)` with `h.slug` for accurate anchor links

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

## Commands
```bash
npm run dev       # Local dev server (usually localhost:4321 or 4322 if port in use)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Deployment
Push to `main` on GitHub → Cloudflare Pages auto-deploys. No manual steps needed.
PDFs are hosted separately on Cloudflare R2 at `assets.beyondparalysis.uk`.
