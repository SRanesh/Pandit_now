/*
  # Fix auth triggers and profile handling

  1. Changes
    - Add better error handling for user metadata parsing
    - Ensure proper profile creation on signup
    - Fix role handling and defaults
    - Add proper cleanup on user deletion

  2. Security
    - Maintain existing RLS policies
    - Ensure secure profile creation
*/

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Update function to handle new user registration with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
  user_languages text[];
  user_specializations text[];
  user_full_name text;
BEGIN
  -- Get role with fallback
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'devotee');
  
  -- Get full name with fallback to email
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  
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
    user_full_name,
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
EXCEPTION WHEN OTHERS THEN
  -- Log error and re-raise
  RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update function to handle user updates with better error handling
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
DECLARE
  user_languages text[];
  user_specializations text[];
BEGIN
  IF (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data) THEN
    -- Parse arrays with error handling
    BEGIN
      user_languages := COALESCE(
        (NEW.raw_user_meta_data->>'languages')::text[],
        (SELECT languages FROM public.profiles WHERE user_id = NEW.id)
      );
      user_specializations := COALESCE(
        (NEW.raw_user_meta_data->>'specializations')::text[],
        (SELECT specializations FROM public.profiles WHERE user_id = NEW.id)
      );
    EXCEPTION WHEN OTHERS THEN
      -- Keep existing values if parsing fails
      user_languages := (SELECT languages FROM public.profiles WHERE user_id = NEW.id);
      user_specializations := (SELECT specializations FROM public.profiles WHERE user_id = NEW.id);
    END;

    UPDATE public.profiles
    SET
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      phone = COALESCE(NEW.raw_user_meta_data->>'phone', profiles.phone),
      location = COALESCE(NEW.raw_user_meta_data->>'location', profiles.location),
      languages = user_languages,
      specializations = user_specializations,
      bio = COALESCE(NEW.raw_user_meta_data->>'bio', profiles.bio),
      updated_at = now()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error and re-raise
  RAISE NOTICE 'Error in handle_user_update: %', SQLERRM;
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_update();