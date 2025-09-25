import { supabase } from '../lib/supabase';
import { ChecklistItem } from '../types';

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return [];
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching checklist items:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    testo: row.testo,
    completata: row.completata,
    completataAt: row.completata_at,
    priorita: 'none' as const, // Mock data for now
    categoria: 'riparazione' as const, // Mock data for now
    dataScadenza: undefined,
    dataPromemoria: undefined,
    ricorrente: 'none' as const,
    ordine: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
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
      user_id: user.id,
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

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      testo: item.testo,
      completata: false,
      user_id: user.id,
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