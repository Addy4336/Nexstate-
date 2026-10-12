-- Migration: Fix Zoho Integration to be Per-Admin instead of Global
-- Created: 2026-02-06
-- This migration:
-- 1. Adds admin_id to zoho_tokens (with UUID)
-- 2. Adds admin_id to zoho_config (with UUID)
-- 3. Removes single-row constraints
-- 4. Updates RLS policies to be admin-specific
-- 5. Migrates existing data to first admin

-- Step 1: Backup existing data (optional - can manually retrieve if needed)
-- SELECT * FROM zoho_tokens;
-- SELECT * FROM zoho_config;

-- Step 2: Drop existing constraints and add admin_id columns
ALTER TABLE zoho_tokens DROP CONSTRAINT IF EXISTS zoho_tokens_single_row;
ALTER TABLE zoho_config DROP CONSTRAINT IF EXISTS zoho_config_single_row;

-- Step 3: Modify zoho_tokens table
-- Create temporary table with new structure
CREATE TABLE zoho_tokens_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    api_domain TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copy existing data (will be updated with admin_id in next step)
INSERT INTO zoho_tokens_new (access_token, refresh_token, api_domain, expires_at, created_at, updated_at)
SELECT access_token, refresh_token, api_domain, expires_at, created_at, updated_at
FROM zoho_tokens;

-- Drop old table and rename new one
DROP TABLE zoho_tokens;
ALTER TABLE zoho_tokens_new RENAME TO zoho_tokens;

-- Step 4: Modify zoho_config table
-- Create temporary table with new structure
CREATE TABLE zoho_config_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
    owner_name TEXT,
    app_name TEXT,
    form_name TEXT,
    report_name TEXT,
    field_mapping JSONB DEFAULT '{}'::jsonb,
    auto_sync BOOLEAN DEFAULT false,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copy existing data (will be updated with admin_id in next step)
INSERT INTO zoho_config_new (owner_name, app_name, form_name, report_name, field_mapping, auto_sync, last_synced_at, created_at, updated_at)
SELECT owner_name, app_name, form_name, report_name, field_mapping, auto_sync, last_synced_at, created_at, updated_at
FROM zoho_config;

-- Drop old table and rename new one
DROP TABLE zoho_config;
ALTER TABLE zoho_config_new RENAME TO zoho_config;

-- Step 5: Migrate existing single-row data to first admin (if exists)
-- Find the first admin user
DO $$
DECLARE
    first_admin_id TEXT;
BEGIN
    -- Get the first admin user
    SELECT id INTO first_admin_id
    FROM "user"
    WHERE role = 'admin'
    ORDER BY created_at ASC
    LIMIT 1;

    -- Update zoho_tokens with first admin's ID
    IF first_admin_id IS NOT NULL THEN
        UPDATE zoho_tokens
        SET admin_id = first_admin_id
        WHERE admin_id IS NULL;

        -- Update zoho_config with first admin's ID
        UPDATE zoho_config
        SET admin_id = first_admin_id
        WHERE admin_id IS NULL;

        RAISE NOTICE 'Migrated Zoho data to admin: %', first_admin_id;
    ELSE
        RAISE NOTICE 'No admin users found - manual admin_id assignment required';
    END IF;
END $$;

-- Step 6: Make admin_id NOT NULL
ALTER TABLE zoho_tokens ALTER COLUMN admin_id SET NOT NULL;
ALTER TABLE zoho_config ALTER COLUMN admin_id SET NOT NULL;

-- Step 7: Add unique constraint per admin
ALTER TABLE zoho_tokens ADD CONSTRAINT zoho_tokens_admin_unique UNIQUE (admin_id);
ALTER TABLE zoho_config ADD CONSTRAINT zoho_config_admin_unique UNIQUE (admin_id);

-- Step 8: Update RLS policies to be admin-specific
DROP POLICY IF EXISTS "admin_view_zoho_tokens" ON zoho_tokens;
DROP POLICY IF EXISTS "admin_manage_zoho_tokens" ON zoho_tokens;
DROP POLICY IF EXISTS "service_full_access_zoho_tokens" ON zoho_tokens;

CREATE POLICY "admin_view_own_zoho_tokens" ON zoho_tokens
  FOR SELECT USING (
    admin_id::text = current_setting('app.current_user_id', true)
    AND EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = admin_id 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_manage_own_zoho_tokens" ON zoho_tokens
  FOR ALL USING (
    admin_id::text = current_setting('app.current_user_id', true)
    AND EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = admin_id 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "service_full_access_zoho_tokens" ON zoho_tokens
  FOR ALL USING (true);

-- Update zoho_config RLS policies
DROP POLICY IF EXISTS "admin_view_zoho_config" ON zoho_config;
DROP POLICY IF EXISTS "admin_manage_zoho_config" ON zoho_config;
DROP POLICY IF EXISTS "service_full_access_zoho_config" ON zoho_config;

CREATE POLICY "admin_view_own_zoho_config" ON zoho_config
  FOR SELECT USING (
    admin_id::text = current_setting('app.current_user_id', true)
    AND EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = admin_id 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_manage_own_zoho_config" ON zoho_config
  FOR ALL USING (
    admin_id::text = current_setting('app.current_user_id', true)
    AND EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = admin_id 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "service_full_access_zoho_config" ON zoho_config
  FOR ALL USING (true);

-- Step 9: Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_zoho_tokens_admin_id ON zoho_tokens(admin_id);
CREATE INDEX IF NOT EXISTS idx_zoho_config_admin_id ON zoho_config(admin_id);

-- Step 10: Update table comments
COMMENT ON TABLE zoho_tokens IS 'Stores Zoho OAuth tokens per admin user';
COMMENT ON COLUMN zoho_tokens.admin_id IS 'The admin user who connected this Zoho account';
COMMENT ON COLUMN zoho_tokens.expires_at IS 'When the ACCESS token expires (not refresh token - refresh tokens are long-lived)';

COMMENT ON TABLE zoho_config IS 'Stores Zoho Creator app configuration per admin user';
COMMENT ON COLUMN zoho_config.admin_id IS 'The admin user who configured this Zoho Creator integration';

-- Verification queries (uncomment to run)
-- SELECT id, admin_id, api_domain, created_at FROM zoho_tokens;
-- SELECT id, admin_id, app_name, form_name FROM zoho_config;
