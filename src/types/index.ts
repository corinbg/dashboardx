export type { ChecklistItem } from '../mocks/checklist';

export type Priority = 'alta' | 'media' | 'bassa' | 'none';
export type Category = 'riparazione' | 'follow-up' | 'materiali' | 'trasferte' | 'amministrativo' | 'formazione' | 'custom';

export interface ChecklistItem {
  id: string;
  testo: string;
  completata: boolean;
  completataAt?: string;
  priorita: Priority;
  categoria: Category;
  categoriaCustom?: string;
  dataScadenza?: string;
  dataPromemoria?: string;
  ricorrente?: 'none' | 'giornaliera' | 'settimanale' | 'mensile';
  ordine: number;
  createdAt: string;
  updatedAt: string;
  priorita: Priority;
  categoria: Category;
  categoriaCustom?: string;
  dataScadenza?: string;
  dataPromemoria?: string;
  ricorrente?: 'none' | 'giornaliera' | 'settimanale' | 'mensile';
  ordine: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  nominativo: string | null;
  telefono: string | null;
  comune: string | null;
  indirizzo: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Request {
  id: string;
  Nome: string;
  comune?: string;
  Indirizzo?: string;
  Luogo?: string;
  Problema: string;
  Urgenza: boolean;
  Numero: string;
  PreferenzaRicontatto: string;
  richiestaAt: string;
  stato: 'Non letto' | 'Letto' | 'Contattato' | 'Completato';
  spamFuoriZona: boolean;
}

export type ViewMode = 'table' | 'card';
export type FilterState = 'All' | 'Unread' | 'Read' | 'Contacted' | 'Completed';
export type UrgencyFilter = 'All' | 'Urgent' | 'Non-urgent';
export type DatePeriodFilter = 'today' | 'last3days' | 'last7days' | 'all' | 'custom';

export type EventType = 'Sopralluogo' | 'Riparazione' | 'Installazione' | 'Manutenzione';
export type EventStatus = 'Programmato' | 'In corso' | 'Completato' | 'Cancellato';
export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  titolo: string;
  cliente_id: string | null;
  cliente_nome: string | null;
  data_inizio: string;
  data_fine: string;
  tipo_intervento: EventType;
  indirizzo: string | null;
  note: string | null;
  stato: EventStatus;
  idraulico_id: string;
  created_at: string;
  updated_at: string;
}