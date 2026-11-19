# Yakob Getu's portfolio

My personal site: who I am, my resume, the things I've built, and a photo journal.
Built with Next.js (App Router), React, TypeScript and Tailwind CSS.

## Run it

```sh
nvm use 22
npm install
npm run dev
```

Open http://127.0.0.1:3000.

Before calling a change done:

```sh
npm run lint
npm test
npm run build
```

The build downloads the two fonts (Hanken Grotesk and Fragment Mono) from Google Fonts, so it needs a network connection.

## Contact form (optional)

The contact form and the journal's like/comment buttons email me through [Resend](https://resend.com).
Copy `.env.example` to `.env.local` and add a key to switch them on. Without a key the site still
runs and the form asks visitors to email instead. Details: [docs/CONTACT_AND_REACTIONS.md](docs/CONTACT_AND_REACTIONS.md).

## What's where

```text
src/
  app/                  Routes and their metadata. API routes re-export handlers from features.
  features/
    home/               Hero, About and the Life strip
    resume/             Resume content (resume-data.ts) and how it is shown
    contact/            Contact form, its rules, and the /api/contact handler
    music/              The background music player (30-second Spotify clips)
    notifications/      Emailing me: Resend call, request checks, rate limit
    projects/
      projects.ts       The list of projects shown on Home and /projects
      elsewhere/        Photo journal: chapters, photo viewer, reactions
      zempled/          Ethiopian originals next to the songs that sampled them
      trace/            Replay of real runs of the Trace terminal tool
  components/
    layout/             Header, menu, search, side buttons, footer, page transition
    motion/             Pointer and scroll effects (all respect reduced motion)
    culture/            Ge'ez letters, the woven tibeb band, and the small "learn" cards
    providers/          Theme and interface sounds
    security/           Content Security Policy
    ui/                 Small shared pieces (hover card, toast, section heading)
  styles/               globals.css (colors, Tailwind) and site.css (shared layout classes)
public/
  projects/<name>/      Each project's images
  images/, documents/   Portraits, company marks, the resume PDF
scripts/                One-off helpers (prepare journal photos, refresh the playlist)
tests/                  node --test files for the logic that matters
docs/                   Longer notes, listed below
```

## Docs

- [Project structure](docs/PROJECT_STRUCTURE.md): where each kind of change goes, and how to add a project.
- [Contact and reactions](docs/CONTACT_AND_REACTIONS.md): setup, protections, known limits.
- [Zempled listening](docs/ZEMPLED_LISTENING.md): how previews and song links work, and how pairs are sourced.

## Good to know

- Pages are rendered per request so each response gets its own script nonce for the
  Content Security Policy (`src/proxy.ts`).
- `/projects/ethiotunes` and `/api/ethiotunes/preview` are old addresses that still work and
  point at Zempled. `/yakob_getu_resume.pdf` redirects to `/documents/yakob_getu_resume.pdf`.
- `vercel.json` turns off automatic deploys for the working branch. Nothing deploys until I say so.
