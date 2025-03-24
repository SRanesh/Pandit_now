/*
  # Fix Booking Creation Issues

  1. Changes
    - Update booking policies to allow proper creation and updates
    - Add missing columns for booking details
    - Fix constraints and checks

  2. Security
    - Maintain RLS
    - Update policies for proper access control
*/

-- Update bookings table with additional fields
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS devotee_name text,
ADD COLUMN IF NOT EXISTS pandit_name text,
ADD COLUMN IF NOT EXISTS devotee_email text,
ADD COLUMN IF NOT EXISTS pandit_email text,
ADD COLUMN IF NOT EXISTS devotee_phone text,
ADD COLUMN IF NOT EXISTS pandit_phone text;

-- Drop existing booking policies
DROP POLICY IF EXISTS "Pandits and devotees can read their own bookings" ON bookings;
DROP POLICY IF EXISTS "Devotees can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

-- Create improved booking policies
CREATE POLICY "Users can read their own bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = pandit_id OR 
  auth.uid() = devotee_id
);

CREATE POLICY "Devotees can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = devotee_id AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = pandit_id
    AND role = 'pandit'
  )
);

CREATE POLICY "Pandits can accept/reject bookings"
ON bookings FOR UPDATE
TO authenticated
USING (
  auth.uid() = pandit_id AND 
  status = 'pending'
)
WITH CHECK (
  auth.uid() = pandit_id AND 
  status IN ('confirmed', 'cancelled')
);

CREATE POLICY "Devotees can cancel their bookings"
ON bookings FOR UPDATE
TO authenticated
USING (
  auth.uid() = devotee_id AND 
  status IN ('pending', 'confirmed')
)
WITH CHECK (
  auth.uid() = devotee_id AND 
  status = 'cancelled'
);

-- Function to validate booking dates
CREATE OR REPLACE FUNCTION validate_booking_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure ceremony date is not in the past
  IF NEW.ceremony_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Cannot book ceremonies in the past';
  END IF;

  -- Check for conflicting bookings for the pandit
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE pandit_id = NEW.pandit_id
    AND ceremony_date = NEW.ceremony_date
    AND ceremony_time = NEW.ceremony_time
    AND status NOT IN ('cancelled')
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Pandit already has a booking at this time';
  END IF;

  -- Check for conflicting bookings for the devotee
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE devotee_id = NEW.devotee_id
    AND ceremony_date = NEW.ceremony_date
    AND ceremony_time = NEW.ceremony_time
    AND status NOT IN ('cancelled')
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'You already have a booking at this time';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking validation
DROP TRIGGER IF EXISTS validate_booking_trigger ON bookings;
CREATE TRIGGER validate_booking_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_date();