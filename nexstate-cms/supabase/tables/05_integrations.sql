-- Zoho Integration Tables
-- These tables are now PER-ADMIN instead of global
-- Each admin can connect their own Zoho account

-- Zoho Tokens Table (Per Admin)
CREATE TABLE IF NOT EXISTS zoho_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  api_domain TEXT DEFAULT 'https://www.zohoapis.in',
  expires_at TIMESTAMP, -- When ACCESS token expires (refresh tokens are long-lived, ~year+)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT zoho_tokens_admin_unique UNIQUE (admin_id)
);

COMMENT ON TABLE zoho_tokens IS 'Stores Zoho OAuth tokens per admin user';
COMMENT ON COLUMN zoho_tokens.admin_id IS 'The admin user who connected this Zoho account';
COMMENT ON COLUMN zoho_tokens.expires_at IS 'When the ACCESS token expires (not refresh token - refresh tokens are long-lived)';

CREATE INDEX IF NOT EXISTS idx_zoho_tokens_admin_id ON zoho_tokens(admin_id);

ALTER TABLE zoho_tokens ENABLE ROW LEVEL SECURITY;

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


-- Zoho Creator Configuration Table (Per Admin)
CREATE TABLE IF NOT EXISTS zoho_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  owner_name TEXT,
  app_name TEXT,
  form_name TEXT,
  report_name TEXT,
  field_mapping JSONB DEFAULT '{}',
  auto_sync BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT zoho_config_admin_unique UNIQUE (admin_id)
);

COMMENT ON TABLE zoho_config IS 'Stores Zoho Creator app configuration per admin user';
COMMENT ON COLUMN zoho_config.admin_id IS 'The admin user who configured this Zoho Creator integration';

CREATE INDEX IF NOT EXISTS idx_zoho_config_admin_id ON zoho_config(admin_id);

ALTER TABLE zoho_config ENABLE ROW LEVEL SECURITY;

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
