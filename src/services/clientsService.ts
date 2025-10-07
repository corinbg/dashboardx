import { supabase } from '../lib/supabase';
import { Client } from '../types';

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('nominativo', { ascending: true });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    nominativo: row.nominativo,
    telefono: row.telefono,
    comune: row.comune,
    indirizzo: row.indirizzo,
    user_id: row.user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function createClient(client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // Check if client with this phone number already exists
  const { data: existingClient, error: checkError } = await supabase
    .from('clients')
    .select('id, telefono')
    .eq('telefono', client.telefono)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking for existing client:', checkError);
    return null;
  }

  if (existingClient) {
    console.log('Client with phone number already exists:', client.telefono);
    // Return the existing client ID instead of creating a duplicate
    return existingClient.id;
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      nominativo: client.nominativo,
      telefono: client.telefono,
      comune: client.comune,
      indirizzo: client.indirizzo,
      user_id: client.telefono,
      idraulico_id: user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }

  return data.id;
}

export async function getUniqueCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('comune')
    .not('comune', 'is', null)
    .order('comune');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Get unique cities
  const cities = [...new Set(data.map(row => row.comune).filter(Boolean))];
  return cities;
}

export async function updateClient(id: string, updates: Partial<Omit<Client, 'id'>>): Promise<boolean> {
  const { error } = await supabase
    .from('clients')
    .update({
      nominativo: updates.nominativo,
      telefono: updates.telefono,
      comune: updates.comune,
      indirizzo: updates.indirizzo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating client:', error);
    return false;
  }

  return true;
}
