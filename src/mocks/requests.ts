export interface Request {
  id: string;
  nominativo: string;
  luogo: string;
  tipoIntervento: string;
  urgenza: boolean;
  telefono: string;
  ricontatto: string;
  richiestaAt: string;
  stato: 'Non letto' | 'Letto' | 'Contattato' | 'Completato';
  spamFuoriZona: boolean;
}

export const mockRequests: Request[] = [
  {
    id: '1',
    nominativo: 'Marco Rossi',
    luogo: 'Milano, via Luigi Settembrini 3',
    tipoIntervento: 'Riparazione perdita rubinetto',
    urgenza: true,
    telefono: '+39 320 1234567',
    ricontatto: 'Il prima possibile',
    richiestaAt: '2025-01-27T08:30:00Z',
    stato: 'Non letto',
    spamFuoriZona: false
  },
  {
    id: '2',
    nominativo: 'Anna Verdi',
    luogo: 'Milano, corso Buenos Aires 15',
    tipoIntervento: 'Manutenzione caldaia',
    urgenza: false,
    telefono: '+39 333 9876543',
    ricontatto: 'Oggi 17:00',
    richiestaAt: '2025-01-27T09:15:00Z',
    stato: 'Letto',
    spamFuoriZona: false
  },
  {
    id: '3',
    nominativo: 'Giuseppe Bianchi',
    luogo: 'Milano, via Torino 42',
    tipoIntervento: 'Installazione nuovo boiler',
    urgenza: true,
    telefono: '+39 347 5551234',
    ricontatto: 'Entro oggi',
    richiestaAt: '2025-01-27T10:45:00Z',
    stato: 'Contattato',
    spamFuoriZona: false
  },
  {
    id: '4',
    nominativo: 'Maria Neri',
    luogo: 'Milano, viale Monza 88',
    tipoIntervento: 'Spurgo lavandino',
    urgenza: false,
    telefono: '+39 338 7777888',
    ricontatto: 'Domani mattina',
    richiestaAt: '2025-01-27T14:20:00Z',
    stato: 'Completato',
    spamFuoriZona: false
  },
  {
    id: '5',
    nominativo: 'Luigi Ferrari',
    luogo: 'Milano, via Padova 156',
    tipoIntervento: 'Controllo pressione impianto',
    urgenza: false,
    telefono: '+39 329 4445566',
    ricontatto: 'Questa settimana',
    richiestaAt: '2025-01-26T16:30:00Z',
    stato: 'Non letto',
    spamFuoriZona: false
  },
  {
    id: '6',
    nominativo: 'Elena Romano',
    luogo: 'Milano, via Brera 12',
    tipoIntervento: 'Sostituzione guarnizioni',
    urgenza: true,
    telefono: '+39 345 1112233',
    ricontatto: 'Urgente - Oggi',
    richiestaAt: '2025-01-26T11:15:00Z',
    stato: 'Completato',
    spamFuoriZona: false
  },
  {
    id: '7',
    nominativo: 'Franco Conti',
    luogo: 'Roma, via del Corso 99',
    tipoIntervento: 'Riparazione perdita',
    urgenza: false,
    telefono: '+39 366 9998887',
    ricontatto: 'Non specificato',
    richiestaAt: '2025-01-25T13:45:00Z',
    stato: 'Non letto',
    spamFuoriZona: true
  },
  {
    id: '8',
    nominativo: 'Carla Moretti',
    luogo: 'Milano, corso di Porta Romana 45',
    tipoIntervento: 'Installazione rubinetteria',
    urgenza: false,
    telefono: '+39 392 3334445',
    ricontatto: 'Prossima settimana',
    richiestaAt: '2025-01-25T09:30:00Z',
    stato: 'Letto',
    spamFuoriZona: false
  }
];