/*
  # Fix Database Schema

  1. Changes
    - Drop existing types if they exist
    - Create types only if they don't exist
    - Fix table creation to handle existing tables
*/

-- Drop and recreate types safely
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        DROP TYPE booking_status;
    END IF;
END $$;

-- Create types
CREATE TYPE user_role AS ENUM ('devotee', 'pandit', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create or update profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'devotee',
  name text NOT NULL,
  avatar_url text,
  phone text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  experience integer CHECK (experience >= 0),
  languages text[],
  specializations text[],
  specialization_costs jsonb DEFAULT '{}'::jsonb,
  bio text,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  
  CONSTRAINT proper_rating CHECK (
    (role = 'pandit' AND rating IS NOT NULL) OR
    (role != 'pandit' AND rating IS NULL)
  )
);

-- Create or update bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_id uuid NOT NULL REFERENCES profiles(id),
  devotee_id uuid NOT NULL REFERENCES profiles(id),
  ceremony text NOT NULL,
  ceremony_date date NOT NULL,
  ceremony_time time NOT NULL,
  location text NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  cost numeric CHECK (cost >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  cost_status text CHECK (cost_status IN ('pending', 'proposed', 'accepted', 'rejected')) DEFAULT 'pending',
  proposed_cost numeric CHECK (proposed_cost >= 0),
  final_cost numeric CHECK (final_cost >= 0),
  cost_notes text,
  
  CONSTRAINT unique_pandit_booking UNIQUE (pandit_id, ceremony_date, ceremony_time),
  CONSTRAINT unique_devotee_booking UNIQUE (devotee_id, ceremony_date, ceremony_time),
  CONSTRAINT future_ceremony CHECK (ceremony_date >= CURRENT_DATE)
);

-- Create or update reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_id uuid NOT NULL REFERENCES profiles(id),
  devotee_id uuid NOT NULL REFERENCES profiles(id),
  booking_id uuid REFERENCES bookings(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_booking_review UNIQUE (booking_id),
  CONSTRAINT unique_devotee_pandit_review UNIQUE (devotee_id, pandit_id)
);

-- Create or update messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Pandits and devotees can read their own bookings" ON bookings;
    DROP POLICY IF EXISTS "Devotees can create bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
    DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
    DROP POLICY IF EXISTS "Devotees can create reviews" ON reviews;
    DROP POLICY IF EXISTS "Users can read their own messages" ON messages;
    DROP POLICY IF EXISTS "Users can send messages for their bookings" ON messages;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Pandits and devotees can read their own bookings"
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

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = pandit_id AND status = 'pending') OR
    (auth.uid() = devotee_id AND status = 'pending')
  );

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Devotees can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = devotee_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = pandit_id
      AND role = 'pandit'
    )
  );

CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT devotee_id FROM bookings WHERE id = booking_id
      UNION
      SELECT pandit_id FROM bookings WHERE id = booking_id
    )
  );

CREATE POLICY "Users can send messages for their bookings"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT devotee_id FROM bookings WHERE id = booking_id
      UNION
      SELECT pandit_id FROM bookings WHERE id = booking_id
    )
  );

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_pandit_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE pandit_id = NEW.pandit_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE pandit_id = NEW.pandit_id
    )
  WHERE id = NEW.pandit_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_pandit_rating_on_review ON reviews;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_updated_at();

CREATE TRIGGER update_pandit_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_pandit_rating();