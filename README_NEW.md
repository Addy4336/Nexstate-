# NexState CMS - Admin Dashboard

Modern, secure, and feature-rich property management system built with Next.js 15, TypeScript, and PostgreSQL.

## 🚀 Project Status

**Current Phase:** Phase 1 ✅ **COMPLETE**

### Completed Features
- ✅ **Authentication System** (Better Auth)
  - Email/password login
  - Session management
  - Password setup flow
- ✅ **Security & Authorization**
  - Middleware route protection
  - Role-based access control (RBAC)
  - Server-side session validation
  - Admin-only route guards
- ✅ **User Interface**
  - Responsive admin dashboard
  - Property management UI
  - User management UI
  - Modern component library (Shadcn/ui)

### In Progress
- 🚧 **Phase 2:** Property CRUD (Edit, Detail, Search)
- 🚧 **Phase 3:** User Management (Create, Edit, Roles)

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Basic knowledge of Next.js and TypeScript

## ⚡ Quick Start

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Environment Setup

Create `.env.local` file (see `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/nexstate_db

# Authentication
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production
```

### 3. Database Setup

Run the migration scripts:

```bash
psql -U username -d nexstate_db -f supabase/tables/01_auth.sql
psql -U username -d nexstate_db -f supabase/tables/02_properties.sql
```

### 4. Start Development Server

```bash
bun run dev
# or
npm run dev
```

Navigate to `http://localhost:3001`

### 5. Initial Admin Setup

1. Go to `http://localhost:3001/admin/setup`
2. Set password for `admin@nexstate.ai`
3. Login at `http://localhost:3001/admin/login`

## 📚 Documentation

- [Phase 1 Implementation Guide](PHASE1_IMPLEMENTATION.md) - Complete authentication setup
- [Code Review & Quality Report](CODE_REVIEW.md) - Code quality analysis

## 🏗️ Tech Stack

### Core
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS

### UI Components
- **Component Library:** Shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Notifications:** Sonner (Toast)

### State Management
- **Server State:** React Query (TanStack Query)
- **Auth Context:** React Context API

## 📁 Project Structure

```
nexstate_cms/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (user)/            # Public-facing pages
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── (auth)/       # Login, setup
│   │   │   └── (dashboard)/  # Protected admin pages
│   │   └── api/              # API routes
│   ├── components/            # React components
│   ├── lib/                  # Utilities & config
│   ├── actions/              # Server actions
│   └── middleware.ts         # Route protection
├── supabase/                 # Database migrations
└── public/                   # Static assets
```

## 🔐 Security Features

- ✅ Middleware-based route protection
- ✅ Server-side session validation
- ✅ bcrypt password hashing
- ✅ CSRF protection
- ✅ SQL injection prevention
- ✅ Role-based access control

## 📝 Environment Variables

See `.env.example` for required variables.

## 🆘 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running

### Authentication Not Working
- Clear browser cookies
- Verify `BETTER_AUTH_SECRET` is set

---

**Last Updated:** December 26, 2025  
**Version:** 1.0.0 (Phase 1 Complete)
