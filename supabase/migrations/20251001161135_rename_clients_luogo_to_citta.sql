/*
  # Rename luogo column to città in clients table

  1. Changes
    - Rename column `luogo` to `Città` in the `clients` table
    - This aligns with the requests table structure
    - Existing data is preserved during the rename

  2. Notes
    - Case-sensitive column name (Città with capital C)
    - No data loss - this is a simple column rename
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'luogo'
  ) THEN
    ALTER TABLE clients RENAME COLUMN luogo TO "Città";
  END IF;
END $$;