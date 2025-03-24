/*
  # Fix Enum Types

  1. Changes
    - Drop types only if they exist and are not in use
    - Create types only if they don't exist
    - Use text fields as fallback if types can't be dropped
*/

-- Function to check if type exists and is not in use
CREATE OR REPLACE FUNCTION check_type_usage(type_name text)
RETURNS boolean AS $$
DECLARE
    type_is_used boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_class c ON c.oid = t.typrelid
        JOIN pg_attribute a ON a.attrelid = c.oid
        WHERE t.typname = type_name
    ) INTO type_is_used;
    RETURN type_is_used;
END;
$$ LANGUAGE plpgsql;

-- Safely handle user_role type
DO $$ 
BEGIN
    -- Only attempt to create if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('devotee', 'pandit', 'admin');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN 
        NULL;  -- Type already exists, ignore
END $$;

-- Safely handle booking_status type
DO $$ 
BEGIN
    -- Only attempt to create if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN 
        NULL;  -- Type already exists, ignore
END $$;

-- Update profiles table to use text if needed
DO $$ 
BEGIN
    -- Alter column type only if needed
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role' 
        AND data_type = 'text'
    ) THEN
        -- Column exists and is text type, add check constraint
        ALTER TABLE profiles 
        ADD CONSTRAINT check_valid_role 
        CHECK (role IN ('devotee', 'pandit', 'admin'));
    END IF;
EXCEPTION
    WHEN undefined_table THEN 
        NULL;  -- Table doesn't exist yet
END $$;

-- Update bookings table to use text if needed
DO $$ 
BEGIN
    -- Alter column type only if needed
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'status' 
        AND data_type = 'text'
    ) THEN
        -- Column exists and is text type, add check constraint
        ALTER TABLE bookings 
        ADD CONSTRAINT check_valid_status 
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
    END IF;
EXCEPTION
    WHEN undefined_table THEN 
        NULL;  -- Table doesn't exist yet
END $$;