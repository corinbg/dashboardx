/*
  # Fix clients table unique constraint

  1. Changes
    - Add unique constraint on `telefono` column to prevent duplicate phone numbers
    - Remove any existing duplicate records first
    - Ensure one client per phone number across the system

  2. Security
    - Maintain existing RLS policies
*/

-- First, remove any existing duplicates by keeping only the most recent client for each phone number
DELETE FROM clients 
WHERE id NOT IN (
  SELECT DISTINCT ON (telefono) id 
  FROM clients 
  ORDER BY telefono, created_at DESC
);

-- Add unique constraint on telefono column
ALTER TABLE clients 
ADD CONSTRAINT clients_telefono_unique 
UNIQUE (telefono);