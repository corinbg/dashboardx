/*
  # Create user preferences table for checklist UI settings

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `idraulico_id` (uuid, foreign key to auth.users)
      - `checklist_group_by` (text, default 'none')
      - `checklist_view_density` (text, default 'comfortable')
      - `checklist_items_per_page` (integer, default 20)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for users to read their own preferences
    - Add policy for users to insert their own preferences
    - Add policy for users to update their own preferences

  3. Notes
    - This table stores UI preferences for each user
    - Preferences are persisted across sessions
    - Each user can only access their own preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idraulico_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_group_by text DEFAULT 'none',
  checklist_view_density text DEFAULT 'comfortable',
  checklist_items_per_page integer DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(idraulico_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = idraulico_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = idraulico_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = idraulico_id)
  WITH CHECK (auth.uid() = idraulico_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_idraulico_id ON user_preferences(idraulico_id);
