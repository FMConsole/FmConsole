# FMConsole.com — Build Plan

## Overview
All-in-one Football Manager hub: tools, community, content, and showcase.
Bold/colorful visual design. React + Vite. Multi-page site with React Router.

## Tech Stack
- **Vite + React** (JavaScript, no TypeScript)
- **React Router v7** for page navigation
- **Inline styles** (same approach as Takeover project)
- Responsive design (mobile-first)

## Design System
- **Primary color**: Electric blue (#0066FF) with vibrant gradients
- **Accent colors**: Orange (#FF6B00), Green (#00C853), Purple (#7C4DFF)
- **Background**: Dark (#0A0E17) with subtle gradients
- **Cards/surfaces**: Slightly lighter (#141A2A) with glow effects
- **Typography**: Bold, modern sans-serif (Inter or system fonts)
- **Style**: Bold gradients, glowing accents, card-based layouts, smooth animations

## Pages

### 1. Home
- Full-width hero with gradient background, tagline, CTA buttons
- Feature cards (Tools, Community, Guides)
- Latest content/news preview section
- Stats/numbers bar (users, tools, articles — placeholder data)
- Footer with links and social

### 2. Tools
- Grid of tool cards with icons and descriptions
- Placeholder tools: Tactic Builder, Squad Planner, Player Comparison, Transfer Tracker, Formation Analyzer, Wonderkid Database
- Each card links to a "coming soon" or placeholder page

### 3. Community
- Community hub landing page
- Featured discussions / highlight cards
- Discord integration CTA
- Placeholder for future forum functionality

### 4. Blog/Guides
- Grid of article cards with thumbnails, titles, excerpts
- Category filters (Tactics, Transfers, Wonderkids, Beginners)
- Placeholder articles with sample content

### 5. About
- Mission statement
- Feature highlights with icons
- Team section (placeholder)
- Timeline/roadmap

### 6. Contact
- Contact form (name, email, subject, message)
- Social media links
- FAQ section

## Shared Components
- **Navbar** — Logo, nav links, mobile hamburger menu
- **Footer** — Links, social icons, copyright
- **Card** — Reusable card component with hover effects
- **Button** — Primary/secondary/outline variants with gradients
- **Section** — Consistent section wrapper with spacing
- **GradientText** — Text with gradient coloring

## Project Structure
```
FMConsole.com/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    theme/
      colors.js          — Design tokens
    components/
      Navbar.jsx
      Footer.jsx
      Card.jsx
      Button.jsx
      Section.jsx
      GradientText.jsx
    pages/
      Home.jsx
      Tools.jsx
      Community.jsx
      Blog.jsx
      About.jsx
      Contact.jsx
    assets/
      (empty for now)
```

## Build Order
1. Project scaffolding (Vite + React + React Router)
2. Theme/design tokens
3. Shared components (Navbar, Footer, Button, Card, etc.)
4. App.jsx with router setup
5. Home page (hero + feature sections)
6. Tools page
7. Community page
8. Blog page
9. About page
10. Contact page
11. Mobile responsiveness pass
12. Final polish and preview
