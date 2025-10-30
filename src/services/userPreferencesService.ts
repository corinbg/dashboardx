import { supabase } from '../lib/supabase';
import { GroupByMode } from '../components/Checklist/GroupControls';

export interface UserPreferences {
  id: string;
  idraulico_id: string;
  checklist_group_by: GroupByMode;
  checklist_view_density: 'comfortable' | 'compact';
  checklist_items_per_page: number;
  created_at: string;
  updated_at: string;
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('idraulico_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  if (!data) {
    return await createDefaultUserPreferences();
  }

  return {
    id: data.id,
    idraulico_id: data.idraulico_id,
    checklist_group_by: data.checklist_group_by as GroupByMode,
    checklist_view_density: data.checklist_view_density as 'comfortable' | 'compact',
    checklist_items_per_page: data.checklist_items_per_page,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

async function createDefaultUserPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const defaultPreferences = {
    idraulico_id: user.id,
    checklist_group_by: 'none',
    checklist_view_density: 'comfortable',
    checklist_items_per_page: 20,
  };

  const { data, error } = await supabase
    .from('user_preferences')
    .insert(defaultPreferences)
    .select()
    .single();

  if (error) {
    console.error('Error creating default user preferences:', error);
    return null;
  }

  return {
    id: data.id,
    idraulico_id: data.idraulico_id,
    checklist_group_by: data.checklist_group_by as GroupByMode,
    checklist_view_density: data.checklist_view_density as 'comfortable' | 'compact',
    checklist_items_per_page: data.checklist_items_per_page,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function updateUserPreferences(updates: {
  checklist_group_by?: GroupByMode;
  checklist_view_density?: 'comfortable' | 'compact';
  checklist_items_per_page?: number;
}): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('user_preferences')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('idraulico_id', user.id);

  if (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }

  return true;
}
