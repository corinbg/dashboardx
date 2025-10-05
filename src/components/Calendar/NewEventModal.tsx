import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MapPin, FileText, Tag } from 'lucide-react';
import { EventType } from '../../types';
import { getClients } from '../../services/clientsService';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => Promise<void>;
  initialDate?: Date;
}

export function NewEventModal({ isOpen, onClose, onSave, initialDate }: NewEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string; nominativo: string; indirizzo: string | null }>>([]);
  const [useExistingClient, setUseExistingClient] = useState(false);

  const [formData, setFormData] = useState({
    titolo: '',
    cliente_id: '',
    cliente_nome: '',
    data: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    ora_inizio: '09:00',
    durata_ore: '1',
    durata_minuti: '0',
    tipo_intervento: 'Riparazione' as EventType,
    indirizzo: '',
    note: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
      if (initialDate) {
        setFormData(prev => ({
          ...prev,
          data: initialDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [isOpen, initialDate]);

  const loadClients = async () => {
    const clientsList = await getClients();
    setClients(clientsList.filter(c => c.nominativo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [hours, minutes] = formData.ora_inizio.split(':').map(Number);
      const dataInizio = new Date(formData.data);
      dataInizio.setHours(hours, minutes, 0, 0);

      const durationHours = parseInt(formData.durata_ore) || 0;
      const durationMinutes = parseInt(formData.durata_minuti) || 0;
      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + durationHours);
      dataFine.setMinutes(dataFine.getMinutes() + durationMinutes);

      const selectedClient = clients.find(c => c.id === formData.cliente_id);

      const eventData = {
        titolo: formData.titolo,
        cliente_id: useExistingClient && formData.cliente_id ? formData.cliente_id : null,
        cliente_nome: useExistingClient && selectedClient ? selectedClient.nominativo : (formData.cliente_nome || null),
        data_inizio: dataInizio.toISOString(),
        data_fine: dataFine.toISOString(),
        tipo_intervento: formData.tipo_intervento,
        indirizzo: formData.indirizzo || (useExistingClient && selectedClient ? selectedClient.indirizzo : null),
        note: formData.note || null,
        stato: 'Programmato' as const,
      };

      await onSave(eventData);
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Errore durante la creazione dell\'evento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      titolo: '',
      cliente_id: '',
      cliente_nome: '',
      data: new Date().toISOString().split('T')[0],
      ora_inizio: '09:00',
      durata_ore: '1',
      durata_minuti: '0',
      tipo_intervento: 'Riparazione',
      indirizzo: '',
      note: '',
    });
    setUseExistingClient(false);
    onClose();
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, cliente_id: clientId }));
    const client = clients.find(c => c.id === clientId);
    if (client && client.indirizzo) {
      setFormData(prev => ({ ...prev, indirizzo: client.indirizzo || '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                Nuovo Appuntamento
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="titolo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titolo *
                </label>
                <input
                  type="text"
                  id="titolo"
                  required
                  value={formData.titolo}
                  onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  placeholder="Es. Riparazione caldaia"
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="useExistingClient"
                    checked={useExistingClient}
                    onChange={(e) => setUseExistingClient(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useExistingClient" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Collega a cliente esistente
                  </label>
                </div>

                {useExistingClient ? (
                  <div>
                    <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cliente
                    </label>
                    <select
                      id="cliente_id"
                      value={formData.cliente_id}
                      onChange={(e) => handleClientChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                    >
                      <option value="">Seleziona un cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.nominativo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cliente_nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome Cliente
                    </label>
                    <input
                      type="text"
                      id="cliente_nome"
                      value={formData.cliente_nome}
                      onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      placeholder="Opzionale"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="data"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="ora_inizio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ora Inizio *
                  </label>
                  <input
                    type="time"
                    id="ora_inizio"
                    required
                    value={formData.ora_inizio}
                    onChange={(e) => setFormData({ ...formData, ora_inizio: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durata *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="durata_ore" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Ore
                    </label>
                    <input
                      type="number"
                      id="durata_ore"
                      min="0"
                      max="23"
                      value={formData.durata_ore}
                      onChange={(e) => setFormData({ ...formData, durata_ore: e.target.value })}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="durata_minuti" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Minuti
                    </label>
                    <input
                      type="number"
                      id="durata_minuti"
                      min="0"
                      max="59"
                      step="15"
                      value={formData.durata_minuti}
                      onChange={(e) => setFormData({ ...formData, durata_minuti: e.target.value })}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="tipo_intervento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo Intervento *
                </label>
                <select
                  id="tipo_intervento"
                  required
                  value={formData.tipo_intervento}
                  onChange={(e) => setFormData({ ...formData, tipo_intervento: e.target.value as EventType })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                >
                  <option value="Sopralluogo">Sopralluogo</option>
                  <option value="Riparazione">Riparazione</option>
                  <option value="Installazione">Installazione</option>
                  <option value="Manutenzione">Manutenzione</option>
                </select>
              </div>

              <div>
                <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Indirizzo
                </label>
                <input
                  type="text"
                  id="indirizzo"
                  value={formData.indirizzo}
                  onChange={(e) => setFormData({ ...formData, indirizzo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  placeholder="Via, numero civico, città"
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Note
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  placeholder="Note aggiuntive sull'appuntamento"
                />
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvataggio...' : 'Crea Appuntamento'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
