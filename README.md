# DevShaon — Portfolio

Personal portfolio site for **Shaon Ahmed**: lead software engineer profile, experience timeline, projects rail, skills stack, blog links (when present in data), and contact — built with **Angular** (standalone components, SSR-capable setup).

Content (bio, jobs, projects, socials, email) is driven by `public/assets/data/portfolio.json` (and the copy under `src/assets/data/` used during development).

---

## Prerequisites

- **Node.js** (LTS recommended, e.g. v20+)
- **npm** (ships with Node)

---

## Install & run

```bash
npm install
```

**Development server** (hot reload, default `http://localhost:4200/`):

```bash
npm start
```

Same as `ng serve` — npm is only the runner; the Angular CLI in `node_modules` does the work.

**Production build** (output in `dist/`):

```bash
npm run build
```

---

## Why `package.json` has those `scripts` (lines 5–9)

You still use **npm** — these entries do **not** replace npm. They are **named shortcuts** so you do not have to type `npx ng ...` or dig into `node_modules/.bin` every time.

| Script        | Command | Purpose |
|---------------|---------|--------|
| `ng`          | `ng`    | Run the **Angular CLI** (e.g. `npm run ng -- generate component foo`). |
| `start`       | `ng serve` | **Local dev server** — the usual way to develop the site. |
| `build`       | `ng build` | **Optimized build** for deployment (Vercel, static host, etc.). |
| `watch`       | `ng build --watch …` | Rebuild on file changes (handy without the dev server sometimes). |
| `test`        | `ng test` | **Unit tests** via the Angular test builder. |

Other scripts in this repo:

- **`vercel-build`** — `npm run build` (used by Vercel so the host runs one standard build command).
- **`preview`** — currently runs `npm run build` (you can change it to `ng serve` + production build or a static preview tool if you want a true “preview” step).

So: **`package.json` scripts + npm** = you type `npm start` / `npm run build`; npm invokes the local **Angular** toolchain. Nothing extra is required beyond `npm install` once.

---

## Project layout (short)

| Path | Role |
|------|------|
| `src/app/` | Components, pages, routes, services |
| `src/app/pages/home/` | Main single-page layout |
| `public/assets/data/portfolio.json` | Editable portfolio content for builds |
| `angular.json` | Angular workspace / build / serve config |

---

## Editing content

Update **`public/assets/data/portfolio.json`** (keep the same JSON shape as `src/app/models/portfolio.model.ts`). After changes, refresh the dev server or rebuild.

---

## Tech notes

- **Angular** ~21, application builder `@angular/build`, **Tailwind CSS** v4 (PostCSS).
- SSR-related packages are present; deploy target may run Node or static output depending on your host configuration.
