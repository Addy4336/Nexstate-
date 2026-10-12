# Database Migration: PostgreSQL Pool → Supabase Client

## Summary
Migrated from direct PostgreSQL pool connections (`pg` library) to Supabase JavaScript client to fix module resolution issues in Next.js.

## Problem
The `pg` library was trying to require `fs` module which doesn't exist in browser/edge runtime contexts, causing:
```
Module not found: Can't resolve 'fs'
```

## Solution
Replaced all `pool` usage with `supabaseAdmin` (service role) and `supabase` (anon key) clients.

## Files Updated

### ✅ Core Database Files
- [x] `src/lib/db.ts` - Replaced pg Pool with Supabase clients
- [x] `src/lib/zoho-crm.ts` - Updated all pool.connect() calls
- [x] `src/lib/google-drive.ts` - Updated all pool.connect() calls  
- [x] `src/app/api/auth/zoho/revoke/route.ts` - Updated DELETE endpoint

### ⚠️ Files Still Needing Migration
The following files still use `pool.connect()` and need to be updated:

#### Library Files
- [ ] `src/lib/dashboard.ts` (2 occurrences)
- [ ] `src/lib/enquiries.ts` (4 occurrences)
- [ ] `src/lib/properties.ts` (5 occurrences)

#### Action Files  
- [ ] `src/actions/admin-setup-actions.ts`
- [ ] `src/actions/blog-actions.ts`
- [ ] `src/actions/enquiry-actions.ts`
- [ ] `src/actions/faq-actions.ts`
- [ ] `src/actions/favorite-actions.ts`
- [ ] `src/actions/property-actions.ts`
- [ ] `src/actions/property-search-actions.ts`

#### Page Files
- [ ] `src/app/admin/(dashboard)/users/page.tsx`
- [ ] `src/app/admin/(dashboard)/faqs/page.tsx`
- [ ] `src/app/admin/(dashboard)/properties/page.tsx`
- [ ] `src/app/admin/(dashboard)/faqs/[id]/edit/page.tsx`
- [ ] `src/app/admin/(dashboard)/marketing/faqs/[id]/edit/page.tsx`
- [ ] `src/app/admin/(dashboard)/properties/[id]/edit/page.tsx`
- [ ] `src/app/admin/(dashboard)/marketing/page.tsx`

#### Script Files
- [ ] `src/scripts/add-drive-folder-column.ts`
- [ ] `src/scripts/check-property-schema.ts`
- [ ] `src/scripts/check-zoho-tokens.ts`
- [ ] `src/scripts/setup-blog-db.ts`
- [ ] `src/scripts/setup-google-db.ts`
- [ ] `src/scripts/setup-faq-db.ts`

## Migration Pattern

### Before (PostgreSQL Pool)
```typescript
import { pool } from "@/lib/db";

const client = await pool.connect();
try {
    const result = await client.query("SELECT * FROM table WHERE id = $1", [id]);
    return result.rows[0];
} finally {
    client.release();
}
```

### After (Supabase Client)
```typescript
import { supabaseAdmin } from "@/lib/db";

const { data, error } = await supabaseAdmin
    .from("table")
    .select("*")
    .eq("id", id)
    .single();

if (error) throw error;
return data;
```

## Supabase Client Reference

### Admin Client (Service Role - Bypasses RLS)
```typescript
import { supabaseAdmin } from "@/lib/db";

// INSERT
const { data, error } = await supabaseAdmin
    .from("table_name")
    .insert({ column: value });

// UPDATE  
const { data, error } = await supabaseAdmin
    .from("table_name")
    .update({ column: value })
    .eq("id", id);

// DELETE
const { data, error } = await supabaseAdmin
    .from("table_name")
    .delete()
    .eq("id", id);

// SELECT single
const { data, error } = await supabaseAdmin
    .from("table_name")
    .select("*")
    .eq("id", id)
    .single();

// SELECT multiple
const { data, error } = await supabaseAdmin
    .from("table_name")
    .select("*")
    .eq("status", "active");

// Complex queries
const { data, error } = await supabaseAdmin
    .from("table_name")
    .select("*, related_table(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10);
```

### Anon Client (Respects RLS)
```typescript
import { supabase } from "@/lib/db";

// Use same API as admin client
// But RLS policies will be enforced
```

## Next Steps

1. Test that Zoho integration works with new Supabase client
2. Migrate remaining library files (dashboard, enquiries, properties)
3. Migrate action files
4. Migrate page files
5. Update or remove migration scripts

## Benefits

✅ No more `fs` module errors
✅ Works in edge runtime
✅ Better TypeScript support
✅ Automatic connection pooling
✅ Built-in RLS support
✅ Simpler API (no manual release() calls)

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Note: `DATABASE_URL` is no longer needed for application code.
