/*
  # Create Wedding Website Tables

  1. New Tables
    - `guest_confirmations`
      - `id` (uuid, primary key)
      - `name` (text, required) - Guest's full name
      - `email` (text, required) - Guest's email
      - `phone` (text, optional) - Guest's phone number
      - `guests_count` (integer, default 1) - Number of guests attending
      - `attending` (boolean, default true) - Whether attending or not
      - `dietary_restrictions` (text, optional) - Any dietary restrictions
      - `created_at` (timestamptz) - When confirmation was submitted
    
    - `guest_messages`
      - `id` (uuid, primary key)
      - `name` (text, required) - Guest's name
      - `message` (text, required) - Message for the couple
      - `approved` (boolean, default false) - Whether message is approved for display
      - `created_at` (timestamptz) - When message was submitted

  2. Security
    - Enable RLS on both tables
    - Allow anyone to insert confirmations and messages
    - Only allow reading approved messages
*/

CREATE TABLE IF NOT EXISTS guest_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  guests_count integer DEFAULT 1,
  attending boolean DEFAULT true,
  dietary_restrictions text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guest_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit confirmations"
  ON guest_confirmations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can submit messages"
  ON guest_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved messages"
  ON guest_messages FOR SELECT
  TO anon
  USING (approved = true);