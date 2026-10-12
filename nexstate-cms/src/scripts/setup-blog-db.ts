// Script to setup blog table
// NOTE: This script is deprecated. Use Supabase dashboard SQL editor for schema changes.

console.log("⚠️ This script is deprecated.");
console.log("   To create the blog table, use the Supabase dashboard SQL editor with:");
console.log(`
CREATE TABLE IF NOT EXISTS blog (
    id text primary key default gen_random_uuid()::text,
    title text not null,
    slug text not null unique,
    content text,
    excerpt text,
    cover_image text,
    images text[],
    category text default 'general',
    status text default 'draft',
    author_id text,
    published_at timestamp,
    drive_folder_id text,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog(slug);
CREATE INDEX IF NOT EXISTS blog_status_idx ON blog(status);
CREATE INDEX IF NOT EXISTS blog_category_idx ON blog(category);
`);
console.log("");
console.log("   Or use Supabase migrations for schema changes.");
