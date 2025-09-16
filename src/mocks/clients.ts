export interface Client {
  id: string;
  nominativo: string;
  telefono: string;
  luogo?: string;
  indirizzo?: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    nominativo: 'Marco Rossi',
    telefono: '+39 320 1234567',
    luogo: 'Milano',
    indirizzo: 'via Luigi Settembrini 3, 20124 Milano'
  },
  {
    id: '2',
    nominativo: 'Anna Verdi',
    telefono: '+39 333 9876543',
    luogo: 'Milano',
    indirizzo: 'corso Buenos Aires 15, 20124 Milano'
  },
  {
    id: '3',
    nominativo: 'Giuseppe Bianchi',
    telefono: '+39 347 5551234',
    luogo: 'Milano',
    indirizzo: 'via Torino 42, 20123 Milano'
  },
  {
    id: '4',
    nominativo: 'Maria Neri',
    telefono: '+39 338 7777888',
    luogo: 'Milano',
    indirizzo: 'viale Monza 88, 20127 Milano'
  },
  {
    id: '5',
    nominativo: 'Luigi Ferrari',
    telefono: '+39 329 4445566',
    luogo: 'Milano',
    indirizzo: 'via Padova 156, 20127 Milano'
  },
  {
    id: '6',
    nominativo: 'Elena Romano',
    telefono: '+39 345 1112233',
    luogo: 'Milano',
    indirizzo: 'via Brera 12, 20121 Milano'
  },
  {
    id: '7',
    nominativo: 'Carla Moretti',
    telefono: '+39 392 3334445',
    luogo: 'Milano',
    indirizzo: 'corso di Porta Romana 45, 20122 Milano'
  },
  {
    id: '8',
    nominativo: 'Stefano Colombo',
    telefono: '+39 351 2223334',
    luogo: 'Milano',
    indirizzo: 'via Garibaldi 78, 20121 Milano'
  }
];