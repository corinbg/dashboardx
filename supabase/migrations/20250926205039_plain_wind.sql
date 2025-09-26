/*
  # Fix clients table constraints and user_id logic

  1. Changes
    - Remove existing duplicates based on telefono
    - Add unique constraint on telefono column 
    - Update user_id logic to use phone number instead of auth user ID

  2. Security
    - Maintains data integrity with phone-based unique constraint
    - Preserves client-request relationship via phone number matching
*/

-- First, let's clean up any duplicate phone numbers (keep the most recent)
DELETE FROM clients 
WHERE id NOT IN (
  SELECT DISTINCT ON (telefono) id 
  FROM clients 
  ORDER BY telefono, created_at DESC
);

-- Add unique constraint on telefono to prevent duplicates
ALTER TABLE clients 
ADD CONSTRAINT clients_telefono_unique 
UNIQUE (telefono);

-- Update existing clients to set user_id = telefono for consistency
UPDATE clients 
SET user_id = telefono 
WHERE user_id != telefono;

-- Add index on user_id for better performance since it will match phone numbers
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);