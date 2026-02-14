Project Overview:
We are building an Astro JS (SSG) website for a Spinal Cord Injury (SCI) research hub called "Beyond Paralysis" (beyondparalysis.uk). I am starting fresh with a clean VS Code workspace linked to a GitHub repo (auto-deploying to Cloudflare). 
1. Design & Aesthetic Goal
The site must match a "Clinical Realism" aesthetic (dark mode default). Please use Tailwind CSS to implement this theme:
•	Background: Deep navy/charcoal (bg-[#0f172a]).
•	Cards/Containers: Elevated dark slate (bg-[#1e293b]).
•	Accents: Electric clinical teal (text-[#00e5ff], border-[#00e5ff]).
•	Text: Crisp white for main body, muted gray (text-slate-400) for abstracts/secondary text.
•	Layout: High-contrast, clean, Dribbble-style UI. Not overly crowded.
2. Core Page Layout (src/pages/index.astro)
The homepage needs three distinct sections:
•	Section A: The Hero (Top Left) - A large featured component highlighting a specific Deep Dive report or video (choose a default & I'll instruct which to use later).
•	Section B: Live Research Feed (Right Sidebar) - A vertically scrolling list (or grid) taking up the right side of the screen. This will display daily news pulled from the news Content Collection. Use an interactive accordion or expandable card so users can click a title to read the brief and see a techRating tooltip.
•	Section C: YouTube Latest Videos (Bottom Row) - Display the 4 most recent videos from my YouTube channel (@MikeBeyondParalysis or https://www.youtube.com/@MikeBeyondParalysis).
3. YouTube Integration (Important)
We need to display the latest 4 videos. Since hitting the YouTube API on every page load slows down Astro, please use the @astro-community/astro-embed-youtube package (specifically the <YouTube /> component). This package uses lite-youtube-embed to load a fast, static thumbnail that only loads the heavy video iframe after the user clicks it. This allows the video to play directly on my site, and it automatically includes YouTube's native UI (title, logo, and "Watch on YouTube" link). Note: Set this up to accept manual YouTube IDs via a configuration file for now until we build an auto-fetch script.
4. Data Structure & Content Collections (src/content.config.ts)
Please configure Astro Content Collections exactly like this using Zod. I will be dropping .md files into these folders manually.
TypeScripta
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    brief: z.string(), // Layman's summary
    techRating: z.number().min(1).max(5), // 1-5 complexity scale
    sourceUrl: z.string().url(),
    tags: z.array(z.string()).optional(),
  }),
});

const reportsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    youtubeUrl: z.string().url().optional(),
    pdfFilename: z.string().optional(), // Used to link to the public/pdfs/ folder
    executiveSummary: z.string(),
  }),
});

export const collections = {
  'news': newsCollection,
  'reports': reportsCollection,
};
5. File & Folder Structure
Please ensure the following directory structure is created:
•	src/content/news/ (Where I will drop daily markdown news files)
•	src/content/reports/ (Where I will drop my Deep Dive markdown files)
•	public/pdfs/ (Where I will upload the raw PDF files so they can be downloaded from the site)
•	src/pages/reports/[slug].astro (Dynamic routing page for the Deep Dives. This page MUST include a prominent "Download Source PDF" button at the top that links to the associated file in public/pdfs/).
Please build out the base Astro project with Tailwind, these collections, and the index page layout. Let me know when you are done so I can start dropping in content. Also create a todo list file for this whole process (your able to refer back to) & mark off the completed tasks as you go. Thanks!

