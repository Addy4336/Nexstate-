-- Quick test script to set a property as rented
-- Run this AFTER executing 06_rental_tracking.sql migration

-- Step 1: Check your property IDs
SELECT id, title, status FROM property LIMIT 10;

-- Step 2: Set a test property as rented (replace YOUR_PROPERTY_ID)
-- This will make the property show as "rented until Feb 28, 2026"
-- Available from March 2, 2026 (with 2 buffer days)

UPDATE property 
SET 
  status = 'rented',
  current_rental_start = '2026-01-15',
  current_rental_end = '2026-02-28',
  buffer_days = 2,
  rental_periods = '[
    {
      "start_date": "2026-01-15",
      "end_date": "2026-02-28",
      "tenant_info": "Test Tenant",
      "amount": 5000,
      "status": "active"
    }
  ]'::jsonb
WHERE id = 'YOUR_PROPERTY_ID';  -- Replace with actual property ID

-- Step 3: Verify the update
SELECT 
  id, 
  title, 
  status, 
  current_rental_start, 
  current_rental_end,
  buffer_days,
  rental_periods
FROM property 
WHERE id = 'YOUR_PROPERTY_ID';  -- Replace with actual property ID

-- Step 4: Test availability function
SELECT is_property_available(
  'YOUR_PROPERTY_ID',  -- Replace with actual property ID
  '2026-03-01'::date,  -- Try to book before available date (should return false)
  '2026-03-10'::date
);

SELECT is_property_available(
  'YOUR_PROPERTY_ID',  -- Replace with actual property ID
  '2026-03-02'::date,  -- Book after available date (should return true)
  '2026-03-10'::date
);

-- Step 5: To reset property back to available
-- UPDATE property 
-- SET 
--   status = 'available',
--   current_rental_start = NULL,
--   current_rental_end = NULL,
--   rental_periods = '[]'::jsonb
-- WHERE id = 'YOUR_PROPERTY_ID';
