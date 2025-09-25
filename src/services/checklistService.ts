import { supabase } from '../lib/supabase';
import { ChecklistItem } from '../types';

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching checklist items:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    testo: row.testo,
    completata: row.completata,
    completataAt: row.completata_at || undefined,
  }));
}

export async function createChecklistItem(testo: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      testo,
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
      user_id: user.id,
      // Note: For now we store additional fields as JSON in a custom field
      // In production, you'd add these columns to the database
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
      // Note: Additional fields would be stored in separate columns in production
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating checklist item:', error);
    return false;
  }

  return true;
}

export async function toggleChecklistItem(id: string, completata: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('checklist_items')
    .update({ 
      completata, 
      completata_at: completata ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error toggling checklist item:', error);
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