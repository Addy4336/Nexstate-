# NexState AI Platform - Technical Architecture Documentation

## 1. System Overview & Monorepo Architecture

The **NexState AI** platform is built as an enterprise-grade real estate management system and AI portfolio showcase operating on a Monorepo architecture managed via **Turborepo** and powered by the **Bun** package manager. 

The application is segregated into two core decoupled Next.js workspaces:
1. **`nexstate-cms`**: Admin CMS Portal, REST API Engine (Elysia.js + AI Routes), and Core Backend Data Services running on `http://localhost:3001`.
2. **`nexstate-frontend`**: Public Customer Web Application, AI Property Assistant, Showcase, and Financial Suite running on `http://localhost:3000`.

---

## 2. API-First Backend Engine & Database Architecture

### 2.1 Elysia.js REST API & AI Engine
Backend services are executed using **Elysia.js**, hosted seamlessly inside Next.js 16 App Router using dynamic catch-all route handlers at `nexstate-cms/src/app/api/[[...slugs]]/route.ts`.

Interactive OpenAPI/Swagger documentation is automatically generated and exposed at:
`http://localhost:3001/api/docs`

Key AI Endpoints:
- `POST /api/ai/parse-search`: Natural Language property search query parser.
- `POST /api/ai/recommend`: Multi-attribute vector similarity matching engine.
- `POST /api/ai/generate-description`: Admin CMS AI content copilot.

### 2.2 Database Architecture & Supabase Free Plan
- **Database Engine**: PostgreSQL hosted on Supabase Free Tier (`alcpdzxlsdkpkqhtewfx.supabase.co`).
- **Connection Modes**:
  - `supabaseAdmin`: Bypasses RLS with `SUPABASE_SERVICE_ROLE_KEY` for server-side API operations.
  - `supabase`: Client with `NEXT_PUBLIC_SUPABASE_ANON_KEY` for public read operations where applicable.
- **Key Database Tables**:
  - `user` / `session` / `account`: User identities, RBAC roles (`admin`, `manager`, `agent`, `user`).
  - `property`: Rental listings, amenities, pricing, availability, cover image, drive folder ID.
  - `enquiry`: Prospect leads, inquiry status, Zoho CRM sync state.
  - `blog`: Rich-text content articles, author info, publication status.
  - `faq`: Dynamic FAQ categories and item mappings.

---

## 3. Security & Authentication Architecture

### 3.1 Authentication Framework
- **Better Auth & Custom Auth Context**: Session-based auth with secure HTTP-only cookies and bearer tokens.
- **Password Hashing**: `bcryptjs` salted password hashing.
- **RBAC (Role-Based Access Control)**: Granular permission guards defined in `src/lib/rbac.ts`:
  - Roles: `ADMIN`, `MANAGER`, `AGENT`, `USER`.
  - Guards: `requireAdmin()`, `requirePermission()`, and Next.js route protection proxy (`src/proxy.ts`).

---

## 4. Third-Party Integrations & External Services

| Integration | Purpose | Configuration Keys |
| :--- | :--- | :--- |
| **Zoho CRM** | Automatic lead creation, deal sync, and enquiry tracking | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` |
| **Google Drive API** | Cloud storage for property images, floorplans, and video walk-throughs | `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET` |
| **Resend** | Transactional emails (invite credentials, admin alerts) | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| **OpenAI / Gemini** | Optional API Key for enhanced AI LLM Copilot routines | `OPENAI_API_KEY` |

---

## 5. Technology Stack Summary

- **Framework**: Next.js 16 (App Router, Webpack/Turbopack compatibility)
- **Runtime & Package Manager**: Bun 1.3.1
- **API Engine**: Elysia.js 1.4 + `@elysiajs/swagger`
- **Database & Auth**: Supabase PostgreSQL (Free Tier), Better Auth, `bcryptjs`
- **AI Intelligence**: Natural Language Parser, Vector Similarity Scoring Engine, AI Copy Copilot
- **Frontend UI & Styling**: Tailwind CSS v4, Radix UI Primitives, Framer Motion
- **Form & Validation**: React Hook Form, Zod
- **Rich Text Editor**: Tiptap (`@tiptap/react`)
- **Task Automation**: Node Cron (`node-cron`)
