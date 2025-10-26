# MezzAI Modular Demo Dashboard

This repository contains a **modular, tenant-configurable** demo dashboard for your AI consulting showcase.
It matches the design we discussed:
- Each module is in `/public/js/modules/*`
- Shared plumbing is in `/public/js/core/*`
- Tenant flags live in Firebase (recommended), but there's also a local fallback loader for development via `/public/config/local-tenant.json`.
- Seeded data is **opt-in** only (Analytics Narrator, Policy/FAQ Bot, Pie Dashboard), and lives under `/public/demo-data` or can be loaded from Firebase/Storage.

> Created: 2025-10-26T03:15:54.177220

## Current Live Modules
- GPT Playground
- Email Draft
- Lead Classifier
- Live Pie Dashboard (seeded)
- Mini Chat

## Planned Modules (stubs included)
- Analytics Narrator (seeded, with Download Example JSON + Upload your JSON)
- Policy / FAQ Bot (seeded YouTube ToS; Download PDF link)
- Message Insights (Classifier + Churn Screener) [no seed]
- Calendar Concierge (date range, 9–5, public-calendar checks) [no seed]
- Prospect Plan Generator (internal; enrichment + sequence + Peter/Ease scores) [optional demo seed]
- CRM Sync (future)

## Dev Quickstart (local without Firebase)
1. Open `public/index.html` using a local web server (e.g. `python3 -m http.server` in the `public/` directory).
2. Edit `/public/config/local-tenant.json` to toggle modules on/off.
3. Seeded demo files live under `/public/demo-data` and `/public/storage` (as Storage stand-ins).

## Firebase (recommended in prod)
- Store tenant flags under `/config/tenants/<tenant>`
- Store module blurbs under `/config/modules/<moduleId>/blurb`
- Store seeded data under `/data/demo/...`
- Store big assets (PDF/large JSON) in Storage: `/public/...`

See `/config/firebase.sample.db.json` for example documents and paths.
See `/config/firebase.rules.sample.txt` for a starting point of security rules (you must customize).
