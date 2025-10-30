import { supabase } from '../lib/supabase';
import { CalendarEvent, EventType, EventStatus } from '../types';

export async function getEvents(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .order('data_inizio', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }

  return data || [];
}

export async function getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('data_inizio', startDate)
    .lte('data_inizio', endDate)
    .order('data_inizio', { ascending: true });

  if (error) {
    console.error('Error fetching events by date range:', error);
    return [];
  }

  return data || [];
}

export async function getEventsByDate(date: string): Promise<CalendarEvent[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('data_inizio', startOfDay.toISOString())
    .lte('data_inizio', endOfDay.toISOString())
    .order('data_inizio', { ascending: true });

  if (error) {
    console.error('Error fetching events by date:', error);
    return [];
  }

  return data || [];
}

export async function getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('data_inizio', now)
    .eq('stato', 'Programmato')
    .order('data_inizio', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  return data || [];
}

interface CreateEventData {
  titolo: string;
  cliente_id?: string | null;
  cliente_nome?: string | null;
  data_inizio: string;
  data_fine: string;
  tipo_intervento: EventType;
  indirizzo?: string | null;
  note?: string | null;
  stato?: EventStatus;
}

export async function createEvent(eventData: CreateEventData): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      titolo: eventData.titolo,
      cliente_id: eventData.cliente_id || null,
      cliente_nome: eventData.cliente_nome || null,
      data_inizio: eventData.data_inizio,
      data_fine: eventData.data_fine,
      tipo_intervento: eventData.tipo_intervento,
      indirizzo: eventData.indirizzo || null,
      note: eventData.note || null,
      stato: eventData.stato || 'Programmato',
      idraulico_id: user.id,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }

  return data?.id || null;
}

interface UpdateEventData {
  titolo?: string;
  cliente_id?: string | null;
  cliente_nome?: string | null;
  data_inizio?: string;
  data_fine?: string;
  tipo_intervento?: EventType;
  indirizzo?: string | null;
  note?: string | null;
  stato?: EventStatus;
}

export async function updateEvent(id: string, updates: UpdateEventData): Promise<boolean> {
  const { error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating event:', error);
    return false;
  }

  return true;
}

export async function updateEventStatus(id: string, stato: EventStatus): Promise<boolean> {
  return updateEvent(id, { stato });
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
}

export async function getEventById(id: string): Promise<CalendarEvent | null> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }

  return data;
}
