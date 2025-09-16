/*
  # Create Main Application Schema

  1. New Tables
    - `requests` - Customer service requests with authentication
      - `id` (uuid, primary key)
      - `nominativo` (text, customer name)
      - `luogo` (text, location)
      - `tipo_intervento` (text, service type)
      - `urgenza` (boolean, urgent flag)
      - `telefono` (text, phone number)
      - `ricontatto` (text, callback request)
      - `richiesta_at` (timestamp, request time)
      - `stato` (enum, status)
      - `spam_fuori_zona` (boolean, spam/out of area flag)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `clients` - Client information with authentication
      - `id` (uuid, primary key)
      - `nominativo` (text, client name)
      - `telefono` (text, phone number)
      - `luogo` (text, location)
      - `indirizzo` (text, address)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `checklist_items` - User checklist items
      - `id` (uuid, primary key)
      - `testo` (text, item text)
      - `completata` (boolean, completed flag)
      - `completata_at` (timestamp, completion time)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
*/

-- Create enum for request status
DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('Non letto', 'Letto', 'Contattato', 'Completato');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominativo text NOT NULL,
  luogo text NOT NULL,
  tipo_intervento text NOT NULL,
  urgenza boolean DEFAULT false,
  telefono text NOT NULL,
  ricontatto text NOT NULL,
  richiesta_at timestamptz DEFAULT now(),
  stato request_status DEFAULT 'Non letto',
  spam_fuori_zona boolean DEFAULT false,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominativo text NOT NULL,
  telefono text NOT NULL,
  luogo text,
  indirizzo text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testo text NOT NULL,
  completata boolean DEFAULT false,
  completata_at timestamptz,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for requests
CREATE POLICY "Users can view own requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests"
  ON requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests"
  ON requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own requests"
  ON requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for clients
CREATE POLICY "Users can view own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for checklist_items
CREATE POLICY "Users can view own checklist items"
  ON checklist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist items"
  ON checklist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist items"
  ON checklist_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist items"
  ON checklist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_requests_updated_at 
  BEFORE UPDATE ON requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at 
  BEFORE UPDATE ON checklist_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS requests_user_id_idx ON requests(user_id);
CREATE INDEX IF NOT EXISTS requests_richiesta_at_idx ON requests(richiesta_at);
CREATE INDEX IF NOT EXISTS requests_stato_idx ON requests(stato);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS clients_telefono_idx ON clients(telefono);
CREATE INDEX IF NOT EXISTS checklist_items_user_id_idx ON checklist_items(user_id);