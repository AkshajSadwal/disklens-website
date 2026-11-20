# DiskLens Product Website (Standalone Next.js Project)

This is a **separate marketing and download website** for the DiskLens desktop application. It is not the DiskLens desktop app, and it does not contain or import the desktop application's frontend, backend, database, scanner or installer source.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript / JSX
- Lucide React icons
- Custom CSS design system with a cinematic near-black / acid-lime palette, an animated Canvas light field and scroll-driven scenes

## Features

- Responsive desktop and mobile layouts
- Interactive folder map and a multi-level sunburst in a laptop showcase
- A scroll-driven sample scan console, cleanup insights, local privacy and FAQ
- Direct download button for the official Windows installer
- Reads the latest GitHub Release using the public GitHub Releases API and selects the `DiskLens-Setup-*.exe` asset
- Pinned v1.1.0 installer fallback so the download remains available when GitHub API requests are rate-limited or unavailable
- Folder selection highlights the corresponding chart branch and reports its indexed size
- Sticky navigation, mobile menu and direct links into the searchable product guide
- Reduced-motion support, keyboard navigation and accessible landmarks
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

The landing page draws animated strands and moving particles on a Canvas that changes shape with scroll position. The scan console updates as desktop visitors scroll through the steps. The steps also work as buttons. Reduced-motion mode stops the Canvas and lays out the console without pinning. Both storage demos use sample data.

## Deploy

Deploy as a normal Next.js app to Vercel, Netlify (Next adapter), or any Node.js host that supports Next.js. Configure `NEXT_PUBLIC_GITHUB_REPO` if needed. No desktop-app server or database needs to be deployed.

## Official DiskLens links

- Repository: https://github.com/AkshajSadwal/disklens
- Releases: https://github.com/AkshajSadwal/disklens/releases
- Current pinned Windows x64 installer: https://github.com/AkshajSadwal/disklens/releases/download/v1.1.0/DiskLens-Setup-1.1.0.exe

## Project separation

Keep this website in its own Git repository (for example `disklens-website`). Do not copy it into `A:\disklens-starter` or merge it into the desktop application's monorepo unless you deliberately decide to later.
