# BRICS AgriN

An interoperable Digital Public Good for regenerative agriculture across BRICS nations. Delivers localized agro-advisories, satellite and soil-health telemetry, and AI crop disease diagnostics — with ten Indian languages and a federated model-sharing layer.

**Live demo:** https://brics-agrin-regenerative-agricultural-intelligence.ai.studio/

## Stack

React + Express · Gemini 3.8 Flash via `@google/genai` · Cloud Run (asia-south1)

## Features

- **Regenerative advisory** — six BRICS agro-ecological nodes (India, Brazil, South Africa, China, Russia, Ethiopia) surface satellite vegetation indices, soil chemistry, and 7-day climate outlooks as farm-level actionable advice.
- **Crop disease diagnostic** — multimodal Gemini vision identifies pathogens from a leaf photo and prescribes strictly non-chemical, biologically-derived remedies drawn from indigenous agronomic tradition.
- **Federated model registry** — member states publish and share regenerative protocols as interoperable JSON-LD, enabling cross-border knowledge exchange without proprietary platform lock-in.
- **Ten Indian languages** — English, Hindi, Tamil, Telugu, Bengali, Marathi, Punjabi, Gujarati, Kannada, Odia.

## Real vs. staged

Gemini calls, multilingual output, and the advisory + diagnostic pipelines are all live. Satellite and soil telemetry are curated fixtures for the demo; production swaps them for Copernicus / IMD / Soil Health Card ingest. The federated registry is in-memory; production uses Postgres with `verified_by` fields and version history.

## Run locally

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env.local
npm run dev