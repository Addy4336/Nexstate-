-- Add rental tracking columns to property table
-- Migration: Add rental period tracking for properties

-- Add rental tracking columns
ALTER TABLE property ADD COLUMN IF NOT EXISTS current_rental_start DATE;
ALTER TABLE property ADD COLUMN IF NOT EXISTS current_rental_end DATE;
ALTER TABLE property ADD COLUMN IF NOT EXISTS rental_periods JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN property.current_rental_start IS 'Start date of the current active rental period';
COMMENT ON COLUMN property.current_rental_end IS 'End date of the current active rental period';
COMMENT ON COLUMN property.rental_periods IS 'JSON array of all rental periods: [{start_date, end_date, tenant_info, amount, status}]';

-- Create index for rental date queries
CREATE INDEX IF NOT EXISTS property_rental_dates_idx ON property(current_rental_start, current_rental_end);
CREATE INDEX IF NOT EXISTS property_rental_periods_idx ON property USING GIN (rental_periods);

-- Add check constraint to ensure rental end date is after start date
ALTER TABLE property ADD CONSTRAINT rental_dates_valid 
  CHECK (current_rental_end IS NULL OR current_rental_start IS NULL OR current_rental_end >= current_rental_start);

-- Function to check if property is available for given date range
CREATE OR REPLACE FUNCTION is_property_available(
  p_id TEXT,
  p_start_date DATE,
  p_end_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_end DATE;
  v_rental_periods JSONB;
  v_period JSONB;
BEGIN
  -- Get property rental info
  SELECT current_rental_end, rental_periods
  INTO v_current_end, v_rental_periods
  FROM property
  WHERE id = p_id;
  
  -- Check if currently rented and dates overlap
  IF v_current_end IS NOT NULL THEN
    IF p_start_date <= v_current_end THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  -- Check against future bookings in rental_periods
  IF v_rental_periods IS NOT NULL THEN
    FOR v_period IN SELECT * FROM jsonb_array_elements(v_rental_periods)
    LOOP
      IF (v_period->>'status')::text = 'active' OR (v_period->>'status')::text = 'confirmed' THEN
        IF (
          (p_start_date <= (v_period->>'end_date')::date) AND
          (p_end_date >= (v_period->>'start_date')::date)
        ) THEN
          RETURN FALSE;
        END IF;
      END IF;
    END LOOP;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get next available date for a property
CREATE OR REPLACE FUNCTION get_next_available_date(p_id TEXT) RETURNS DATE AS $$
DECLARE
  v_current_end DATE;
BEGIN
  SELECT current_rental_end
  INTO v_current_end
  FROM property
  WHERE id = p_id;
  
  IF v_current_end IS NOT NULL THEN
    RETURN v_current_end + 1;
  END IF;
  
  RETURN CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to update property status based on rental dates
CREATE OR REPLACE FUNCTION update_property_rental_status() RETURNS void AS $$
BEGIN
  -- Update properties to available if rental period has ended
  UPDATE property
  SET status = 'available',
      current_rental_start = NULL,
      current_rental_end = NULL
  WHERE status = 'rented'
    AND current_rental_end IS NOT NULL
    AND current_rental_end < CURRENT_DATE;
    
  -- Update properties to rented if rental period has started
  UPDATE property
  SET status = 'rented'
  WHERE status = 'available'
    AND current_rental_start IS NOT NULL
    AND current_rental_start <= CURRENT_DATE
    AND current_rental_end >= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate rental dates on insert/update
CREATE OR REPLACE FUNCTION validate_rental_dates() RETURNS TRIGGER AS $$
BEGIN
  -- If setting current rental dates, ensure they're valid
  IF NEW.current_rental_start IS NOT NULL AND NEW.current_rental_end IS NOT NULL THEN
    IF NEW.current_rental_start > NEW.current_rental_end THEN
      RAISE EXCEPTION 'Rental start date cannot be after end date';
    END IF;
    
    -- If rental is active, set status to rented
    IF NEW.current_rental_start <= CURRENT_DATE AND NEW.current_rental_end >= CURRENT_DATE THEN
      NEW.status := 'rented';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_rental_dates_trigger
  BEFORE INSERT OR UPDATE ON property
  FOR EACH ROW
  EXECUTE FUNCTION validate_rental_dates();
