# FinCal — Goal-Based Investment Calculator

**Technex '26 | IIT(BHU) Varanasi | FinCal Innovation Hackathon**  
*Co-sponsored by HDFC Mutual Fund*

![Project Demo](demo.webp)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev
# → http://localhost:3000

# 3. Build for production
npm run build

# 4. Serve production build
npm run start
```

---

## About

A single-page **Goal-Based Investment Calculator** that helps users estimate the monthly SIP (Systematic Investment Plan) needed to reach a financial target, accounting for inflation and existing savings.

Users can interactively adjust:
- **Current cost of goal** (₹1L – ₹2Cr)
- **Time horizon** (1 – 30 years)
- **Assumed inflation rate** (2% – 15% p.a.)
- **Expected rate of return** (4% – 20% p.a.)
- **Existing savings** already allocated toward the goal

All projections update in real time. A trajectory chart and milestone breakdown table visualize the plan at a glance.

---

## Calculator Category

> **Goal-Based Investment Calculator** — the only category implemented, as per hackathon rules.

---

## Mathematical Formulas

All calculations follow the exact formulas specified in the hackathon brief.

### Step 1 — Future Value (Inflation-Adjusted Goal)

```
FV = Present Cost × (1 + Inflation Rate)^Years
```

### Step 2 — Required Monthly SIP (Annuity Due)

```
SIP = FV × r / [((1 + r)^n − 1) × (1 + r)]

where:
  r = annual return / 12    (monthly rate)
  n = years × 12            (total months)
```

### Step 3 — Existing Savings Adjustment

Lump sum grows using the same monthly compounding as SIP for mathematical consistency:

```
Existing Growth = Savings × (1 + r)^n
Remaining Goal  = max(0, FV − Existing Growth)
Adjusted SIP    = Remaining Goal × r / [((1 + r)^n − 1) × (1 + r)]
```

All assumptions are clearly labeled as **illustrative only** and are fully user-editable.

---

## Tech Stack

| Dependency         | Version  | Purpose                        |
|--------------------|----------|--------------------------------|
| **Next.js**        | 15.5.9   | App Router, SSR, font optimization |
| **React**          | 19.0.0   | UI rendering                   |
| **Recharts**       | 3.8.0    | Area chart for trajectory visualization |
| **Node.js**        | ≥22.11.0 | Runtime (per hackathon spec)   |
| **NPM**            | ≥10.9.0  | Package manager                |

No additional third-party libraries are used.

---

## Brand Guidelines Compliance

| Element     | Value       | Usage                          |
|-------------|-------------|--------------------------------|
| HDFC Blue   | `#224c87`   | Header, panels, sliders, chart accent |
| HDFC Red    | `#da3832`   | Section markers, insight card border, disclaimer |
| HDFC Grey   | `#919090`   | Decorative borders only (does not pass AA for text) |
| Primary Font| Montserrat  | Loaded via `next/font/google` with `swap` |
| Fallbacks   | Arial, Verdana | System font stack              |

---

## Accessibility (WCAG 2.1 AA)

- **Skip navigation** link at the top of every page
- **Semantic HTML**: `<header>`, `<main>`, `<h1>`→`<h2>`, `<figure>`, `<aside>`
- **ARIA attributes**: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` on all sliders
- **Live regions**: `aria-live="polite"` on result display and insight card so screen readers announce changes
- **Screen reader fallback**: `.sr-only` text summarizing chart data for visually impaired users
- **Focus indicators**: `3px solid #224c87` via `:focus-visible` (meets WCAG 2.4.7)
- **Color contrast**: all text exceeds 4.5:1 ratio on its background
  - `#1a1a1a` on white → 15.6:1
  - `#3d3d3d` on white → 11.0:1
  - `#224c87` on white → ~8.9:1

---

## Responsiveness

| Breakpoint   | Layout                                      |
|--------------|---------------------------------------------|
| Desktop (>800px) | Two-column hero, two-column slider grid  |
| Mobile (≤800px)  | Single-column stack, compact padding     |

All interactive elements maintain a minimum 44×44px touch target.

---

## Mandatory Disclaimer

The following disclaimer is displayed verbatim at the bottom of the page:

> *This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.*

---

## Project Structure

```
fincal/
├── app/
│   ├── globals.css         — CSS variables, reset, accessibility utilities
│   ├── layout.js           — Root layout, Montserrat font, skip-nav, metadata
│   └── page.js             — Page entry point (renders GoalCalculator)
├── components/
│   └── GoalCalculator.jsx  — Self-contained calculator (UI + logic + scoped styles)
├── package.json            — Dependencies and scripts
├── jsconfig.json           — Path aliases (@/)
├── next.config.mjs         — Next.js configuration
└── README.md
```

---

## Build Output

```
Route (app)                   Size      First Load JS
┌ ○ /                        114 kB         216 kB
└ ○ /_not-found              996 B          103 kB

○  (Static)  prerendered as static content
   Compiled successfully — 0 errors, 0 warnings
```

---

## License

Built for the Technex '26 FinCal Innovation Hackathon. Not for commercial distribution.
