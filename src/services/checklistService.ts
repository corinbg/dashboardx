import { supabase } from '../lib/supabase';
import { ChecklistItem } from '../types';

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  console.log('🔍 getChecklistItems: Starting to fetch checklist items');
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ getChecklistItems: User not authenticated');
    return [];
  }

  console.log('✅ getChecklistItems: User authenticated:', {
    userId: user.id,
    userEmail: user.email
  });
  const { data, error } = await supabase
    .from('checklist_items')
    .select(`
      id,
      testo,
      completata,
      completata_at,
      priorita,
      categoria,
      categoria_custom,
      data_scadenza,
      data_promemoria,
      ricorrente,
      ordine,
      created_at,
      updated_at
    `)
    .eq('idraulico_id', user.id)
    .order('ordine', { ascending: true })
    .order('created_at', { ascending: true });

  console.log('📊 getChecklistItems: Supabase query result:', {
    dataLength: data?.length || 0,
    error: error,
    rawData: data
  });
  if (error) {
    console.error('❌ getChecklistItems: Error fetching checklist items:', {
      error,
      errorMessage: error.message,
      errorCode: error.code,
      userId: user.id
    });
    return [];
  }

  const mappedItems = data.map(row => ({
    id: row.id,
    testo: row.testo,
    completata: row.completata,
    completataAt: row.completata_at,
    priorita: row.priorita || 'none',
    categoria: row.categoria || 'riparazione',
    categoriaCustom: row.categoria_custom,
    dataScadenza: row.data_scadenza,
    dataPromemoria: row.data_promemoria,
    ricorrente: row.ricorrente || 'none',
    ordine: row.ordine || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  console.log('🎯 getChecklistItems: Successfully mapped items:', {
    totalItems: mappedItems.length,
    completedItems: mappedItems.filter(item => item.completata).length,
    pendingItems: mappedItems.filter(item => !item.completata).length,
    itemsSample: mappedItems.slice(0, 3).map(item => ({
      id: item.id,
      testo: item.testo,
      completata: item.completata,
      ordine: item.ordine
    }))
  });
  return mappedItems;
}

export async function createChecklistItem(text: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      testo: text,
      completata: false,
      idraulico_id: user.id,
      priorita: 'none',
      categoria: 'riparazione',
      ricorrente: 'none',
      ordine: 0,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating checklist item:', error);
    return null;
  }

  return data.id;
}

export async function createAdvancedChecklistItem(item: {
  testo: string;
  priorita?: string;
  categoria?: string;
  categoriaCustom?: string;
  dataScadenza?: string;
  dataPromemoria?: string;
  ricorrente?: string;
}): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // Get the highest order number to append new item at the end
  const { data: maxOrderData } = await supabase
    .from('checklist_items')
    .select('ordine')
    .eq('idraulico_id', user.id)
    .order('ordine', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrderData?.ordine || 0) + 1;

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      testo: item.testo,
      completata: false,
      idraulico_id: user.id,
      priorita: item.priorita || 'none',
      categoria: item.categoria || 'riparazione',
      categoria_custom: item.categoriaCustom,
      data_scadenza: item.dataScadenza,
      data_promemoria: item.dataPromemoria,
      ricorrente: item.ricorrente || 'none',
      ordine: nextOrder,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating advanced checklist item:', error);
    return null;
  }

  return data.id;
}

export async function updateChecklistItem(id: string, updates: {
  testo?: string;
  priorita?: string;
  categoria?: string;
  categoriaCustom?: string;
  dataScadenza?: string;
  dataPromemoria?: string;
  ricorrente?: string;
}): Promise<boolean> {
  const { error } = await supabase
    .from('checklist_items')
    .update({
      testo: updates.testo,
      priorita: updates.priorita,
      categoria: updates.categoria,
      categoria_custom: updates.categoriaCustom,
      data_scadenza: updates.dataScadenza,
      data_promemoria: updates.dataPromemoria,
      ricorrente: updates.ricorrente,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating checklist item:', error);
    return false;
  }

  return true;
}

export async function deleteChecklistItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting checklist item:', error);
    return false;
  }

  return true;
}

export async function toggleChecklistItem(id: string, completed: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('checklist_items')
    .update({
      completata: completed,
      completata_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error toggling checklist item:', error);
    return false;
  }

  return true;
}

export async function updateChecklistItemOrder(items: { id: string; ordine: number }[]): Promise<boolean> {
  console.log('🔄 updateChecklistItemOrder called with items:', items);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ User not authenticated for updateChecklistItemOrder');
    return false;
  }

  console.log('✅ User authenticated:', user.id);
  console.log('📝 Updating order for', items.length, 'items');

  try {
    // Update all items with their new order
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`🔄 Updating item ${i + 1}/${items.length}:`, {
        id: item.id,
        newOrder: item.ordine
      });

      const { error } = await supabase
        .from('checklist_items')
        .update({ 
          ordine: item.ordine,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .eq('idraulico_id', user.id); // Extra security check

      if (error) {
        console.error(`❌ Error updating order for item ${item.id}:`, {
          error,
          itemId: item.id,
          newOrder: item.ordine,
          userId: user.id
        });
        return false;
      } else {
        console.log(`✅ Successfully updated item ${item.id} to order ${item.ordine}`);
      }
    }

    console.log('🎉 All items updated successfully!');
    return true;
  } catch (error) {
    console.error('💥 Unexpected error in updateChecklistItemOrder:', {
      error,
      items,
      userId: user?.id
    });
    return false;
  }
}