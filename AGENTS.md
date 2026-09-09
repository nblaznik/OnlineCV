# OnlineCV contributor guidance

## Project overview

- This is Nejc Blaznik's interactive CV, built with React, Vite, Tailwind CSS,
  Framer Motion, and Recharts.
- `src/App.jsx` defines the page sections and imports the CV content.
- `src/data/cv_data.json` is currently the shared source of CV text.
- `src/PolygonCanvas.jsx` renders the animated polygon background from the DNA
  files in `src/data/`.
- `src/NavRail.jsx` implements the desktop section navigation.

## Local development

- Install dependencies with `npm ci`.
- Run the site with `npm run dev`.
- Without `CF_PAGES`, Vite uses the `/OnlineCV/` base path. The usual local URL
  is therefore `http://127.0.0.1:5173/OnlineCV/`, not the server root.
- Before handing off implementation work, run `npm run build` and
  `npm run lint`. Report pre-existing failures separately from regressions.

## Working principles

- Workshop substantial visual or information-architecture changes with the
  owner before implementing them.
- Preserve the site's distinctive polygon artwork unless the owner approves a
  change to that direction.
- Treat CV facts as owner-controlled data. Never invent dates, qualifications,
  publication statuses, patent statuses, links, job titles, or achievements.
- In particular, the PhD defense has happened, but its exact replacement
  wording and date still require confirmation. Publication and patent statuses
  also require confirmation before editing.
- Keep one structured source of truth for both the website and the future PDF.
  Avoid duplicating CV facts in components or in a separate PDF-only data file.
- Prefer structured fields over HTML embedded in JSON when evolving the content
  model. Maintain compatibility or migrate existing content deliberately.
- The planned editor should be friendly for local use and should not require
  editing raw JSON. Keep any source-writing API development-only unless the
  owner explicitly approves a production editing system.
- The future PDF may use a separate print-friendly layout, but it must consume
  the same underlying CV content as the website.

## Scope and safety

- Do not publish, deploy, push, or rewrite repository history unless explicitly
  requested.
- Do not run automatic dependency or audit fixes without reviewing their impact.
- Keep contact details already hidden by the UI hidden unless the owner asks to
  expose them.
- When touching interactive components, verify desktop and mobile layouts,
  keyboard behavior, reduced-motion behavior, and readable contrast.
