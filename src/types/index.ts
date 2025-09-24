export type { ChecklistItem } from '../mocks/checklist';

export interface Client {
  id: string;
  nominativo: string | null;
  telefono: string | null;
  luogo: string | null;
  indirizzo: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Request {
  id: string;
  Nome: string;
  Luogo: string;
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