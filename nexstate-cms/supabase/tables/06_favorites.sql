-- Favorites table for tenants to save properties
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.favorite (
    id text NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id text NOT NULL,
    property_id text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT favorite_pkey PRIMARY KEY (id),
    CONSTRAINT favorite_user_id_property_id_key UNIQUE (user_id, property_id),
    CONSTRAINT favorite_property_id_fkey FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS favorite_user_id_idx ON public.favorite (user_id);
CREATE INDEX IF NOT EXISTS favorite_property_id_idx ON public.favorite (property_id);

-- Enable RLS
ALTER TABLE public.favorite ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
CREATE POLICY "users_view_own_favorites" ON public.favorite
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

-- Users can add their own favorites
CREATE POLICY "users_add_own_favorites" ON public.favorite
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Users can delete their own favorites
CREATE POLICY "users_delete_own_favorites" ON public.favorite
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));
