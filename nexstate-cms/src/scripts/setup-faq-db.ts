// Script to setup FAQ table
// NOTE: This script is deprecated. Use Supabase dashboard SQL editor for schema changes.

console.log("⚠️ This script is deprecated.");
console.log("   To create the FAQ table, use the Supabase dashboard SQL editor with:");
console.log(`
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_sort_order ON faq(sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_is_active ON faq(is_active);
`);
console.log("");
console.log("   Or use Supabase migrations for schema changes.");
