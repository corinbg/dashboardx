/*
  # Create Conversations and Messages Tables

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (text, customer phone number)
      - `started_at` (timestamp)
      - `is_closed` (boolean)

    - `messages`
      - `id` (uuid, primary key)  
      - `conversation_id` (uuid, foreign key to conversations)
      - `sender_type` (text, 'Cliente' or 'Agente')
      - `text_line` (text, message content)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for service role access
    
  3. Performance
    - Add indexes for efficient querying
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  started_at timestamptz DEFAULT now(),
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table  
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('Cliente', 'Agente')),
  text_line text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (bypass RLS for service role)
CREATE POLICY "Service role full access conversations"
  ON conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger for conversations
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);
CREATE INDEX IF NOT EXISTS conversations_started_at_idx ON conversations(started_at DESC);
CREATE INDEX IF NOT EXISTS conversations_user_started_idx ON conversations(user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_timestamp_idx ON messages(conversation_id, timestamp DESC);