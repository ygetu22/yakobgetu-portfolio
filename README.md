# Yakob Getu's portfolio

My personal site: who I am, my resume, and the things I've built.
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

The contact form emails me through [Resend](https://resend.com).
Copy `.env.example` to `.env.local` and add a key to switch it on. Without a key the site still
runs and the form asks visitors to email instead. Details: [docs/CONTACT_FORM.md](docs/CONTACT_FORM.md).

## Likes and comments on posts (optional)

They are stored in a free Upstash Redis database connected through Vercel. Run
`vercel env pull .env.local` to use it locally. Without it, posts still show and the buttons
say they're off. Details: [docs/POSTS.md](docs/POSTS.md).

## What's where

```text
src/
  app/                  Routes and their metadata. API routes re-export handlers from features.
  features/
    home/               Hero, About and the Life strip (its photos are in life-photos.ts)
    resume/             Resume content (resume-data.ts) and how it is shown
    contact/            Contact form, its rules, and the /api/contact handler
    music/              The background music player (30-second Spotify clips)
    posts/              Posts (posts.ts), their pages, likes and comments
    geez-name/          "Your name in Ge'ez": spelling a name in fidel and the share card
    storage/            The Upstash Redis calls behind likes and comments
    notifications/      Emailing me: Resend call, request checks, rate limit
    projects/
      projects.ts       The list of projects shown on Home and /projects
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
scripts/                One-off helpers (refresh the playlist and artist photos, render the favicon)
tests/                  node --test files for the logic that matters
docs/                   Longer notes, listed below
```

## Docs

- [Project structure](docs/PROJECT_STRUCTURE.md): where each kind of change goes, and how to add a project.
- [Contact form](docs/CONTACT_FORM.md): setup, protections, known limits.
- [Posts](docs/POSTS.md): adding a post, the database, deleting a comment.
- [Zempled listening](docs/ZEMPLED_LISTENING.md): how previews and song links work, and how pairs are sourced.

## Good to know

- Pages are rendered per request so each response gets its own script nonce for the
  Content Security Policy (`src/proxy.ts`).
- `/projects/ethiotunes` and `/api/ethiotunes/preview` are old addresses that still work and
  point at Zempled. `/yakob_getu_resume.pdf` redirects to `/documents/yakob_getu_resume.pdf`.
- Vercel deploys `main` to yakobgetu.com and makes a preview for every other branch.
