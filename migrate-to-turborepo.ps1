# nexstate Turborepo Migration Script
# Run this script from the project root

Write-Host "🚀 Starting Turborepo Migration..." -ForegroundColor Green
Write-Host ""

# Step 1: Create directory structure
Write-Host "📁 Step 1: Creating directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "apps/cms" -Force | Out-Null
New-Item -ItemType Directory -Path "apps/frontend" -Force | Out-Null
New-Item -ItemType Directory -Path "packages" -Force | Out-Null
Write-Host "✅ Directories created" -ForegroundColor Green
Write-Host ""

# Step 2: Copy CMS files
Write-Host "📦 Step 2: Copying CMS files to apps/cms..." -ForegroundColor Cyan
$cmsFiles = @('src', 'public', 'components.json', 'eslint.config.mjs', 'next-env.d.ts', 'next.config.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'tsconfig.json')
foreach ($file in $cmsFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "apps/cms/$file" -Recurse -Force
        Write-Host "  ✓ Copied $file" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠ Skipped $file (not found)" -ForegroundColor Yellow
    }
}

# Copy .env.local if it exists
if (Test-Path ".env.local") {
    Copy-Item -Path ".env.local" -Destination "apps/cms/.env.local" -Force
    Write-Host "  ✓ Copied .env.local" -ForegroundColor Gray
}
Write-Host "✅ CMS files copied" -ForegroundColor Green
Write-Host ""

# Step 3: Copy Frontend files
Write-Host "📦 Step 3: Copying Frontend files to apps/frontend..." -ForegroundColor Cyan
if (Test-Path "src/frontend") {
    $frontendFiles = Get-ChildItem -Path "src/frontend" -Exclude "node_modules"
    foreach ($file in $frontendFiles) {
        Copy-Item -Path $file.FullName -Destination "apps/frontend/$($file.Name)" -Recurse -Force
        Write-Host "  ✓ Copied $($file.Name)" -ForegroundColor Gray
    }
    Write-Host "✅ Frontend files copied" -ForegroundColor Green
} else {
    Write-Host "  ⚠ src/frontend not found, skipping" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Remove frontend from CMS
Write-Host "🗑️  Step 4: Removing frontend from CMS src..." -ForegroundColor Cyan
if (Test-Path "apps/cms/src/frontend") {
    Remove-Item -Path "apps/cms/src/frontend" -Recurse -Force
    Write-Host "✅ Frontend removed from CMS" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No frontend folder in CMS, skipping" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Create README files
Write-Host "📝 Step 5: Creating README files..." -ForegroundColor Cyan

$cmsReadme = @"
# nexstate CMS

Next.js-based Content Management System for nexstate.

## Development

``````bash
bun run dev
``````

## Build

``````bash
bun run build
``````

## Port

Runs on port 3001
"@
$cmsReadme | Out-File -FilePath "apps/cms/README.md" -Encoding utf8 -Force

$frontendReadme = @"
# nexstate Frontend

Vite + React frontend application.

## Development

``````bash
bun run dev
``````

## Build

``````bash
bun run build
``````
"@
$frontendReadme | Out-File -FilePath "apps/frontend/README.md" -Encoding utf8 -Force
Write-Host "✅ README files created" -ForegroundColor Green
Write-Host ""

# Step 6: Create .gitignore files
Write-Host "🙈 Step 6: Creating .gitignore files..." -ForegroundColor Cyan

$cmsGitignore = @"
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

# turbo
.turbo
"@
$cmsGitignore | Out-File -FilePath "apps/cms/.gitignore" -Encoding utf8 -Force

$frontendGitignore = @"
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

# turbo
.turbo
"@
$frontendGitignore | Out-File -FilePath "apps/frontend/.gitignore" -Encoding utf8 -Force
Write-Host "✅ .gitignore files created" -ForegroundColor Green
Write-Host ""

# Step 7: Summary
Write-Host "🎉 Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Install dependencies: bun install" -ForegroundColor White
Write-Host "  2. Test CMS: cd apps/cms && bun run dev" -ForegroundColor White
Write-Host "  3. Test Frontend: cd apps/frontend && bun run dev" -ForegroundColor White
Write-Host "  4. Or run both: bun run dev (from root)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important: Don't delete root src/ folder until you verify apps work!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 See TURBOREPO_MIGRATION.md for more details" -ForegroundColor Cyan
