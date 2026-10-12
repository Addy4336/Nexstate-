-- Drop buffer_days column from property table
-- This is safe to run since all code references have been removed

-- Drop the column
ALTER TABLE property DROP COLUMN IF EXISTS buffer_days;

-- Verify the column is removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'property' 
  AND column_name = 'buffer_days';
-- Should return 0 rows
