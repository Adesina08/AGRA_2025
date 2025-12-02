# AGRA 2025 QC Dashboard

This repository now includes a working React + TypeScript + Tailwind dashboard scaffold for the AGRA 2025 QC program alongside the reusable prompt captured in [`prompts/AGRA_2025_super_prompt.md`](prompts/AGRA_2025_super_prompt.md).

## Contents
- `dashboard/` — Vite + React + TypeScript app implementing the 3-tab QC dashboard (Farmer, Enterprise, Youth) with KPI cards, charts, maps, and data tables wired to the AGRA variable codes.
- `prompts/AGRA_2025_super_prompt.md` — the longform prompt ready to copy into a ChatGPT session together with the `AGRA_2025.xlsx` data dictionary.

## Running the dashboard locally
1. Install dependencies (requires Node 18+):
   ```bash
   cd dashboard
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   The site listens on the default Vite port (5173). A Leaflet stylesheet is pulled via CDN until the real assets are bundled.
3. Build for production:
   ```bash
   npm run build && npm run preview
   ```

## Deploying to Netlify
1. Connect this repository to Netlify and keep the root as the repo root (Netlify will read `netlify.toml`).
2. The provided `netlify.toml` already sets the correct build context for the `dashboard/` app:
   - Base directory: `dashboard`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - SPA rewrite: all routes redirect to `index.html` so client-side routing works on refresh.
   - Node version: 18 (override in Netlify UI if needed).
3. Alternatively, with the Netlify CLI installed and authenticated, run from the repo root:
   ```bash
   netlify deploy --build
   ```
   This honors the same build/publish settings and will create a draft deploy; add `--prod` for production.

## Replacing the sample data
- Swap out `src/data/sampleData.ts` with the real Farmer/Enterprise/Youth datasets exported using the AGRA dictionary column names (e.g., DB7, D4, B14_Q).
- The dashboard already binds chart labels and table headers to the official AGRA variable labels and expects the following key fields:
  - Farmer: DB5/DB6 (age/age category), DB7 or D10 (gender), DB10/DB11/DB14 (location)
  - Enterprise: B2/B3 (owner ages), A10/B1 (gender), B14_Q (district), validation status
  - Youth: D4 (sex), D9 (location type), D8 latitude/longitude, RS* engagement markers
- Auto-refresh is simulated every 45 seconds to demonstrate real-time KPI updates; adjust or connect to your pipeline as needed.

## Using the super prompt
If you want to regenerate or extend the UI via ChatGPT, start a new conversation, upload `AGRA_2025.xlsx`, and paste the full text from `prompts/AGRA_2025_super_prompt.md`. The prompt already lists the three sheets and their variable codes so the generated UI stays aligned with the data dictionary.
