# nexstate Turborepo Migration Guide

This guide will help you complete the Turborepo migration for the nexstate CMS project.

## 🏗️ Project Structure

```
nexstate_cms/
├── apps/
│   ├── cms/           # Next.js CMS application (main app)
│   └── frontend/      # Vite React frontend
├── packages/          # Shared packages (optional, for future use)
├── turbo.json         # Turborepo configuration
├── package.json       # Root workspace configuration
└── README.md
```

## 📦 Migration Steps

### Step 1: Move Files to apps/cms

Run these PowerShell commands from the project root:

```powershell
# Create the cms app directory structure
New-Item -ItemType Directory -Path "apps/cms" -Force

# Copy main source folders
Copy-Item -Path "src" -Destination "apps/cms/src" -Recurse -Force
Copy-Item -Path "public" -Destination "apps/cms/public" -Recurse -Force

# Copy configuration files
Copy-Item -Path "components.json" -Destination "apps/cms/components.json" -Force
Copy-Item -Path "eslint.config.mjs" -Destination "apps/cms/eslint.config.mjs" -Force
Copy-Item -Path "next-env.d.ts" -Destination "apps/cms/next-env.d.ts" -Force
Copy-Item -Path "next.config.ts" -Destination "apps/cms/next.config.ts" -Force
Copy-Item -Path "postcss.config.mjs" -Destination "apps/cms/postcss.config.mjs" -Force
Copy-Item -Path "tailwind.config.ts" -Destination "apps/cms/tailwind.config.ts" -Force
Copy-Item -Path "tsconfig.json" -Destination "apps/cms/tsconfig.json" -Force

# Copy environment files (IMPORTANT)
Copy-Item -Path ".env.local" -Destination "apps/cms/.env.local" -Force -ErrorAction SilentlyContinue
```

### Step 2: Move Frontend to apps/frontend

```powershell
# Copy the entire frontend folder
Copy-Item -Path "src/frontend/*" -Destination "apps/frontend/" -Recurse -Force

# The frontend should now have:
# - src/
# - public/
# - vite.config.ts
# - package.json (already created)
# - etc.
```

### Step 3: Remove src/frontend from CMS

```powershell
# Remove the frontend folder from cms/src
Remove-Item -Path "apps/cms/src/frontend" -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 4: Create README files for each app

```powershell
# Create README for CMS
@"
# nexstate CMS

Next.js-based Content Management System for nexstate.

## Development

\`\`\`bash
bun run dev
\`\`\`

## Build

\`\`\`bash
bun run build
\`\`\`
"@ | Out-File -FilePath "apps/cms/README.md" -Encoding utf8

# Create README for Frontend
@"
# nexstate Frontend

Vite + React frontend application.

## Development

\`\`\`bash
bun run dev
\`\`\`

## Build

\`\`\`bash
bun run build
\`\`\`
"@ | Out-File -FilePath "apps/frontend/README.md" -Encoding utf8
```

### Step 5: Create .gitignore for each app

```powershell
# Create .gitignore for CMS
@"
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/

# production
build
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
"@ | Out-File -FilePath "apps/cms/.gitignore" -Encoding utf8

# Create .gitignore for Frontend
@"
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
"@ | Out-File -FilePath "apps/frontend/.gitignore" -Encoding utf8
```

### Step 6: Install Dependencies

```bash
# Install root dependencies (Turbo)
bun install

# The workspaces should automatically install dependencies for apps
```

### Step 7: Clean Up Root Directory (Optional)

After verifying everything works, you can remove the old files from root:

```powershell
# DO NOT DO THIS UNTIL YOU VERIFY APPS WORK!
# Remove old src folder
# Remove-Item -Path "src" -Recurse -Force
# Remove-Item -Path "public" -Recurse -Force
# Remove old config files...
```

## 🚀 Running the Monorepo

### Development

```bash
# Run all apps in development
bun run dev

# Run only CMS
cd apps/cms && bun run dev

# Run only Frontend
cd apps/frontend && bun run dev
```

### Build

```bash
# Build all apps
bun run build

# Build specific app
cd apps/cms && bun run build
```

### Parallel Development (Turborepo Power!)

Turborepo will intelligently cache builds and run tasks in parallel:

```bash
# This runs dev for all apps simultaneously
bun run dev
```

## 🔧 Configuration Details

### Root package.json

- Defines workspaces for `apps/*` and `packages/*`
- Uses Bun as package manager
- Turbo scripts for parallel execution

### turbo.json

- Defines task pipeline
- Caching strategy for builds
- Dependency between tasks

### Individual App package.json

- Each app has its own dependencies
- Scoped names: `@nexstate/cms` and `@nexstate/frontend`
- Independent scripts

## 📝 Environment Variables

Make sure to copy `.env.local` to each app that needs it:

```bash
apps/cms/.env.local       # For CMS (API routes, database, etc.)
apps/frontend/.env.local  # If frontend needs separate env vars
```

## 🎯 Benefits of Turborepo

1. **Parallel Execution**: Run dev/build for multiple apps simultaneously
2. **Intelligent Caching**: Turbo caches build outputs
3. **Task Pipelines**: Define dependencies between tasks
4. **Better Organization**: Separate concerns between apps
5. **Scalability**: Easy to add more apps/packages

## 🔄 Future Enhancements

### Shared Packages

You can create shared packages in `packages/`:

```
packages/
├── ui/              # Shared UI components
├── config/          # Shared configuration
├── types/           # Shared TypeScript types
└── utils/           # Shared utilities
```

Example: `packages/ui/package.json`

```json
{
  "name": "@nexstate/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

Then import in apps:

```typescript
// apps/cms/src/components/MyComponent.tsx
import { Button } from "@nexstate/ui";
```

## ⚠️ Important Notes

1. **Port Configuration**: CMS runs on port 3001, frontend on default Vite port (5173)
2. **API Proxy**: Frontend should proxy API calls to CMS in development
3. **Shared Types**: Consider creating a shared types package for API contracts
4. **Database**: Only CMS app should connect to database directly

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules
bun install
```

### Turbo cache issues

```bash
# Clear Turbo cache
rm -rf .turbo
bun run build
```

### Port conflicts

Check if ports 3001 (CMS) and 5173 (Frontend) are available.

## 📚 Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)
- [Workspace Configuration](https://turbo.build/repo/docs/handbook/workspaces)
