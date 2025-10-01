import { supabase } from '../lib/supabase';
import { Request } from '../types';

export async function getRequests(): Promise<Request[]> {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('richiesta_at', { ascending: false });

  if (error) {
    console.error('Error fetching requests:', error);
    return [];
  }

  // Transform database format to app format
  return data.map(row => ({
    id: row.id,
    Nome: row.Nome,
    Citta: row['Città'],
    Indirizzo: row.Indirizzo,
    Luogo: row.Luogo,
    Problema: row.Problema,
    Urgenza: row.Urgenza,
    Numero: row.Numero,
    PreferenzaRicontatto: row['Preferenza Ricontatto'],
    richiestaAt: row.richiesta_at,
    stato: row.stato as Request['stato'],
    spamFuoriZona: row.spam_fuori_zona,
  }));
}

export async function updateRequestStatus(id: string, stato: Request['stato']): Promise<boolean> {
  const { error } = await supabase
    .from('requests')
    .update({ stato })
    .eq('id', id);

  if (error) {
    console.error('Error updating request status:', error);
    return false;
  }

  return true;
}

export async function createRequest(request: Omit<Request, 'id'>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      Nome: request.Nome,
      'Città': request.Citta,
      Indirizzo: request.Indirizzo,
      Problema: request.Problema,
      Urgenza: request.Urgenza,
      Numero: request.Numero,
      'Preferenza Ricontatto': request.PreferenzaRicontatto,
      richiesta_at: request.richiestaAt,
      stato: request.stato,
      spam_fuori_zona: request.spamFuoriZona,
      user_id: request.Numero,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  return data.id;
}