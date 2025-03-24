/*
  # Add Sample Data

  1. New Data
    - Sample users (devotees and pandits)
    - Sample bookings
    - Sample reviews
    - Sample messages

  2. Details
    - Creates test accounts with realistic data
    - Adds various booking statuses
    - Includes reviews and ratings
    - Adds message threads
*/

-- Insert sample devotees
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('d1f25436-2d6f-4e13-9f5b-11b84f2d5b2c', 'rahul.kumar@example.com', 
    '{"name": "Rahul Kumar", "role": "devotee"}'::jsonb),
  ('8f9b2a8c-5c4d-4b6a-9f8e-3c7d2f5e1a4b', 'priya.sharma@example.com',
    '{"name": "Priya Sharma", "role": "devotee"}'::jsonb);

-- Insert sample pandits
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('c5e7d6b3-a2f1-4e8d-9c7b-8f5a4d3c2b1a', 'pandit.sharma@example.com',
    '{"name": "Acharya Sharma", "role": "pandit", "experience": "15", "languages": ["Hindi", "Sanskrit"], "specializations": ["Griha Pravesh", "Wedding Ceremony"]}'::jsonb),
  ('b4a3c2d1-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'pandit.mishra@example.com',
    '{"name": "Pandit Mishra", "role": "pandit", "experience": "20", "languages": ["Hindi", "Sanskrit", "English"], "specializations": ["Satyanarayan Katha", "Baby Naming"]}'::jsonb);

-- Insert profiles for devotees
INSERT INTO profiles (id, name, role, phone, location)
VALUES
  ('d1f25436-2d6f-4e13-9f5b-11b84f2d5b2c', 'Rahul Kumar', 'devotee', '+91-9876543210', 'Mumbai, Maharashtra'),
  ('8f9b2a8c-5c4d-4b6a-9f8e-3c7d2f5e1a4b', 'Priya Sharma', 'devotee', '+91-9876543211', 'Delhi, NCR');

-- Insert profiles for pandits with specialization costs
INSERT INTO profiles (
  id, name, role, phone, location, experience, languages, specializations,
  specialization_costs, bio, rating, review_count
)
VALUES
  (
    'c5e7d6b3-a2f1-4e8d-9c7b-8f5a4d3c2b1a',
    'Acharya Sharma',
    'pandit',
    '+91-9876543212',
    'Mumbai, Maharashtra',
    15,
    ARRAY['Hindi', 'Sanskrit'],
    ARRAY['Griha Pravesh', 'Wedding Ceremony'],
    '{"Griha Pravesh": "5000", "Wedding Ceremony": "15000"}'::jsonb,
    'Experienced Vedic scholar specializing in traditional ceremonies',
    4.5,
    12
  ),
  (
    'b4a3c2d1-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'Pandit Mishra',
    'pandit',
    '+91-9876543213',
    'Delhi, NCR',
    20,
    ARRAY['Hindi', 'Sanskrit', 'English'],
    ARRAY['Satyanarayan Katha', 'Baby Naming'],
    '{"Satyanarayan Katha": "3000", "Baby Naming": "5000"}'::jsonb,
    'Expert in traditional ceremonies with modern approach',
    4.8,
    15
  );

-- Insert sample bookings
INSERT INTO bookings (
  id, pandit_id, devotee_id, ceremony, ceremony_date, ceremony_time,
  location, status, cost, notes, cost_status, proposed_cost, final_cost
)
VALUES
  (
    'f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f',
    'c5e7d6b3-a2f1-4e8d-9c7b-8f5a4d3c2b1a',
    'd1f25436-2d6f-4e13-9f5b-11b84f2d5b2c',
    'Griha Pravesh',
    CURRENT_DATE + INTERVAL '10 days',
    '10:00:00',
    'Mumbai, Maharashtra',
    'confirmed',
    5000,
    'Please bring all required items',
    'accepted',
    5000,
    5000
  ),
  (
    'a9b8c7d6-e5f4-4g3h-2i1j-k0l9m8n7o6p5',
    'b4a3c2d1-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    '8f9b2a8c-5c4d-4b6a-9f8e-3c7d2f5e1a4b',
    'Satyanarayan Katha',
    CURRENT_DATE + INTERVAL '15 days',
    '09:00:00',
    'Delhi, NCR',
    'pending',
    3000,
    'Morning ceremony preferred',
    'proposed',
    3000,
    NULL
  );

-- Insert sample reviews
INSERT INTO reviews (
  id, pandit_id, devotee_id, booking_id, rating, comment
)
VALUES
  (
    'r1a2b3c4-d5e6-4f7g-8h9i-j0k1l2m3n4o5',
    'c5e7d6b3-a2f1-4e8d-9c7b-8f5a4d3c2b1a',
    'd1f25436-2d6f-4e13-9f5b-11b84f2d5b2c',
    'f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f',
    5,
    'Excellent service and very knowledgeable'
  );

-- Insert sample messages
INSERT INTO messages (
  id, booking_id, sender_id, content
)
VALUES
  (
    'm1n2o3p4-q5r6-4s7t-8u9v-w0x1y2z3a4b5',
    'f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f',
    'd1f25436-2d6f-4e13-9f5b-11b84f2d5b2c',
    'What items should I arrange for the ceremony?'
  ),
  (
    'b5a4c3d2-e1f0-4g9h-8i7j-k6l5m4n3o2p1',
    'f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f',
    'c5e7d6b3-a2f1-4e8d-9c7b-8f5a4d3c2b1a',
    'I will send you the complete list of items required for Griha Pravesh.'
  );