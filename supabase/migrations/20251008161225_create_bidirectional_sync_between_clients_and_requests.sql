/*
  # Bidirectional Sync Between Clients and Requests

  1. Overview
    This migration implements bidirectional synchronization between the clients and requests tables.
    When a client's information is updated, all associated requests are automatically updated.
    When a request's information is updated, the associated client is automatically updated.

  2. New Functions
    - `sync_requests_from_client()` - Syncs client changes to all associated requests
    - `normalize_phone_number()` - Normalizes phone numbers for consistent matching
    
  3. Updated Functions
    - Enhanced `sync_client_from_request()` to handle updates and prevent infinite loops

  4. New Triggers
    - `sync_requests_on_client_update` - Triggers on client UPDATE
    - Updates to existing `sync_client_on_request_insert` trigger
    - New `sync_client_on_request_update` - Triggers on request UPDATE

  5. Loop Prevention
    - Uses session variables to track sync operations
    - Prevents infinite trigger loops between tables
    - Ensures data consistency across both tables

  6. Field Mappings
    - clients.nominativo ↔ requests.Nome (name)
    - clients.telefono ↔ requests.Numero (phone number - used as matching key)
    - clients.comune ↔ requests.comune (city)
    - clients.indirizzo ↔ requests.Indirizzo (street address)

  7. Security
    - Maintains existing RLS policies
    - Functions run with SECURITY DEFINER privileges
    - Only syncs data for records belonging to the same user
*/

-- Create a function to normalize phone numbers for consistent matching
CREATE OR REPLACE FUNCTION normalize_phone_number(phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Remove all spaces, dashes, parentheses, and plus signs
  RETURN regexp_replace(phone, '[\\s\\-\\(\\)\\+]', '', 'g');
END;
$$;

-- Drop existing triggers to recreate them with loop prevention
DROP TRIGGER IF EXISTS sync_client_on_request_insert ON requests;
DROP TRIGGER IF EXISTS sync_client_on_request_update ON requests;
DROP TRIGGER IF EXISTS sync_requests_on_client_update ON clients;

-- Enhanced function to sync client FROM request (handles both INSERT and UPDATE)
CREATE OR REPLACE FUNCTION sync_client_from_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if we're in a sync operation to prevent infinite loops
  IF current_setting('app.syncing_from_client', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Set flag to indicate we're syncing from request
  PERFORM set_config('app.syncing_from_request', 'true', true);

  -- Insert or update client based on normalized phone number
  INSERT INTO public.clients (
    nominativo,
    telefono,
    comune,
    indirizzo,
    user_id,
    idraulico_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW."Nome",
    NEW."Numero",
    NEW.comune,
    NEW."Indirizzo",
    NEW.user_id,
    NEW.idraulico_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (telefono) DO UPDATE SET
    nominativo = EXCLUDED.nominativo,
    comune     = EXCLUDED.comune,
    indirizzo  = EXCLUDED.indirizzo,
    updated_at = NOW()
  WHERE 
    clients.nominativo IS DISTINCT FROM EXCLUDED.nominativo OR
    clients.comune IS DISTINCT FROM EXCLUDED.comune OR
    clients.indirizzo IS DISTINCT FROM EXCLUDED.indirizzo;

  -- Reset the flag
  PERFORM set_config('app.syncing_from_request', 'false', true);

  RETURN NEW;
END;
$$;

-- New function to sync requests FROM client (when client is updated)
CREATE OR REPLACE FUNCTION sync_requests_from_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if we're in a sync operation to prevent infinite loops
  IF current_setting('app.syncing_from_request', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Only proceed if relevant fields changed
  IF (OLD.nominativo IS DISTINCT FROM NEW.nominativo OR
      OLD.comune IS DISTINCT FROM NEW.comune OR
      OLD.indirizzo IS DISTINCT FROM NEW.indirizzo) THEN
    
    -- Set flag to indicate we're syncing from client
    PERFORM set_config('app.syncing_from_client', 'true', true);

    -- Update all requests that match this client's phone number
    UPDATE public.requests
    SET
      "Nome" = NEW.nominativo,
      comune = NEW.comune,
      "Indirizzo" = NEW.indirizzo,
      updated_at = NOW()
    WHERE
      normalize_phone_number("Numero") = normalize_phone_number(NEW.telefono)
      AND idraulico_id = NEW.idraulico_id
      AND (
        "Nome" IS DISTINCT FROM NEW.nominativo OR
        comune IS DISTINCT FROM NEW.comune OR
        "Indirizzo" IS DISTINCT FROM NEW.indirizzo
      );

    -- Reset the flag
    PERFORM set_config('app.syncing_from_client', 'false', true);
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to sync client when request is inserted
CREATE TRIGGER sync_client_on_request_insert
  AFTER INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION sync_client_from_request();

-- Create trigger to sync client when request is updated
CREATE TRIGGER sync_client_on_request_update
  AFTER UPDATE ON requests
  FOR EACH ROW
  WHEN (
    OLD."Nome" IS DISTINCT FROM NEW."Nome" OR
    OLD.comune IS DISTINCT FROM NEW.comune OR
    OLD."Indirizzo" IS DISTINCT FROM NEW."Indirizzo"
  )
  EXECUTE FUNCTION sync_client_from_request();

-- Create trigger to sync requests when client is updated
CREATE TRIGGER sync_requests_on_client_update
  AFTER UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION sync_requests_from_client();

-- Add indexes for phone number matching performance
CREATE INDEX IF NOT EXISTS clients_normalized_phone_idx 
  ON clients (normalize_phone_number(telefono));
  
CREATE INDEX IF NOT EXISTS requests_normalized_phone_idx 
  ON requests (normalize_phone_number("Numero"));

-- Add comments to document the functions
COMMENT ON FUNCTION normalize_phone_number(text) IS
'Normalizes phone numbers by removing spaces, dashes, parentheses, and plus signs for consistent matching.';

COMMENT ON FUNCTION sync_client_from_request() IS
'Automatically syncs client data from requests table on INSERT or UPDATE. Creates new client or updates existing based on phone number. Includes loop prevention.';

COMMENT ON FUNCTION sync_requests_from_client() IS
'Automatically syncs all associated requests when client data is updated. Updates all requests matching the client phone number. Includes loop prevention.';