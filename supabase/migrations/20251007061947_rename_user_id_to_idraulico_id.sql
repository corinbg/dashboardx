/*
  # Rename user_id to idraulico_id in calendar_events and checklist_items
  
  1. Changes
    - Rename `user_id` to `idraulico_id` in `calendar_events` table
    - Rename `user_id` to `idraulico_id` in `checklist_items` table
    - Update RLS policies to use the new column name
    - Update indexes to use the new column name
  
  2. Security
    - Drop and recreate RLS policies with correct column reference
    - Maintain secure access control based on authenticated user
*/

-- Rename user_id to idraulico_id in calendar_events
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calendar_events' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE calendar_events RENAME COLUMN user_id TO idraulico_id;
  END IF;
END $$;

-- Rename user_id to idraulico_id in checklist_items
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE checklist_items RENAME COLUMN user_id TO idraulico_id;
  END IF;
END $$;

-- Drop existing policies for calendar_events
DROP POLICY IF EXISTS "Users can view own events" ON calendar_events;
DROP POLICY IF EXISTS "Users can insert own events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update own events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete own events" ON calendar_events;

-- Recreate policies for calendar_events with correct column name
CREATE POLICY "Users can view own events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = idraulico_id);

CREATE POLICY "Users can insert own events"
  ON calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = idraulico_id);

CREATE POLICY "Users can update own events"
  ON calendar_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = idraulico_id)
  WITH CHECK (auth.uid() = idraulico_id);

CREATE POLICY "Users can delete own events"
  ON calendar_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = idraulico_id);

-- Drop existing policies for checklist_items
DROP POLICY IF EXISTS "Users can view own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can insert own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can update own checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Users can delete own checklist items" ON checklist_items;

-- Recreate policies for checklist_items with correct column name
CREATE POLICY "Users can view own checklist items"
  ON checklist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = idraulico_id);

CREATE POLICY "Users can insert own checklist items"
  ON checklist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = idraulico_id);

CREATE POLICY "Users can update own checklist items"
  ON checklist_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = idraulico_id)
  WITH CHECK (auth.uid() = idraulico_id);

CREATE POLICY "Users can delete own checklist items"
  ON checklist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = idraulico_id);

-- Drop old indexes
DROP INDEX IF EXISTS calendar_events_user_id_idx;
DROP INDEX IF EXISTS checklist_items_user_id_idx;

-- Create new indexes with correct column name
CREATE INDEX IF NOT EXISTS calendar_events_idraulico_id_idx ON calendar_events(idraulico_id);
CREATE INDEX IF NOT EXISTS checklist_items_idraulico_id_idx ON checklist_items(idraulico_id);