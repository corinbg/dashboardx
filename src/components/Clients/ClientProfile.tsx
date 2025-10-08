import React, { useState } from 'react';
import { X, User, Phone, MapPin, Home, Calendar, Wrench, FileText, MessageCircle, Trash2, Edit2, Save, AlertCircle, ChevronRight } from 'lucide-react';
import { Client, Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { PhoneInputWithCountryCode } from '../UI/PhoneInputWithCountryCode';

interface ClientProfileProps {
  client: Client | null;
  requests: Request[];
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
  onDelete?: (clientId: string) => Promise<void>;
  onUpdate?: (clientId: string, updates: Partial<Client>) => Promise<void>;
  onRequestClick?: (request: Request) => void;
}

export function ClientProfile({
  client,
  requests,
  isOpen,
  onClose,
  onTabChange,
  setConversationSearchPhoneNumber,
  onDelete,
  onUpdate,
  onRequestClick
}: ClientProfileProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    nominativo: '',
    telefono: '',
    comune: '',
    indirizzo: ''
  });

  React.useEffect(() => {
    if (client) {
      setEditData({
        nominativo: client.nominativo || '',
        telefono: client.telefono || '',
        comune: client.comune || '',
        indirizzo: client.indirizzo || ''
      });
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const clientRequests = requests.filter(req => 
    req.Numero && client.telefono &&
    req.Numero.replace(/\s+/g, '') === client.telefono.replace(/\s+/g, '')
  );

  const handleViewConversations = () => {
    if (client.telefono) {
      setConversationSearchPhoneNumber(client.telefono);
      onTabChange('conversazioni');
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!client || !onDelete) return;

    setDeleting(true);
    try {
      await onDelete(client.id);
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Errore durante l\'eliminazione del cliente');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!client || !onUpdate) return;

    // Check if any synced fields have changed
    const hasNameChange = editData.nominativo !== client.nominativo;
    const hasCityChange = editData.comune !== client.comune;
    const hasAddressChange = editData.indirizzo !== client.indirizzo;
    const hasSyncedChanges = hasNameChange || hasCityChange || hasAddressChange;

    // Count affected requests
    const affectedRequestsCount = clientRequests.length;

    // Show confirmation if there are synced changes and affected requests
    if (hasSyncedChanges && affectedRequestsCount > 0) {
      const changedFields = [];
      if (hasNameChange) changedFields.push('nome');
      if (hasCityChange) changedFields.push('città');
      if (hasAddressChange) changedFields.push('indirizzo');

      const fieldsText = changedFields.join(', ');
      const confirmed = window.confirm(
        `Stai modificando ${fieldsText} del cliente.\n\n` +
        `Questa modifica aggiornerà automaticamente ${affectedRequestsCount} ` +
        `${affectedRequestsCount === 1 ? 'richiesta associata' : 'richieste associate'}.\n\n` +
        `Vuoi continuare?`
      );

      if (!confirmed) {
        return;
      }
    }

    setSaving(true);
    try {
      await onUpdate(client.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Errore durante l\'aggiornamento del cliente');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                Profilo Cliente
              </h2>
              <div className="flex items-center space-x-2">
                {!isEditing && client.telefono && (
                  <button
                    onClick={handleViewConversations}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Visualizza conversazioni"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Conversazioni
                  </button>
                )}
                {!isEditing && onUpdate && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Modifica cliente"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Modifica
                  </button>
                )}
                {!isEditing && onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    disabled={deleting}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Elimina cliente"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Elimina
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          nominativo: client.nominativo || '',
                          telefono: client.telefono || '',
                          comune: client.comune || '',
                          indirizzo: client.indirizzo || ''
                        });
                      }}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving ? 'Salvataggio...' : 'Salva'}
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Chiudi profilo cliente"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Dati Personali
                  </h3>

                  {!isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.nominativo || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nome completo</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <a
                            href={`tel:${client.telefono}`}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {client.telefono}
                          </a>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Telefono</p>
                        </div>
                      </div>

                      {(client.comune || client.indirizzo) && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                          <div className="flex-1">
                            {client.comune && (
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {client.comune}
                              </p>
                            )}
                            {client.indirizzo && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                {client.indirizzo}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Indirizzo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clientRequests.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-medium mb-1">Sincronizzazione automatica</p>
                              <p>Le modifiche a nome, città e indirizzo verranno applicate automaticamente a {clientRequests.length} {clientRequests.length === 1 ? 'richiesta associata' : 'richieste associate'}.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="edit-nominativo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          id="edit-nominativo"
                          required
                          value={editData.nominativo}
                          onChange={(e) => setEditData({ ...editData, nominativo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefono *
                        </label>
                        <PhoneInputWithCountryCode
                          value={editData.telefono}
                          onChange={(value) => setEditData({ ...editData, telefono: value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-comune" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Comune
                        </label>
                        <input
                          type="text"
                          id="edit-comune"
                          value={editData.comune}
                          onChange={(e) => setEditData({ ...editData, comune: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-indirizzo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Indirizzo
                        </label>
                        <input
                          type="text"
                          id="edit-indirizzo"
                          value={editData.indirizzo}
                          onChange={(e) => setEditData({ ...editData, indirizzo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Statistiche
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Richieste totali</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {clientRequests.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Completate</span>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {clientRequests.filter(r => r.stato === 'Completato').length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Request History */}
              {!isEditing && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Storico Richieste ({clientRequests.length})
                  </h3>
                
                {clientRequests.length > 0 ? (
                  <div className="space-y-3">
                    {clientRequests.map((request, index) => (
                      <button
                        key={request.id}
                        onClick={() => onRequestClick?.(request)}
                        className="w-full text-left border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(request.richiestaAt)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={request.stato} size="sm" />
                            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Wrench className="h-4 w-4 text-gray-400" aria-hidden="true" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {request.Problema}
                          </span>
                        </div>

                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5" aria-hidden="true" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {(request.comune || request.Indirizzo || request.Luogo) && (
                              <div className="mb-1">
                                <span className="font-medium">Luogo:</span>{' '}
                                {request.comune && <span>{request.comune}</span>}
                                {request.Indirizzo && <span className="text-xs">, {request.Indirizzo}</span>}
                                {!request.comune && !request.Indirizzo && request.Luogo && <span>{request.Luogo}</span>}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Preferenza ricontatto:</span> {request.PreferenzaRicontatto}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Nessuna richiesta trovata per questo cliente.
                  </p>
                )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare il cliente "${client?.nominativo}"? Questa azione non può essere annullata e verranno eliminati tutti i dati associati.`}
        confirmLabel="Elimina Cliente"
        cancelLabel="Annulla"
        isLoading={deleting}
      />
    </>
  );
}