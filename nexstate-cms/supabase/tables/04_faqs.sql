-- FAQ Table for managing frequently asked questions
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_sort_order ON faq(sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_is_active ON faq(is_active);

-- Enable RLS
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public can view active FAQs
CREATE POLICY "public_view_active_faqs" ON faq
    FOR SELECT USING (is_active = true);

-- Staff can view all FAQs
CREATE POLICY "staff_view_all_faqs" ON faq
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "user" u 
            WHERE u.id = current_setting('app.current_user_id', true) 
            AND u.role IN ('admin', 'manager', 'editor')
        )
    );

-- Staff can insert FAQs
CREATE POLICY "staff_insert_faqs" ON faq
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "user" u 
            WHERE u.id = current_setting('app.current_user_id', true) 
            AND u.role IN ('admin', 'manager', 'editor')
        )
    );

-- Staff can update FAQs
CREATE POLICY "staff_update_faqs" ON faq
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "user" u 
            WHERE u.id = current_setting('app.current_user_id', true) 
            AND u.role IN ('admin', 'manager', 'editor')
        )
    );

-- Admin can delete FAQs
CREATE POLICY "admin_delete_faqs" ON faq
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "user" u 
            WHERE u.id = current_setting('app.current_user_id', true) 
            AND u.role = 'admin'
        )
    );
