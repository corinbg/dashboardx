import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MapPin, FileText, Tag, Trash2, Edit2, CheckCircle } from 'lucide-react';
import { CalendarEvent, EventType, EventStatus } from '../../types';
import { getClients } from '../../services/clientsService';

interface EventDrawerProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function EventDrawer({ event, isOpen, onClose, onUpdate, onDelete }: EventDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string; nominativo: string; indirizzo: string | null }>>([]);
  const [useExistingClient, setUseExistingClient] = useState(false);

  const [editData, setEditData] = useState({
    titolo: '',
    cliente_id: '',
    cliente_nome: '',
    data: '',
    ora_inizio: '',
    durata_ore: '',
    durata_minuti: '',
    tipo_intervento: 'Riparazione' as EventType,
    indirizzo: '',
    note: '',
    stato: 'Programmato' as EventStatus,
  });

  useEffect(() => {
    if (event && isOpen) {
      loadClients();
      const dataInizio = new Date(event.data_inizio);
      const dataFine = new Date(event.data_fine);
      const durationMs = dataFine.getTime() - dataInizio.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      setEditData({
        titolo: event.titolo,
        cliente_id: event.cliente_id || '',
        cliente_nome: event.cliente_nome || '',
        data: dataInizio.toISOString().split('T')[0],
        ora_inizio: dataInizio.toTimeString().slice(0, 5),
        durata_ore: hours.toString(),
        durata_minuti: minutes.toString(),
        tipo_intervento: event.tipo_intervento,
        indirizzo: event.indirizzo || '',
        note: event.note || '',
        stato: event.stato,
      });

      setUseExistingClient(!!event.cliente_id);
    }
  }, [event, isOpen]);

  const loadClients = async () => {
    const clientsList = await getClients();
    setClients(clientsList.filter(c => c.nominativo));
  };

  const handleSave = async () => {
    if (!event) return;

    setLoading(true);
    try {
      const [hours, minutes] = editData.ora_inizio.split(':').map(Number);
      const dataInizio = new Date(editData.data);
      dataInizio.setHours(hours, minutes, 0, 0);

      const durationHours = parseInt(editData.durata_ore) || 0;
      const durationMinutes = parseInt(editData.durata_minuti) || 0;
      const dataFine = new Date(dataInizio);
      dataFine.setHours(dataFine.getHours() + durationHours);
      dataFine.setMinutes(dataFine.getMinutes() + durationMinutes);

      const selectedClient = clients.find(c => c.id === editData.cliente_id);

      const updates = {
        titolo: editData.titolo,
        cliente_id: useExistingClient && editData.cliente_id ? editData.cliente_id : null,
        cliente_nome: useExistingClient && selectedClient ? selectedClient.nominativo : (editData.cliente_nome || null),
        data_inizio: dataInizio.toISOString(),
        data_fine: dataFine.toISOString(),
        tipo_intervento: editData.tipo_intervento,
        indirizzo: editData.indirizzo || (useExistingClient && selectedClient ? selectedClient.indirizzo : null),
        note: editData.note || null,
        stato: editData.stato,
      };

      await onUpdate(event.id, updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Errore durante l\'aggiornamento dell\'evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setLoading(true);
    try {
      await onDelete(event.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Errore durante l\'eliminazione dell\'evento');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusUpdate = async (newStatus: EventStatus) => {
    if (!event) return;

    setLoading(true);
    try {
      await onUpdate(event.id, { stato: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Errore durante l\'aggiornamento dello stato');
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    setEditData(prev => ({ ...prev, cliente_id: clientId }));
    const client = clients.find(c => c.id === clientId);
    if (client && client.indirizzo) {
      setEditData(prev => ({ ...prev, indirizzo: client.indirizzo || '' }));
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (stato: EventStatus) => {
    switch (stato) {
      case 'Programmato':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'In corso':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Completato':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Cancellato':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div className="w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-scroll">
              <div className="flex-1">
                <div className="px-4 py-6 bg-blue-600 dark:bg-blue-800 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 id="drawer-title" className="text-lg font-medium text-white">
                      {isEditing ? 'Modifica Appuntamento' : 'Dettagli Appuntamento'}
                    </h2>
                    <div className="ml-3 h-7 flex items-center">
                      <button
                        onClick={onClose}
                        className="bg-blue-700 dark:bg-blue-900 rounded-md text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <span className="sr-only">Chiudi pannello</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-6 sm:px-6">
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          {event.titolo}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.stato)}`}>
                          {event.stato}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data e Ora</p>
                            <p className="text-base text-gray-900 dark:text-white">{formatDateTime(event.data_inizio)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Fine: {new Date(event.data_fine).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo Intervento</p>
                            <p className="text-base text-gray-900 dark:text-white">{event.tipo_intervento}</p>
                          </div>
                        </div>

                        {(event.cliente_nome || event.cliente_id) && (
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
                              <p className="text-base text-gray-900 dark:text-white">{event.cliente_nome || 'Cliente collegato'}</p>
                            </div>
                          </div>
                        )}

                        {event.indirizzo && (
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Indirizzo</p>
                              <p className="text-base text-gray-900 dark:text-white">{event.indirizzo}</p>
                            </div>
                          </div>
                        )}

                        {event.note && (
                          <div className="flex items-start">
                            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Note</p>
                              <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{event.note}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {event.stato !== 'Completato' && event.stato !== 'Cancellato' && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Azioni Rapide</p>
                          <div className="flex gap-2">
                            {event.stato === 'Programmato' && (
                              <button
                                onClick={() => handleQuickStatusUpdate('In corso')}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900"
                              >
                                Inizia
                              </button>
                            )}
                            {event.stato === 'In corso' && (
                              <button
                                onClick={() => handleQuickStatusUpdate('Completato')}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completa
                              </button>
                            )}
                            <button
                              onClick={() => handleQuickStatusUpdate('Cancellato')}
                              disabled={loading}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancella
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="edit-titolo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Titolo *
                        </label>
                        <input
                          type="text"
                          id="edit-titolo"
                          required
                          value={editData.titolo}
                          onChange={(e) => setEditData({ ...editData, titolo: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="edit-useExistingClient"
                            checked={useExistingClient}
                            onChange={(e) => setUseExistingClient(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="edit-useExistingClient" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Collega a cliente esistente
                          </label>
                        </div>

                        {useExistingClient ? (
                          <select
                            value={editData.cliente_id}
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
                        ) : (
                          <input
                            type="text"
                            value={editData.cliente_nome}
                            onChange={(e) => setEditData({ ...editData, cliente_nome: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                            placeholder="Nome cliente"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data *
                          </label>
                          <input
                            type="date"
                            required
                            value={editData.data}
                            onChange={(e) => setEditData({ ...editData, data: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ora *
                          </label>
                          <input
                            type="time"
                            required
                            value={editData.ora_inizio}
                            onChange={(e) => setEditData({ ...editData, ora_inizio: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ore
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={editData.durata_ore}
                            onChange={(e) => setEditData({ ...editData, durata_ore: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Minuti
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={editData.durata_minuti}
                            onChange={(e) => setEditData({ ...editData, durata_minuti: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tipo Intervento *
                        </label>
                        <select
                          required
                          value={editData.tipo_intervento}
                          onChange={(e) => setEditData({ ...editData, tipo_intervento: e.target.value as EventType })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        >
                          <option value="Sopralluogo">Sopralluogo</option>
                          <option value="Riparazione">Riparazione</option>
                          <option value="Installazione">Installazione</option>
                          <option value="Manutenzione">Manutenzione</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Stato *
                        </label>
                        <select
                          required
                          value={editData.stato}
                          onChange={(e) => setEditData({ ...editData, stato: e.target.value as EventStatus })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        >
                          <option value="Programmato">Programmato</option>
                          <option value="In corso">In corso</option>
                          <option value="Completato">Completato</option>
                          <option value="Cancellato">Cancellato</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Indirizzo
                        </label>
                        <input
                          type="text"
                          value={editData.indirizzo}
                          onChange={(e) => setEditData({ ...editData, indirizzo: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Note
                        </label>
                        <textarea
                          rows={3}
                          value={editData.note}
                          onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 px-4 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                <div>
                  {!isEditing && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Elimina
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Salvataggio...' : 'Salva'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Chiudi
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifica
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Elimina Appuntamento
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sei sicuro di voler eliminare questo appuntamento? Questa azione non può essere annullata.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Eliminazione...' : 'Elimina'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
