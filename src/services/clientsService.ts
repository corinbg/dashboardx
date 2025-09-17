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
    nominativo: row.nominativo || '',
    telefono: row.telefono || '',
    luogo: row.luogo || undefined,
    indirizzo: row.indirizzo || undefined,
  }));
}

export async function createClient(client: Omit<Client, 'id'>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      nominativo: client.nominativo,
      telefono: client.telefono,
      luogo: client.luogo || null,
      indirizzo: client.indirizzo || null,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }

  return data.id;
}

export async function updateClient(id: string, updates: Partial<Omit<Client, 'id'>>): Promise<boolean> {
  const { error } = await supabase
    .from('clients')
    .update({
      nominativo: updates.nominativo,
      telefono: updates.telefono,
      luogo: updates.luogo || null,
      indirizzo: updates.indirizzo || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating client:', error);
    return false;
  }

  return true;
}
