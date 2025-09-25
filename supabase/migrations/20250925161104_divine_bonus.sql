/*
  # Add Advanced Fields to Checklist Items

  1. New Columns
    - `priorita` (text) - Priority level: 'alta', 'media', 'bassa', 'none'
    - `categoria` (text) - Category: 'riparazione', 'follow-up', 'materiali', etc.
    - `categoria_custom` (text) - Custom category name when categoria is 'custom'
    - `data_scadenza` (date) - Due date for the task
    - `data_promemoria` (date) - Reminder date for the task
    - `ricorrente` (text) - Recurrence: 'none', 'giornaliera', 'settimanale', 'mensile'
    - `ordine` (integer) - Order for drag and drop functionality

  2. Security
    - All existing RLS policies will apply to new columns
    - No additional security changes needed
*/

-- Add priority column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'priorita'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN priorita text DEFAULT 'none';
  END IF;
END $$;

-- Add category column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'categoria'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN categoria text DEFAULT 'riparazione';
  END IF;
END $$;

-- Add custom category column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'categoria_custom'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN categoria_custom text;
  END IF;
END $$;

-- Add due date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'data_scadenza'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN data_scadenza date;
  END IF;
END $$;

-- Add reminder date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'data_promemoria'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN data_promemoria date;
  END IF;
END $$;

-- Add recurrence column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'ricorrente'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN ricorrente text DEFAULT 'none';
  END IF;
END $$;

-- Add order column for drag and drop
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_items' AND column_name = 'ordine'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN ordine integer DEFAULT 0;
  END IF;
END $$;