-- Blogs table for content management
create table if not exists "blog" (
  id text primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image text,
  images text[], -- Array of image URLs for gallery
  category text default 'general', -- market-news, investment-tips, lifestyle, etc.
  status text default 'draft', -- draft, published, archived
  content_format text default 'html', -- 'html' or 'markdown'
  author_id text references "user"(id) on delete set null,
  drive_folder_id text,
  published_at timestamp,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Create index on slug for faster lookups
create index if not exists blog_slug_idx on blog(slug);

-- Create index on status for filtering
create index if not exists blog_status_idx on blog(status);

-- Create index on category for filtering
create index if not exists blog_category_idx on blog(category);

-- Enable Row Level Security
ALTER TABLE "blog" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog table
-- Public can view published blog posts
CREATE POLICY "public_view_published_blogs" ON "blog"
  FOR SELECT USING (status = 'published');

-- Admins can view all blog posts (including drafts)
CREATE POLICY "admin_view_all_blogs" ON "blog"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

-- Admins can insert blog posts
CREATE POLICY "admin_insert_blogs" ON "blog"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

-- Admins can update blog posts
CREATE POLICY "admin_update_blogs" ON "blog"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

-- Admins can delete blog posts
CREATE POLICY "admin_delete_blogs" ON "blog"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

-- Authors can update their own blog posts
CREATE POLICY "author_update_own_blogs" ON "blog"
  FOR UPDATE USING (author_id = current_setting('app.current_user_id', true));

