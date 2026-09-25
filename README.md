# DWC-2.0 (Daniel Wellness Center)

Premium luxury wellness website project for Daniel Wellness Center featuring a scroll-controlled iROBO massage chair image sequence architecture.

## Tech Stack
- **Framework:** React + Vite
- **Animation:** GSAP + ScrollTrigger
- **Styling:** Vanilla CSS (Variables + Globals)
- **Assets:** PNG Frame Sequences

## Project Architecture

```
DWC-2.0/
├── public/
│   └── images/
│       └── cinematic/
│           └── hero/
│               ├── desktop/
│               └── mobile/
├── src/
│   ├── assets/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   └── Container.jsx
│   │   ├── navigation/
│   │   │   └── Navbar.jsx
│   │   └── hero/
│   │       ├── Hero.jsx
│   │       ├── HeroCanvas.jsx
│   │       └── HeroContent.jsx
│   ├── hooks/
│   │   ├── useMediaQuery.js
│   │   └── useHeroSequence.js
│   ├── animations/
│   │   ├── heroAnimation.js
│   │   └── scrollAnimations.js
│   ├── config/
│   │   ├── heroFrames.js
│   │   └── siteConfig.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── hero.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
```
