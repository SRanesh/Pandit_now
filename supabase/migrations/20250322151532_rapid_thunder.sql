/*
  # Fix Profile Creation for New Users

  1. Changes
    - Update handle_new_user function to properly handle role and metadata
    - Add error handling for missing data
    - Ensure proper type casting for arrays

  2. Security
    - Maintain existing RLS policies
    - Function remains security definer
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update function to handle new user registration with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
  user_languages text[];
  user_specializations text[];
BEGIN
  -- Get role with fallback
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'devotee');
  
  -- Parse arrays with proper error handling
  BEGIN
    user_languages := COALESCE(
      (NEW.raw_user_meta_data->>'languages')::text[],
      ARRAY[]::text[]
    );
    user_specializations := COALESCE(
      (NEW.raw_user_meta_data->>'specializations')::text[],
      ARRAY[]::text[]
    );
  EXCEPTION WHEN OTHERS THEN
    -- Default to empty arrays if parsing fails
    user_languages := ARRAY[]::text[];
    user_specializations := ARRAY[]::text[];
  END;

  -- Create profile with complete metadata
  INSERT INTO public.profiles (
    user_id,
    full_name,
    avatar_url,
    phone,
    location,
    languages,
    specializations,
    bio,
    rating,
    review_count
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    user_languages,
    user_specializations,
    NEW.raw_user_meta_data->>'bio',
    0,  -- Default rating
    0   -- Default review count
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();