# Portfolio structure

This organization applies to `projects/yakobgetu-portfolio`. Other repositories in Yakob’s home are separate workspaces.

## Ownership

- `src/app` owns URLs, route metadata, and Next.js entry points. Keep feature implementations outside the route files.
- `src/features/home` owns the homepage, `portrait.ts`, and its styles. The optional photo rotator is preserved here but is not mounted by the current homepage.
- `src/features/resume` owns the resume view and `resume-data.ts`; edit content here rather than in the route.
- `src/features/projects/elsewhere` owns `photo-journal.tsx`, `project-card.tsx`, `journal-data.ts`, and `elsewhere.css`. Preserve the correspondence between journal item order and CSS scene slots.
- `src/features/projects/zempled` owns `collection.tsx`, `project-card.tsx`, `sample-pairs.ts`, `collection.module.css`, and the server preview handler in `preview.ts`. Keep accurate sample notes and one source per pair in the sample data.
- `src/features/projects/trace` owns the Trace card, basic URL/text-report view, local bridge handlers, and retained earlier implementation. Its browser checker belongs to the sibling Trace project and starts with `npm run dev`. See `TRACE_SETUP.md`; public checks remain disabled.
- `src/features/projects/othello` owns the Reversi–Othello card and its CSS board animation. The card links directly to the GitHub repository; it has no portfolio demo route.
- `src/features/projects/fruitful` owns the Fruitful card and decorative CSS step sequencer. It links to the public GitHub repository, with no portfolio demo route.
- `src/features/projects/gradient` owns the Gradient card and decorative paper-review animation. It includes contributor credits and links directly to the user-supplied GitHub repository, with no portfolio demo route.
- `src/proxy.ts` owns per-request HTML script nonces and uses `src/components/security/content-security-policy.ts`. Root layout supplies the same nonce to the theme provider. Preserve dynamic, uncached HTML and cached asset handling when changing this boundary.
- `src/components` contains code shared across features, grouped into layout, motion, providers, and UI. Project-specific components belong in their project’s feature folder.
- `src/styles/globals.css` loads Tailwind, base styles, and the shared/feature CSS files. Elsewhere’s manuscript tokens live in its own stylesheet, which is also needed by its project card and shared navigation.
- `public/projects/<slug>` contains project artwork. Shared personal images live in `public/images`, downloads in `public/documents`, and unused starter icons in `public/icons/starter`.

## Adding another project

1. Add `src/features/projects/<slug>` with a project view, `project-card.tsx`, and the data/styles it needs. Use local imports within the feature and `@/` imports for shared code.
2. Put assets in `public/projects/<slug>` and reference them with `/projects/<slug>/...` URLs. A project without assets does not need an empty public folder.
3. For a hosted project view, add `src/app/projects/<slug>/page.tsx` with metadata and the project view. A project that links directly to external code needs only its card.
4. Render its project card in `src/features/home/home-page.tsx` and `src/app/projects/page.tsx`.
5. Give the preview perceptible continuous idle motion with `src/components/motion/project-preview-motion.tsx`. Keep hover transforms on a nested element so they compose with idle motion. Respect reduced-motion preferences.
6. Use CSS modules for local styles. If a global feature stylesheet is necessary, give its selectors a feature prefix and import it through `src/styles/globals.css`.
7. Run lint and a production build, then check navigation, both themes, small screens, assets, and any changed interactions.

Review real dependencies and feature code before choosing technology badges; see `PROJECT_TECH_STACKS.md` for current evidence. Put the three primary tools first in the metadata array. The shared metadata disclosure reveals additional badges. Use `project-card-link.tsx` inside a positioned card for navigation so the disclosure remains outside the anchor and can expand without navigating.

## Routes and compatibility

Project URLs remain `/projects/elsewhere` and `/projects/zempled`. The old EthioTunes page redirects to Zempled. Preview routes are thin exports of the handler owned by Zempled; the old API route remains available. The old resume PDF address is preserved through a redirect in `next.config.ts`.

## Generated files

Keep package/config files at the repository root. `.next`, `node_modules`, and TypeScript build info are generated output, not feature code; do not move them into feature folders or commit them. Keep project documentation in `docs`.

## Long-term maintenance

Prefer clear feature ownership, readable TypeScript/JSX, and straightforward control flow over clever abstractions. Introduce shared code for an actual shared responsibility, and add dependencies only when their maintenance cost is justified. Keep changes focused and verify failure paths and lifecycle behavior when affected. Document decisions that a future human maintainer needs; comments should explain reasons rather than restating code.

This is Yakob’s standing preference for future work, recorded in the repository’s `AGENTS.md` and the workspace-wide `/Users/yakob/AGENTS.md`. It guides implementation choices without requiring a large refactor for every task.
