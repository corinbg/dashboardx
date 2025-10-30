/*
  # Create Calendar Events Table

  1. New Tables
    - `calendar_events` - Calendar appointments and events
      - `id` (uuid, primary key)
      - `titolo` (text, event title)
      - `cliente_id` (uuid, optional foreign key to clients table)
      - `cliente_nome` (text, optional client name if not linked to clients table)
      - `data_inizio` (timestamptz, event start date and time)
      - `data_fine` (timestamptz, event end date and time)
      - `tipo_intervento` (enum, type of intervention)
      - `indirizzo` (text, event location address)
      - `note` (text, additional notes)
      - `stato` (enum, event status)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Enums
    - `event_type` - Types of interventions: Sopralluogo, Riparazione, Installazione, Manutenzione
    - `event_status` - Event status: Programmato, In corso, Completato, Cancellato

  3. Security
    - Enable RLS on `calendar_events` table
    - Add policies for authenticated users to access only their own events

  4. Indexes
    - Create indexes on user_id, data_inizio, and cliente_id for optimal query performance

  5. Foreign Keys
    - Optional foreign key to clients table (ON DELETE SET NULL to preserve events if client is deleted)
*/

-- Create enum for event type
DO $$ BEGIN
    CREATE TYPE event_type AS ENUM ('Sopralluogo', 'Riparazione', 'Installazione', 'Manutenzione');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for event status
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('Programmato', 'In corso', 'Completato', 'Cancellato');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo text NOT NULL,
  cliente_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  cliente_nome text,
  data_inizio timestamptz NOT NULL,
  data_fine timestamptz NOT NULL,
  tipo_intervento event_type NOT NULL,
  indirizzo text,
  note text,
  stato event_status DEFAULT 'Programmato',
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (data_fine > data_inizio)
);

-- Enable Row Level Security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar_events
CREATE POLICY "Users can view own events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON calendar_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON calendar_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_calendar_events_updated_at 
  BEFORE UPDATE ON calendar_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS calendar_events_user_id_idx ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS calendar_events_data_inizio_idx ON calendar_events(data_inizio);
CREATE INDEX IF NOT EXISTS calendar_events_cliente_id_idx ON calendar_events(cliente_id);
CREATE INDEX IF NOT EXISTS calendar_events_stato_idx ON calendar_events(stato);
CREATE INDEX IF NOT EXISTS calendar_events_tipo_intervento_idx ON calendar_events(tipo_intervento);