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

export async function syncClientsFromRequests(): Promise<{ success: boolean; created: number; updated: number; errors: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return { success: false, created: 0, updated: 0, errors: 1 };
  }

  try {
    // Get all requests
    const { data: requests, error: requestsError } = await supabase
      .from('requests')
      .select('*')
      // .eq('user_id', user.id) // Temporarily commented for debugging
      .order('richiesta_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching requests:', requestsError);
      return { success: false, created: 0, updated: 0, errors: 1 };
    }

    console.log('🔍 === INIZIO SINCRONIZZAZIONE CLIENTI ===');
    console.log(`📦 Totale richieste recuperate dal database: ${requests.length}`);
    console.log('📋 Tutte le richieste dal database:');
    requests.forEach((req, index) => {
      console.log(`  ${index + 1}. ID: ${req.id} | Nome: "${req.Nome}" | Numero: "${req.Numero}" | Data: ${req.richiesta_at}`);
    });
    console.log('');

    // Get existing clients to avoid duplicates
    const { data: existingClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id);

    if (clientsError) {
      console.error('Error fetching existing clients:', clientsError);
      return { success: false, created: 0, updated: 0, errors: 1 };
    }

    // Create a map of existing clients by normalized phone number
    const existingClientsMap = new Map();
    existingClients.forEach(client => {
      const normalizedPhone = client.telefono?.replace(/\s+/g, '');
      if (normalizedPhone) {
        existingClientsMap.set(normalizedPhone, client);
      }
    });
    
    // Group requests by normalized phone number
    const requestsByPhone = new Map();
    
    console.log('📞 Raggruppamento richieste per numero di telefono:');
    requests.forEach(request => {
      const normalizedPhone = request.Numero?.replace(/\s+/g, '');
      
      // Skip if invalid data
      if (!normalizedPhone || !request.Nome) {
        console.log(`  ⚠️  Saltando richiesta con dati mancanti: ID ${request.id}, Nome: "${request.Nome}", Numero: "${request.Numero}"`);
        return;
      }
      
      if (!requestsByPhone.has(normalizedPhone)) {
        requestsByPhone.set(normalizedPhone, []);
      }
      requestsByPhone.get(normalizedPhone).push(request);
    });

    console.log(`📱 Numeri di telefono unici trovati: ${requestsByPhone.size}`);
    for (const [phone, phoneRequests] of requestsByPhone.entries()) {
      console.log(`  📞 ${phone}: ${phoneRequests.length} richieste`);
      phoneRequests.forEach((req, idx) => {
        console.log(`    ${idx + 1}. "${req.Nome}" - ${req.richiesta_at}`);
      });
    }
    console.log('');
    // For each phone number, find the most recent request
    const mostRecentRequests = new Map();
    
    console.log('🎯 Selezione della richiesta più recente per ogni numero:');
    for (const [phone, phoneRequests] of requestsByPhone.entries()) {
      console.log(`\n📞 Elaborando numero: ${phone}`);
      console.log(`   Richieste disponibili (${phoneRequests.length}):`);
      phoneRequests.forEach((req, idx) => {
        const date = new Date(req.richiesta_at);
        console.log(`     ${idx + 1}. "${req.Nome}" | Data: ${req.richiesta_at} | Timestamp: ${date.getTime()}`);
      });

      // Use reduce to explicitly find the request with the most recent richiesta_at
      const mostRecentRequest = phoneRequests.reduce((mostRecent, current) => {
        const mostRecentDate = new Date(mostRecent.richiesta_at);
        const currentDate = new Date(current.richiesta_at);
        
        console.log(`   🔍 Confronto:`);
        console.log(`     Current: "${current.Nome}" - ${current.richiesta_at} (timestamp: ${currentDate.getTime()})`);
        console.log(`     Most Recent: "${mostRecent.Nome}" - ${mostRecent.richiesta_at} (timestamp: ${mostRecentDate.getTime()})`);
        
        if (currentDate.getTime() > mostRecentDate.getTime()) {
          console.log(`     ✅ "${current.Nome}" è più recente, selezionandola`);
          return current;
        } else {
          console.log(`     ⏸️  "${mostRecent.Nome}" rimane la più recente`);
          return mostRecent;
        }
      });
      
      mostRecentRequests.set(phone, mostRecentRequest);
      
      console.log(`   🎯 SELEZIONE FINALE per ${phone}: "${mostRecentRequest.Nome}" (${mostRecentRequest.richiesta_at})`);
    }

    // Create/update clients
    let created = 0;
    let updated = 0;
    let errors = 0;

    console.log('\n💾 Creazione/aggiornamento clienti nel database:');
    for (const request of mostRecentRequests.values()) {
      try {
        // Extract location from "Luogo" field (e.g., "Milano, via Roma 123" -> luogo: "Milano", indirizzo: "via Roma 123")
        const locationParts = request.Luogo?.split(',').map(part => part.trim());
        const luogo = locationParts?.[0] || null;
        const indirizzo = locationParts?.slice(1).join(', ') || request.Luogo || null;
        
        const normalizedPhone = request.Numero?.replace(/\s+/g, '');
        const existingClient = existingClientsMap.get(normalizedPhone);

        const clientData = {
          nominativo: request.Nome,
          telefono: request.Numero,
          luogo: luogo,
          indirizzo: indirizzo,
          user_id: user.id,
        };

        if (existingClient) {
          // Update existing client
          const { error } = await supabase
            .from('clients')
            .update({
              ...clientData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingClient.id);

          if (error) {
            console.error(`Error updating client for ${request.Nome}:`, error);
            errors++;
          } else {
            console.log(`  🔄 Aggiornato cliente: "${existingClient.nominativo}" -> "${request.Nome}" (${request.Numero})`);
            updated++;
          }
        } else {
          // Create new client
          const clientId = crypto.randomUUID();
          const { error } = await supabase
            .from('clients')
            .insert({
              id: clientId,
              ...clientData,
            });

          if (error) {
            console.error(`Error creating client for ${request.Nome}:`, error);
            errors++;
          } else {
            console.log(`  ✨ Creato nuovo cliente: "${request.Nome}" (${request.Numero})`);
            created++;
          }
        }
      } catch (err) {
        console.error(`Exception processing client for ${request.Nome}:`, err);
        errors++;
      }
    }

    // Remove clients that no longer have any requests
    const requestPhones = new Set(
      requests
        .map(r => r.Numero?.replace(/\s+/g, ''))
        .filter(phone => phone)
    );
    
    const clientsToRemove = existingClients.filter(client => {
      const normalizedPhone = client.telefono?.replace(/\s+/g, '');
      return normalizedPhone && !requestPhones.has(normalizedPhone);
    });

    if (clientsToRemove.length > 0) {
      const idsToRemove = clientsToRemove.map(c => c.id);
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .in('id', idsToRemove);

      if (deleteError) {
        console.error('Error removing obsolete clients:', deleteError);
        errors += clientsToRemove.length;
      }
    }

    console.log(`\n📊 RISULTATI SINCRONIZZAZIONE:`);
    console.log(`  ✨ Clienti creati: ${created}`);
    console.log(`  🔄 Clienti aggiornati: ${updated}`);
    console.log(`  ❌ Errori: ${errors}`);
    console.log('🔍 === FINE SINCRONIZZAZIONE CLIENTI ===\n');

    return { success: true, created, updated, errors };

  } catch (error) {
    console.error('Error in syncClientsFromRequests:', error);
    return { success: false, created: 0, updated: 0, errors: 1 };
  }
}

export async function autoCreateClientFromRequest(request: any): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // Check if client already exists
  const normalizedPhone = request.Numero?.replace(/\s+/g, '');
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .eq('telefono', request.Numero)
    .single();

  if (existingClient) {
    return existingClient.id; // Client already exists
  }

  // Create new client
  const locationParts = request.Luogo?.split(',').map((part: string) => part.trim());
  const luogo = locationParts?.[0] || null;
  const indirizzo = locationParts?.slice(1).join(', ') || request.Luogo || null;

  const { data, error } = await supabase
    .from('clients')
    .insert({
      nominativo: request.Nome,
      telefono: request.Numero,
      luogo: luogo,
      indirizzo: indirizzo,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error auto-creating client:', error);
    return null;
  }

  return data.id;
}