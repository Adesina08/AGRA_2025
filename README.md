# AGRA 2025 QC Dashboard Prompt Package

This repository stores the longform prompt you can reuse when building or refining the AGRA 2025 QC dashboard with ChatGPT. It captures all guidance for using the `AGRA_2025.xlsx` data dictionary, the expected tabs (Farmer, Enterprise, Youth), and the UI/tech-stack requirements.

## How to use
1. Start a fresh ChatGPT conversation.
2. Upload the **same** `AGRA_2025.xlsx` file that contains the three sheets (`AGRA FARMER`, `AGRA ENTERPRISE`, `AGRA YOUTH`).
3. Copy the entire contents of [`prompts/AGRA_2025_super_prompt.md`](prompts/AGRA_2025_super_prompt.md) into the chat.
4. Ask ChatGPT to design or refine the dashboard using that prompt (e.g., to generate React + TypeScript + Tailwind code with Recharts and Leaflet as described).

## Files
- `prompts/AGRA_2025_super_prompt.md` — the full “super-charged” prompt ready for copy/paste.

Feel free to add a shorter prompt or sample data structures in new files if you need more concise or implementation-ready snippets.
