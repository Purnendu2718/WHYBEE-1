# Integrated Student ERP Management System (College ERP)

A full-stack, role-based Integrated Student ERP System built with **Next.js 14 App Router**, **Supabase (Postgres + Auth + RLS)**, **Tailwind CSS**, and **Recharts**.

---

## 📁 Repository Directory Structure

```
ERP PROTO 1/
├── frontend/                # Next.js 14 Frontend Application
│   ├── app/                 # App Router (Pages, API Routes, Middleware)
│   ├── components/          # React Components (Shared, Admin, Student, Parent)
│   ├── lib/                 # Utility functions & Supabase clients
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies & Next.js scripts
│   └── tsconfig.json        # TypeScript & Tailwind configurations
└── backend/                 # Database, Migrations & ETL Tools
    ├── supabase/
    │   └── migrations/      # SQL Schema & Row-Level Security (RLS) policies
    ├── scripts/             # Database seeding scripts (seed.ts)
    ├── data/                # Sample datasets (CSV)
    └── package.json         # Backend script runners
```

---

## 🚀 Quick Start Guide

### 1. Frontend Setup & Local Development Server

```bash
cd frontend
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 2. Backend & Database Seeding

Set up your Supabase project credentials in `backend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then run the database seeder:

```bash
cd backend
npm install
npm run seed
```

---

## 🔒 Security & Architecture Overview

- **Frontend**: Next.js App Router with Server-Side Rendering (SSR) and custom Middleware for role-based navigation guards (`/student/*`, `/parent/*`, `/admin/*`).
- **Backend & Database**: Supabase PostgreSQL with defense-in-depth Row Level Security (RLS) policies to ensure users can only query their authorized data rows.
- **Git Hygiene**: `node_modules/`, `.next/`, build cache, and `.env.local` are strictly ignored across the workspace.
