-- NexState AI - Supabase Database Schema & Initial Seed Script
-- Platform: Supabase PostgreSQL (Free Plan compatible)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop Existing Tables (If resetting environment)
DROP TABLE IF EXISTS "enquiry" CASCADE;
DROP TABLE IF EXISTS "property" CASCADE;
DROP TABLE IF EXISTS "blog" CASCADE;
DROP TABLE IF EXISTS "faq" CASCADE;
DROP TABLE IF EXISTS "favorite" CASCADE;
DROP TABLE IF EXISTS "rental_contract" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- 3. Users Table (Better Auth & Custom RBAC)
CREATE TABLE "user" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  role text DEFAULT 'user', -- 'admin', 'manager', 'agent', 'user'
  banned boolean DEFAULT false,
  ban_reason text,
  ban_expires timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 4. Sessions Table
CREATE TABLE "session" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  expires_at timestamp NOT NULL,
  token text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 5. Accounts Table (OAuth & Credentials)
CREATE TABLE "account" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamp,
  refresh_token_expires_at timestamp,
  scope text,
  password text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 6. Verifications Table
CREATE TABLE "verification" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp,
  updated_at timestamp
);

-- 7. Properties Table
CREATE TABLE "property" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  price numeric NOT NULL,
  location text NOT NULL,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area_sqft integer,
  property_type text DEFAULT 'Apartment',
  status text DEFAULT 'available', -- available, rented, archived
  amenities text[],
  images text[],
  cover_image text,
  drive_folder_id text,
  featured boolean DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 8. Enquiries & Leads Table
CREATE TABLE "enquiry" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  property_id text REFERENCES "property"(id) ON DELETE SET NULL,
  message text,
  status text DEFAULT 'new', -- new, contacted, site_visit, closed
  zoho_lead_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 9. Blogs Table
CREATE TABLE "blog" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  author_name text DEFAULT 'NexState AI Team',
  published boolean DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 10. FAQs Table
CREATE TABLE "faq" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- 11. Favorites Table
CREATE TABLE "favorite" (
  id text PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  property_id text NOT NULL REFERENCES "property"(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- 12. Create Performance Indexes
CREATE INDEX IF NOT EXISTS property_status_idx ON "property"(status);
CREATE INDEX IF NOT EXISTS property_featured_idx ON "property"(featured);
CREATE INDEX IF NOT EXISTS property_location_idx ON "property"(location);
CREATE INDEX IF NOT EXISTS enquiry_status_idx ON "enquiry"(status);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "faq" ENABLE ROW LEVEL SECURITY;

-- 14. Basic RLS Policies (Allow service role bypass + public read)
CREATE POLICY "Public Read Properties" ON "property" FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON "blog" FOR SELECT USING (published = true);
CREATE POLICY "Public Read FAQs" ON "faq" FOR SELECT USING (published = true);
CREATE POLICY "Public Insert Enquiries" ON "enquiry" FOR INSERT WITH CHECK (true);

-- 15. Initial Seed Data
INSERT INTO "user" (id, name, email, role)
VALUES 
  (uuid_generate_v4(), 'Admin User', 'admin@NexState.ai', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "property" (title, slug, description, price, location, bedrooms, bathrooms, area_sqft, property_type, status, featured, cover_image, amenities)
VALUES
  ('Skyline Luxury Penthouse', 'skyline-luxury-penthouse', 'Stunning multi-bedroom penthouse with panoramic skyline views and modern smart automation.', 12500, 'Dubai Marina, Dubai', 3, 3, 2400, 'Penthouse', 'available', true, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', ARRAY['Smart Automation', 'Private Pool', 'Gym', 'Parking']),
  ('Aura Urban Studio Loft', 'aura-urban-studio-loft', 'Modern furnished studio in the heart of Downtown. Perfect for young professionals.', 4800, 'Downtown Dubai, Dubai', 1, 1, 750, 'Studio', 'available', true, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', ARRAY['High-Speed Wifi', 'Balcony', 'Concierge']),
  ('Waterfront Modern Villa', 'waterfront-modern-villa', 'Expansive 4-bedroom villa with direct beach access, private garden, and AI security system.', 24000, 'Palm Jumeirah, Dubai', 4, 5, 4500, 'Villa', 'available', true, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', ARRAY['Private Beach', 'Infinity Pool', 'Smart Lock', 'Garden']);

INSERT INTO "faq" (question, answer, category, order_index)
VALUES
  ('How does the NexState AI Property Assistant work?', 'Our AI assistant parses your natural language preferences (budget, room count, amenities, preferred neighborhood) to deliver tailor-made property matches.', 'AI Intelligence', 1),
  ('How do I schedule a site visit?', 'Click on any property card or open the AI assistant drawer to submit your preferred date and contact details. An agent will confirm within minutes.', 'Services', 2);
