/*
  # Add is_favorite column to conversations table

  1. Changes
    - Add `is_favorite` (boolean, default false) column to `conversations` table
    - Create index on `is_favorite` and `idraulico_id` for faster queries

  2. Notes
    - This allows users to mark conversations as favorites
    - Favorites can be filtered for quick access
    - Each user can have their own favorite conversations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE conversations ADD COLUMN is_favorite boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversations_favorite_idraulico 
  ON conversations(idraulico_id, is_favorite) 
  WHERE is_favorite = true;
