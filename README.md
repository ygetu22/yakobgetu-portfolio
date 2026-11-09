# Yakob Getu’s portfolio

Next.js App Router, React, TypeScript, and Tailwind CSS. Includes Home, Resume, placeholder writing pages, and three projects: Elsewhere, Zempled, and Trace.

## Development

```sh
nvm use 22
npm install
npm run dev
```

Open http://127.0.0.1:3000. `npm run dev` also starts the sibling Trace checker on loopback port 3120; see [Trace setup](docs/TRACE_SETUP.md). A short arrival screen plays on each fresh page load, then fades into the page that was opened.

```sh
npm run lint
npm run build
```

The production build downloads DM Sans and Cormorant Garamond from Google Fonts and needs network access.

## Structure

```text
src/
  app/                         Routes, route metadata, root layout, API entry points
  features/
    home/                      Homepage, portrait data, home styles, optional photo rotator
    resume/                    Resume presentation and content
    projects/
      elsewhere/               Journal, project card, content, manuscript styles
      zempled/                 Collection, project card, sample data, styles, preview handler
  components/
    layout/                    Site navigation, cultural backdrop, arrival screen
    motion/                    Scroll reveals and reusable project idle animations
    providers/                 Theme provider
    ui/                        Shared page and photo placeholders
  styles/
    globals.css                Global theme, Tailwind, base styles, feature CSS imports
public/
  projects/zempled/             Album artwork and sleeve texture
  images/portraits/             Personal photo library
  images/resume/               Company marks
  documents/                   Downloadable resume
  icons/starter/               Preserved, currently unused starter icons
  images/me.JPG                Preserved personal image
  # favicon lives in src/app/favicon.ico
docs/
  PROJECT_STRUCTURE.md         File ownership and conventions for new projects
  PROJECT_HANDOFF.md           Project history, preferences, and pending work
```

See [the structure guide](docs/PROJECT_STRUCTURE.md) for where to make changes, and [the handoff](docs/PROJECT_HANDOFF.md) for design decisions and outstanding work.

## Compatibility

`/projects/ethiotunes` redirects to `/projects/zempled`. Both `/api/zempled/preview` and the previous `/api/ethiotunes/preview` use the same preview handler. The previous `/yakob_getu_resume.pdf` download address redirects to `/documents/yakob_getu_resume.pdf`.

Work stays local until Yakob explicitly approves a commit, push, PR, or deployment.

Trace is now included alongside the existing projects with a recorded investigation at `/projects/trace`. Live investigations remain off pending isolated worker hosting. See [Trace setup and security boundaries](docs/TRACE_SETUP.md) for server-only configuration, evidence access, and future release requirements. Run `npm run test:trace` for its security-policy checks. HTML now uses per-request script nonces and dynamic rendering; production runtime dependencies were patched and audited.
