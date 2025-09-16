export interface ChecklistItem {
  id: string;
  testo: string;
  completata: boolean;
  completataAt?: string;
}

export const mockChecklist: ChecklistItem[] = [
  {
    id: '1',
    testo: 'Controllo scorte guarnizioni O-ring',
    completata: false
  },
  {
    id: '2',
    testo: 'Verificare livello serbatoio furgone',
    completata: false
  },
  {
    id: '3',
    testo: 'Preparare preventivo installazione caldaia',
    completata: false
  },
  {
    id: '4',
    testo: 'Ordinare pezzi di ricambio Bosch',
    completata: true,
    completataAt: '2025-01-26T14:30:00Z'
  },
  {
    id: '5',
    testo: 'Contattare fornitore per preventivo',
    completata: true,
    completataAt: '2025-01-25T16:45:00Z'
  },
  {
    id: '6',
    testo: 'Aggiornare certificazioni sicurezza',
    completata: true,
    completataAt: '2025-01-24T10:15:00Z'
  }
];