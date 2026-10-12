# 🚀 Phase 1: Quick Reference Guide

## Essential Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## File Locations

### Authentication
- **Middleware:** `src/middleware.ts`
- **Server Utils:** `src/lib/auth-utils.ts`
- **Client Context:** `src/lib/auth-context.tsx`
- **RBAC:** `src/lib/rbac.ts`
- **Config:** `src/lib/auth.ts`

### Pages
- **Login:** `src/app/admin/(auth)/login/page.tsx`
- **Setup:** `src/app/admin/(auth)/setup/page.tsx`
- **Dashboard:** `src/app/admin/(dashboard)/dashboard/page.tsx`

## Common Usage Patterns

### Protect a Server Component
```typescript
import { requireAdmin } from "@/lib/auth-utils";

export default async function Page() {
  await requireAdmin();
  // Your protected content
}
```

### Check Permission in Client Component
```typescript
"use client";
import { usePermission } from "@/lib/auth-context";

function MyComponent() {
  const canDelete = usePermission("properties:delete");
  if (!canDelete) return null;
  // Your UI
}
```

### Get Current User
```typescript
import { getCurrentUser } from "@/lib/auth-utils";

const user = await getCurrentUser();
if (user) {
  console.log(user.email, user.role);
}
```

## Permissions List

**Admin:**
- `properties:*` (read, create, update, delete)
- `users:*` (read, create, update, delete)
- `analytics:read`
- `settings:manage`

**User:**
- `properties:read`

## Default Credentials

**Email:** `admin@nexstate.ai`  
**Password:** Set via `/admin/setup`

## Environment Variables

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-here
```

## Testing Checklist

- [ ] Access `/admin/dashboard` without login → Redirects to login
- [ ] Login with admin → Access granted
- [ ] Session persists across reloads
- [ ] Logout works correctly
- [ ] Setup page works for initial password

## Troubleshooting

**Can't access admin pages?**
- Check if logged in
- Verify user has admin role in database

**Login not working?**
- Clear cookies
- Check database connection
- Verify password was set via setup

**Build errors?**
- Run `bun install`
- Delete `.next` folder

---

For detailed documentation, see [PHASE1_IMPLEMENTATION.md](PHASE1_IMPLEMENTATION.md)
