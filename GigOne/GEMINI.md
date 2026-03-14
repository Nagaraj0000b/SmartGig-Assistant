# GigOne — GEMINI Context File

## Project Overview

**GigOne** is a MERN stack app for gig economy workers (Uber, Swiggy, Rapido drivers).  
It provides an AI companion (Gigi), earnings tracking, work logs, and smart suggestions.

## Stack

| Layer         | Tech                                                   |
| ------------- | ------------------------------------------------------ |
| Frontend      | React + Vite                                           |
| Styling       | Custom CSS (`App.css`) + minimal Tailwind v4           |
| UI Components | Shadcn-style components in `client/src/components/ui/` |
| Routing       | React Router v6                                        |
| Backend       | Node.js + Express (in `server/` — not yet built)       |
| Database      | MongoDB (planned)                                      |

## Project Structure

```
GigOne/
├── client/                        # React frontend
│   ├── public/
│   │   └── gigi-avatar.png        # Gigi AI avatar image
│   └── src/
│       ├── App.css                # 🎨 Global design system (dark glassmorphism theme)
│       ├── App.jsx                # Routes: /signin, /user/dashboard, /admin/dashboard
│       ├── index.css              # Only has @import "tailwindcss"
│       ├── main.jsx               # Entry point — imports App.css
│       ├── components/ui/
│       │   ├── button.jsx         # .btn .btn-primary CSS classes
│       │   ├── card.jsx           # .card, .card-header, .card-content etc.
│       │   ├── input.jsx          # .input CSS class
│       │   ├── label.jsx          # .label CSS class
│       │   └── tabs.jsx           # .tabs-list, .tabs-trigger, .tabs-content
│       └── pages/
│           ├── auth/SignIn.jsx    # Login page (User + Admin tabs)
│           ├── user/DashBoard.jsx # User dashboard (Gigi AI + overview)
│           └── admin/DashBoard.jsx # Admin dashboard (in progress)
└── server/                        # Express backend (empty — not started yet)
```

## Design System (App.css)

- **Theme:** Dark glassmorphism, neon-indigo + teal accents
- **Font:** Inter (Google Fonts)
- **Key CSS variables:**
  - `--color-primary: #6c63ff` (indigo)
  - `--color-accent: #00d4aa` (teal)
  - `--color-bg-deep: #07080f` (page background)
  - `--color-bg-card: rgba(19,22,38,0.75)` (glassmorphism cards)

## CSS Class Conventions

- **DO** add new styles to `App.css` as named classes
- **AVOID** inline Tailwind utilities for design — use Tailwind only for quick layout tweaks (margins, flex)
- Component classes follow pattern: `.component-element` (e.g. `.sidebar-link`, `.gigi-bubble`)

## Current Routes

| Path                  | Component             | Status             |
| --------------------- | --------------------- | ------------------ |
| `/signin`             | `SignIn.jsx`          | ✅ Done            |
| `/user/dashboard`     | `user/DashBoard.jsx`  | ✅ Done            |
| `/admin/dashboard`    | `admin/DashBoard.jsx` | 🔄 Skeleton only   |
| `/user/earnings` etc. | —                     | ❌ Not created yet |

## Dashboard CSS Classes (key ones)

```
.dashboard-page          → grid: sidebar | main
.dashboard-sidebar       → left nav
.sidebar-brand           → logo area
.sidebar-section-label   → "MAIN", "INSIGHTS" labels
.sidebar-link            → nav button, add .active for highlight
.dashboard-topbar        → top bar
.topbar-badge            → status pill, add .active for green glow
.topbar-clock            → time display
.dashboard-center        → grid: gigi | overview
.ai-avatar               → center Gigi panel
.gigi-avatar-circle      → avatar image circle
.gigi-status-chip        → "Listening" chip
.gigi-bubble             → speech bubble
.gigi-mic-btn            → mic hold button
.overview-panel          → right stats panel
.earnings-card           → earnings box
.bar-chart / .bar        → CSS-only bar chart
.work-log-item           → Uber/Swiggy/Rapido row
```

## Teaching Mode Rule

When user says **"teach"** or **"explain"** → explain concepts, show code in chat only.  
Do NOT edit files until user explicitly says **"apply"**, **"go ahead"**, **"update it"**, or similar.

## TODOs / Next Steps

- [ ] Add placeholder routes for `/user/earnings`, `/user/worklogs`, etc.
- [ ] Build Admin Dashboard (same layout as user dashboard)
- [ ] Wire sidebar `<NavLink>` navigation
- [ ] Connect backend API (auth, earnings data)
- [ ] Make topbar date dynamic (not hardcoded)
- [ ] Add `useNavigate` to sidebar buttons
