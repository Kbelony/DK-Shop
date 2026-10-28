# DK-Shop

> Portfolio website for **Deborah Kabongo**, a clothing designer and maker.

**Live site:** [dkshop-omega.vercel.app](https://dkshop-omega.vercel.app)

## About

DK-Shop presents Deborah's handmade clothing: "Cut it, sew it, wear it." The site is an immersive, award-site-style portfolio - oversized type, smooth scrolling, full-screen photography - built around her collections and photo shoots.

## Features

- **Immersive landing page** - hero, maker intro, "Behind the seams" categories (Dresses, Jackets, Pants) and news highlights
- **Full-screen gallery carousel** - loops infinitely in both directions, driven by the current photo albums
- **Live photo albums** - photos load from shared Google Photos albums through a serverless endpoint (`/api/albums`); the share links stay server-side, responses are cached, and the site falls back to static photos if the endpoint fails
- **Gallery pages** - one page per album (`/gallery/:id`) with a swipeable lightbox viewer
- **News** - a news list and full article pages (`/news`, `/news/:slug`)
- **Motion details** - Lenis smooth scrolling, Framer Motion animations, a custom cursor and a full-screen menu overlay
- **Responsive** - layouts tuned for mobile and desktop

## Screenshots

| Home | Gallery carousel |
| --- | --- |
| ![DK-Shop home](docs/screenshots/home.png) | ![Full-screen gallery carousel](docs/screenshots/origin.png) |

| Gallery page |
| --- |
| ![Album gallery page](docs/screenshots/gallery.png) |

## Tech Stack

- **React 18 + TypeScript + Vite** (SWC)
- **React Router 7** - landing, gallery and news routes
- **Tailwind CSS + shadcn/ui (Radix UI)**, with SCSS for global styles
- **Framer Motion** - animations
- **Lenis** - smooth scrolling
- **lucide-react** icons
- **Vercel serverless functions** (`@vercel/node`) - the `/api/albums` photo endpoint

## Getting Started

```bash
git clone https://github.com/Kbelony/DK-Shop.git
cd DK-Shop
npm install
npm run dev
```

Then open http://localhost:5173.

The site works out of the box with its bundled photos. To serve live albums, set the `ALBUM_SHARE_URLS` environment variable (server-side only, see `api/albums.ts`) on your Vercel project.

## Project Structure

```
api/albums.ts            # serverless endpoint that reads the shared photo albums
src/
├── components/landing/  # hero, sections, navbar, footer, cursor, smooth scroll
├── components/gallery/  # album pages + lightbox
├── components/news/     # news list + article pages
├── components/ui/       # shadcn/ui primitives
├── data/                # static fallback galleries + news content
├── hooks/               # useGallery data hook
├── services/            # photo album client (googlePhotos.ts)
└── assets/scss/         # global styles
```
