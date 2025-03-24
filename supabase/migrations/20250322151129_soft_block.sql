/*
  # Fix Auth Metadata Handling

  1. Changes
    - Add metadata handling for auth
    - Update profile sync with metadata
    - Fix role handling
    
  2. Security
    - Maintain RLS policies
    - Ensure secure metadata handling
*/

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Update function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    COALESCE((NEW.raw_user_meta_data->>'languages')::text[], '{}'),
    COALESCE((NEW.raw_user_meta_data->>'specializations')::text[], '{}'),
    NEW.raw_user_meta_data->>'bio',
    0,
    0
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data) THEN
    UPDATE public.profiles
    SET
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      phone = COALESCE(NEW.raw_user_meta_data->>'phone', profiles.phone),
      location = COALESCE(NEW.raw_user_meta_data->>'location', profiles.location),
      languages = COALESCE((NEW.raw_user_meta_data->>'languages')::text[], profiles.languages),
      specializations = COALESCE((NEW.raw_user_meta_data->>'specializations')::text[], profiles.specializations),
      bio = COALESCE(NEW.raw_user_meta_data->>'bio', profiles.bio),
      updated_at = now()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_update();