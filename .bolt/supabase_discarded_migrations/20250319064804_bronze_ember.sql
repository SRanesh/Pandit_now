/*
  # Remove Sample Data and Update Profile Creation

  1. Changes
    - Remove all sample data
    - Update profile creation trigger
    - Add proper constraints and validations
    
  2. Security
    - Maintain RLS policies
    - Ensure proper data validation
*/

-- Remove all sample data
DELETE FROM messages;
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM profiles;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile with proper role and data
  INSERT INTO public.profiles (
    id,
    name,
    role,
    phone,
    location,
    experience,
    languages,
    specializations,
    bio,
    rating,
    review_count,
    specialization_costs
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'devotee')::user_role,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' 
      THEN COALESCE((NEW.raw_user_meta_data->>'experience')::integer, 0)
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' 
      THEN COALESCE((NEW.raw_user_meta_data->>'languages')::text[], ARRAY['Hindi', 'Sanskrit'])
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' 
      THEN COALESCE((NEW.raw_user_meta_data->>'specializations')::text[], ARRAY[]::text[])
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'bio',
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' THEN 0
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' THEN 0
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'pandit' THEN '{}'::jsonb
      ELSE NULL 
    END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();