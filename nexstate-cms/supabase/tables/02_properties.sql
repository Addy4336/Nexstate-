-- Properties table
create table if not exists "property" (
  id text primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric not null,
  location text not null,
  bedrooms integer default 0,
  bathrooms integer default 0,
  area_sqft integer,
  status text default 'available', -- available, rented, sold, maintenance
  images text[], -- Array of image URLs
  cover_image text[],
  drive_folder_id text,
  featured boolean default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Create indexes for property table
CREATE INDEX IF NOT EXISTS property_status_idx ON property(status);
CREATE INDEX IF NOT EXISTS property_featured_idx ON property(featured);
CREATE INDEX IF NOT EXISTS property_location_idx ON property(location);

-- Enable Row Level Security
ALTER TABLE "property" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property table
-- Public can view available/featured properties
CREATE POLICY "public_view_available_properties" ON "property"
  FOR SELECT USING (status = 'available' OR featured = true);

-- Admins can view all properties
CREATE POLICY "admin_view_all_properties" ON "property"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

-- Admins can insert/update/delete properties
CREATE POLICY "admin_manage_properties" ON "property"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_update_properties" ON "property"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_delete_properties" ON "property"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );
