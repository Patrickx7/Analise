/*
  # Create technical analyses table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key)
      - `device` (text)
      - `damage_type` (text)
      - `analysis` (text)
      - `category` (text)
      - `severity` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `analyses` table
    - Add policies for authenticated users to read and create analyses
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device text NOT NULL,
  damage_type text NOT NULL,
  analysis text NOT NULL,
  category text NOT NULL CHECK (category IN ('logical', 'physical', 'electronic')),
  severity text NOT NULL CHECK (severity IN ('simple', 'moderate', 'complex')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);