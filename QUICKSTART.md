# 🚀 Quick Start - Turborepo Migration

## Run the Migration Script

```powershell
# From project root
.\migrate-to-turborepo.ps1
```

## Install Dependencies

```bash
bun install
```

## Run Development

### Option 1: Run All Apps (Recommended)
```bash
bun run dev
```

This will start:
- CMS on http://localhost:3001
- Frontend on http://localhost:5173

### Option 2: Run Individual Apps
```bash
# Terminal 1 - CMS
cd apps/cms
bun run dev

# Terminal 2 - Frontend
cd apps/frontend
bun run dev
```

## Build All Apps

```bash
bun run build
```

## Project Structure After Migration

```
nexstate_cms/
├── apps/
│   ├── cms/              # Next.js CMS (port 3001)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   └── frontend/         # Vite React (port 5173)
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
├── packages/            # For shared code (future)
├── turbo.json          # Turborepo config
├── package.json        # Root workspace
└── README.md
```

## Verify Migration

1. Check CMS: http://localhost:3001
2. Check Frontend: http://localhost:5173
3. Verify API routes work
4. Check database connections

## Troubleshooting

### If apps don't start:
```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules
bun install
```

### If you see "Module not found":
```bash
cd apps/cms && bun install
cd apps/frontend && bun install
```

## Next Steps

1. ✅ Verify both apps work correctly
2. ✅ Test all features (auth, database, API)
3. ✅ Remove old files from root (optional):
   ```powershell
   # Only after verifying everything works!
   # Remove-Item -Path "src" -Recurse -Force
   ```

## Benefits You'll Get

- ⚡ Parallel dev/build execution
- 📦 Better dependency management
- 🎯 Clear separation of concerns
- 🔄 Easy to add more apps/packages
- 💾 Intelligent build caching

For detailed documentation, see [TURBOREPO_MIGRATION.md](./TURBOREPO_MIGRATION.md)
