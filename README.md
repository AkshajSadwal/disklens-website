# DiskLens Product Website (Standalone Next.js Project)

This is a **separate marketing and download website** for the DiskLens desktop application. It is not the DiskLens desktop app, and it does not contain or import the desktop application's frontend, backend, database, scanner or installer source.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript / JSX
- Motion for React (`motion`) for staggered hero reveals, scroll-triggered section reveals, a spring-smoothed scroll progress indicator and subtle 3D hover depth
- Lucide React icons
- Custom CSS design system with a cinematic near-black / acid-lime palette, animated SVG light trails and a restrained Swiss grid

## Features

- Responsive desktop and mobile layouts
- DiskLens product hero with editable dashboard preview
- Product features, setup steps, privacy explanation and FAQ
- Direct download button for the official Windows installer
- Reads the latest GitHub Release using the public GitHub Releases API and selects the `DiskLens-Setup-*.exe` asset
- Pinned v1.1.0 installer fallback so the download remains available when GitHub API requests are rate-limited or unavailable
- Continuous, slow aurora/light-trail motion behind the hero and download section
- Animated scan sweep and floating “Index ready” micro-card over the app preview
- Animated progress bars, sunburst accent, feature-card hover depth, and scroll reveals
- Sticky navigation with a scroll progress indicator and animated mobile menu
- Reduced-motion support via `prefers-reduced-motion` and Motion’s `useReducedMotion`, keyboard navigation and accessible landmarks
- No server/database or secret API keys required

## Requirements

- Node.js 20.19 or newer (recommended: Node.js 22 LTS)
- npm 10+ recommended

## Run locally (Windows PowerShell)

```powershell
cd "path\to\DiskLens-Website-Next"
npm install
npm run dev
```

Open <http://localhost:3000>.

## Production build

```powershell
npm run build
npm run start
```

## Configure repository (optional)

By default the site points to `AkshajSadwal/disklens`. To use another public repository, create `.env.local`:

```env
NEXT_PUBLIC_GITHUB_REPO=AkshajSadwal/disklens
```

No private token is used; release metadata comes from GitHub's public API in the browser.

## Motion and performance

The visual motion is built from a small number of CSS/SVG layers and Motion for React rather than a looping background video. Scroll-linked progress uses Motion’s `useScroll` and `useSpring`; entrance reveals are viewport-triggered and run once. The site honors the operating system’s reduced-motion preference by stopping non-essential continuous motion and removing movement transitions.

## Deploy

Deploy as a normal Next.js app to Vercel, Netlify (Next adapter), or any Node.js host that supports Next.js. Configure `NEXT_PUBLIC_GITHUB_REPO` if needed. No desktop-app server or database needs to be deployed.

## Official DiskLens links

- Repository: https://github.com/AkshajSadwal/disklens
- Releases: https://github.com/AkshajSadwal/disklens/releases
- Current pinned Windows x64 installer: https://github.com/AkshajSadwal/disklens/releases/download/v1.1.0/DiskLens-Setup-1.1.0.exe

## Project separation

Keep this website in its own Git repository (for example `disklens-website`). Do not copy it into `A:\disklens-starter` or merge it into the desktop application's monorepo unless you deliberately decide to later.
