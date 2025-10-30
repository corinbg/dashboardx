/*
  # Update sync_client_from_request Function

  1. Changes
    - Update function to read from new column names in requests table:
      - "Città" instead of "Luogo" (city)
      - "Indirizzo" instead of null (street address)
    - Map "Città" to clients.luogo (city field in clients table)
    - Map "Indirizzo" to clients.indirizzo (address field in clients table)
    - Update conflict resolution to use telefono (phone number) as unique key
    - Ensure all client fields are updated when a conflict occurs

  2. Function Behavior
    - Triggered on INSERT of new requests
    - Automatically creates or updates client record based on phone number
    - Syncs nominativo, telefono, città (→luogo), and indirizzo from request to client

  3. Security
    - Maintains existing RLS policies
    - Function runs with definer security privileges
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS sync_client_on_request_insert ON requests;

-- Create or replace the sync function
CREATE OR REPLACE FUNCTION sync_client_from_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update client based on phone number
  INSERT INTO public.clients (
    nominativo,
    telefono,
    luogo,      -- maps to Città from requests
    indirizzo,  -- maps to Indirizzo from requests
    user_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW."Nome",
    NEW."Numero",
    NEW."Città",      -- now reading from Città column
    NEW."Indirizzo",  -- now reading from Indirizzo column
    NEW.user_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (telefono) DO UPDATE SET
    nominativo = EXCLUDED.nominativo,
    telefono   = EXCLUDED.telefono,
    luogo      = EXCLUDED.luogo,      -- update city
    indirizzo  = EXCLUDED.indirizzo,  -- update address
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Create trigger to call the function on request insert
CREATE TRIGGER sync_client_on_request_insert
  AFTER INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION sync_client_from_request();

-- Add comment to document the function
COMMENT ON FUNCTION sync_client_from_request() IS
'Automatically syncs client data from requests table. Creates new client or updates existing client based on phone number. Maps Città→luogo and Indirizzo→indirizzo.';
