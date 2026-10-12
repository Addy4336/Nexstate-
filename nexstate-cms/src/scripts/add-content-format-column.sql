-- Add content_format column to blog table
-- This migration adds support for storing content in both HTML and Markdown formats

-- Add the content_format column with default value 'html'
ALTER TABLE blog ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'html';

-- Update existing records to have 'html' as content_format (since they were created with rich text editor)
UPDATE blog SET content_format = 'html' WHERE content_format IS NULL;

-- Add a comment to the column
COMMENT ON COLUMN blog.content_format IS 'Format of the blog content: html (rich text editor) or markdown';
