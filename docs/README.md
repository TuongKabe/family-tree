---
project: AncestorTree
path: docs/README.md
type: index
version: 1.0.0
updated: 2026-02-24
owner: "@pm"
status: approved
---

# AncestorTree Documentation

> Gia Phả Điện Tử - Họ Đặng làng Kỷ Các

## SDLC Framework v6.1.0 - LITE Tier

This project uses the **LITE** tier of the MTS SDLC Framework with 5 stages:

```
docs/
├── 00-foundation/     # Vision, scope, requirements
├── 01-planning/       # Roadmap, sprints, milestones
├── 02-design/         # Architecture, UI/UX, data models
├── 04-build/          # Implementation guidelines, code standards
└── 05-test/           # Test plans, test cases, QA
```

## Quick Links

- [Vision & Scope](./00-foundation/VISION.md)
- [Sprint Plan](./01-planning/SPRINT-PLAN.md)
- [System Architecture](./02-design/SYSTEM-DESIGN.md)
- [Database Schema](./02-design/DATABASE-SCHEMA.md)

## Project Structure

```
AncestorTree/
├── docs/              # Documentation (SDLC LITE)
├── frontend/          # Next.js 16 + React 19 + Tailwind
├── supabase/          # Database migrations
└── README.md
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel (frontend), Supabase Cloud (backend)
