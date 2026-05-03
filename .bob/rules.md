# Project rules — TumorBoardPrep

## What this is

A production-grade clinical prep tool. Oncology fellows paste raw case data into 8 fields; the app sends it to a watsonx.ai Granite endpoint; Granite returns a structured one-page tumor-board card; the app renders and lets the user copy or export it. A "Demo Mode" toggle replaces the form with a guided walkthrough of three pre-built synthetic cases for first-time visitors.

This is a real product, not a demo or prototype. Code quality, error handling, edge cases, accessibility, and developer experience must all be production-ready.

## Tech stack — do not deviate

- Backend: Python 3.11, FastAPI, uvicorn, httpx (for Granite calls), python-dotenv, pydantic v2
- Frontend: React 18, Vite, Tailwind CSS, react-markdown for rendering Granite output
- No database. Stateless service.
- No auth. Single-tenant local app.
- No SDKs for watsonx — direct httpx POST to the REST endpoint, simpler dependency footprint
- One-command bootstrap: `make dev` starts backend on :8000 and frontend on :5173 concurrently
- Docker Compose available as alternative for naive users

## Reference files in /docs (read these before generating any matching code)

- `intake_form.json` — canonical 8-field form schema. Form labels, placeholders, max lengths, validation come from this file. Do NOT invent fields.
- `granite_system_prompt.md` — the validated Granite system prompt. Load it from disk at backend startup. Do NOT modify it programmatically. Do NOT let user input override it.
- `case_*.json` — three synthetic cases for Demo Mode. Use as-is.
- `case_*_expected_output.md` — gold-standard output shape. The result card must render in this format.

## The two modes (this is core to the UX)

**Try It mode (default)** — the real product. Empty form, user pastes their own case data, clicks Generate, sees synthesis. Includes a "Load example" dropdown that pre-fills from /docs/case_*.json so a curious user can see how it works without typing.

**Demo Mode (toggle in header)** — a guided walkthrough for judges and first-time visitors. Three cases auto-advance with narrative captions explaining what's happening. The user does not type anything. There is a "Restart" button and a "Switch to Try It" link. Demo Mode must work offline against a local cache of expected outputs — no Granite call required — so the demo is reliable even if watsonx is rate-limiting or the user lacks credentials.

The toggle is a header switch with two states: **Try It** | **Demo Mode**. Default is Try It. Clicking the toggle changes the entire main view.

## Strict design rules

- The result card renders the seven sections from `case_*_expected_output.md` exactly. Do NOT reformat.
- "Synthetic case for demonstration only" banner appears at the top of the result card whenever an example case or Demo Mode is active.
- Footer disclaimer on every page: "Editorial prep tool for human oncologist review. Not a clinical decision support system. Not for diagnostic use."
- No patient-identifier fields — no name, MRN, DOB, address. The schema in /docs/intake_form.json is the only allowed set of fields.
- Calm, neutral palette: slate-50 backgrounds, slate-900 text, emerald-600 single accent for primary buttons. No gradients, no shadows beyond Tailwind's `shadow-sm`, no decorative icons.

## What this product MUST do well

- Naive-user setup: a non-developer can clone the repo, follow SETUP.md, and have it running in <10 minutes
- Resilient Granite calls: timeout, retry once on 5xx, surface specific error messages on 4xx (auth issue → "check your API key", rate limit → "watsonx rate limit hit, try again in 60s")
- Loading states everywhere a network call happens
- Empty state on the result card before first generation: "Fill the form and click Generate, or switch to Demo Mode to see how it works"
- Copy-as-markdown button on the result card
- Print-friendly result card view (CSS print media query) — fellows will want to print before the board

## What you must NOT do

- Do not invent additional cases — exactly three are in /docs/
- Do not add a database, login, or persistence
- Do not call any AI service other than watsonx.ai Granite
- Do not add medical decision logic beyond what Granite produces
- Do not commit `.env` (only `.env.example`)
- Do not add `console.log`, leftover comments, or TODOs without owner — production code only

## Deliverables to generate at the end of the build

1. `README.md` — for the GitHub repo, naive-user oriented, with quickstart and screenshots-as-text-placeholders
2. `SETUP.md` — extended setup for users without Python or Node installed
3. `submission/PROBLEM_AND_SOLUTION.md` — the 500-word problem-and-solution statement (filled in)
4. `submission/IBM_TECH_USAGE.md` — the IBM tech writeup (filled in, factual, drawn from actual code)
5. `submission/VIDEO_SCRIPT.md` — 3-minute screen-recording script with timing markers
6. `submission/SUBMISSION_CHECKLIST.md` — checklist of what to verify before clicking Submit
7. `bob_sessions/README.md` — instructions for the user to export and add their Bob task histories per the IBM Bob Dev Day Hackathon Guide

## Fallback plan (if Bobcoins run short)

If the user signals "we are running short on Bobcoins", drop features in this order. Do NOT ask for confirmation on each — just apply the trim and tell the user what was cut.

1. Skip the Docker Compose alternative bootstrap (Makefile-only is fine)
2. Skip the print-friendly CSS
3. Skip the retry-on-5xx logic in the Granite client (timeout-only is fine)
4. Skip the "Load example" dropdown in Try It mode (Demo Mode covers the example UX)
5. Skip Stage 9 polish entirely if forced to

Do NOT drop:
- Demo Mode — it's the demo hero, the difference between submitting and submitting well
- The real Granite call working in Try It mode — proves it's a real product, not just a static demo
- Any of the seven deliverable docs — they're required for submission

If something is broken at the deadline window, ship the broken thing with a known-issues note in the README. A broken-but-submitted product scores higher than a polished-but-late one (the latter scores zero).
