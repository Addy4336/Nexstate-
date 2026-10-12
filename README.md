# NexState CMS - Turborepo Monorepo

Turborepo monorepo containing NexState CMS (Next.js) and frontend (Vite React).

## 📁 Project Structure

```
nexstate_cms/
├── nexstate-cms/        # Next.js CMS (Backend + Admin) - Port 3001
├── nexstate-frontend/   # Vite React (User Frontend) - Port 3000
├── package.json          # Root workspace config
└── turbo.json           # Turborepo configuration
```

## 🚀 Quick Start

### Install Dependencies

```bash
bun install
```

### Run Both Apps

```bash
bun run dev
```

- **CMS**: http://localhost:3001
- **Frontend**: http://localhost:3000

### Run Individual Apps

**CMS:**
```bash
cd nexstate-cms && bun run dev
```

**Frontend:**
```bash
cd nexstate-frontend && bun run dev
```

## 🏗️ Build

```bash
# Build all
bun run build

# Build individual
cd nexstate-cms && bun run build
cd nexstate-frontend && bun run build
```

## 🔧 Tech Stack

### CMS (nexstate-cms)
- Next.js 16 + App Router
- Supabase (PostgreSQL)
- Better Auth
- Tailwind CSS + shadcn/ui
- Zoho Creator & Google Drive integrations

### Frontend (nexstate-frontend)
- Vite + React 18
- React Router
- React Query
- Tailwind CSS + shadcn/ui

## 📝 Environment Variables

Create `.env.local` in `nexstate-cms/`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3001
```

## 🚢 Deployment

- **CMS**: Deploy to Vercel (point to `nexstate-cms/`)
- **Frontend**: Deploy to Vercel/Netlify (point to `nexstate-frontend/`)

## 📄 License

Proprietary - NexState
