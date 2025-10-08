import React, { useState } from 'react';
import { X, User, MapPin, Wrench, Phone, Clock, Calendar, AlertCircle, Flag, ExternalLink, MessageCircle, EyeOff, Eye, PhoneCall, CheckCircle2, Trash2, Edit2, Save } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';
import { useApp } from '../../contexts/AppContext';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { PhoneInputWithCountryCode } from '../UI/PhoneInputWithCountryCode';

interface RequestDrawerProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (request: Request) => void;
  onViewClientProfile?: (request: Request) => void;
  onTabChange?: (tab: string) => void;
  setConversationSearchPhoneNumber?: (phone: string | null) => void;
  onDelete?: (requestId: string) => Promise<void>;
  onUpdate?: (requestId: string, updates: Partial<Request>) => Promise<void>;
}

export function RequestDrawer({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
  onViewClientProfile,
  onTabChange,
  setConversationSearchPhoneNumber,
  onDelete,
  onUpdate
}: RequestDrawerProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    Nome: '',
    Numero: '',
    comune: '',
    Indirizzo: '',
    Problema: '',
    Urgenza: 'Media' as Request['Urgenza'],
    PreferenzaRicontatto: '',
    stato: 'Nuovo' as Request['stato']
  });
  const { updateRequestStatus } = useApp();
  
  React.useEffect(() => {
    if (request) {
      setEditData({
        Nome: request.Nome || '',
        Numero: request.Numero || '',
        comune: request.comune || '',
        Indirizzo: request.Indirizzo || '',
        Problema: request.Problema || '',
        Urgenza: request.Urgenza || 'Media',
        PreferenzaRicontatto: request.PreferenzaRicontatto || '',
        stato: request.stato || 'Nuovo'
      });
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus: Request['stato']) => {
    if (request) {
      setUpdating(newStatus);
      try {
      await updateRequestStatus(request.id, newStatus);
        // Update the local request object and notify parent
        const updatedRequest = { ...request, stato: newStatus };
        onStatusUpdate?.(updatedRequest);
      } catch (error) {
        console.error('Error updating request status:', error);
        alert('Errore durante l\'aggiornamento dello stato');
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleViewConversations = () => {
    if (request?.Numero && setConversationSearchPhoneNumber && onTabChange) {
      setConversationSearchPhoneNumber(request.Numero);
      onTabChange('conversazioni');
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!request || !onDelete) return;

    setDeleting(true);
    try {
      await onDelete(request.id);
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Errore durante l\'eliminazione della richiesta');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!request || !onUpdate) return;

    // Check if any synced fields have changed
    const hasNameChange = editData.Nome !== request.Nome;
    const hasCityChange = editData.comune !== request.comune;
    const hasAddressChange = editData.Indirizzo !== request.Indirizzo;
    const hasSyncedChanges = hasNameChange || hasCityChange || hasAddressChange;

    // Show confirmation if there are synced changes
    if (hasSyncedChanges) {
      const changedFields = [];
      if (hasNameChange) changedFields.push('nome');
      if (hasCityChange) changedFields.push('città');
      if (hasAddressChange) changedFields.push('indirizzo');

      const fieldsText = changedFields.join(', ');
      const confirmed = window.confirm(
        `Stai modificando ${fieldsText} della richiesta.\n\n` +
        `Questa modifica aggiornerà automaticamente anche i dati del cliente associato.\n\n` +
        `Vuoi continuare?`
      );

      if (!confirmed) {
        return;
      }
    }

    setSaving(true);
    try {
      await onUpdate(request.id, editData);
      const updatedRequest = { ...request, ...editData };
      onStatusUpdate?.(updatedRequest);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Errore durante l\'aggiornamento della richiesta');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Modifica Richiesta' : 'Dettagli Richiesta'}
            </h2>
            <div className="flex items-center space-x-2">
              {!isEditing && onUpdate && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Modifica richiesta"
                >
                  <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        Nome: request.Nome || '',
                        Numero: request.Numero || '',
                        comune: request.comune || '',
                        Indirizzo: request.Indirizzo || '',
                        Problema: request.Problema || '',
                        Urgenza: request.Urgenza || 'Media',
                        PreferenzaRicontatto: request.PreferenzaRicontatto || '',
                        stato: request.stato || 'Nuovo'
                      });
                    }}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Salvataggio...' : 'Salva'}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Chiudi dettagli"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Sincronizzazione automatica</p>
                      <p>Le modifiche a nome, città e indirizzo verranno applicate automaticamente al cliente associato.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Cliente *
                  </label>
                  <input
                    type="text"
                    id="edit-nome"
                    required
                    value={editData.Nome}
                    onChange={(e) => setEditData({ ...editData, Nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefono *
                  </label>
                  <PhoneInputWithCountryCode
                    value={editData.Numero}
                    onChange={(value) => setEditData({ ...editData, Numero: value })}
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
                    value={editData.Indirizzo}
                    onChange={(e) => setEditData({ ...editData, Indirizzo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Problema *
                  </label>
                  <input
                    type="text"
                    id="edit-problema"
                    required
                    value={editData.Problema}
                    onChange={(e) => setEditData({ ...editData, Problema: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-urgenza" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Urgenza *
                  </label>
                  <select
                    id="edit-urgenza"
                    required
                    value={editData.Urgenza}
                    onChange={(e) => setEditData({ ...editData, Urgenza: e.target.value as Request['Urgenza'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bassa">Bassa</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-preferenza" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferenza Ricontatto *
                  </label>
                  <input
                    type="text"
                    id="edit-preferenza"
                    required
                    value={editData.PreferenzaRicontatto}
                    onChange={(e) => setEditData({ ...editData, PreferenzaRicontatto: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-stato" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stato *
                  </label>
                  <select
                    id="edit-stato"
                    required
                    value={editData.stato}
                    onChange={(e) => setEditData({ ...editData, stato: e.target.value as Request['stato'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nuovo">Nuovo</option>
                    <option value="Non letto">Non letto</option>
                    <option value="Letto">Letto</option>
                    <option value="Contattato">Contattato</option>
                    <option value="Completato">Completato</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.Nome}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <div className="flex flex-col items-start">
                      <a
                        href={`tel:${request.Numero}`}
                        className="inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {request.Numero}
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefono</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                    <div className="flex-1">
                      {request.comune && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.comune}
                        </p>
                      )}
                      {request.Indirizzo && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                          {request.Indirizzo}
                        </p>
                      )}
                      {!request.comune && !request.Indirizzo && request.Luogo && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.Luogo}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Indirizzo</p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div className="flex items-start space-x-2">
                <Wrench className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.Problema}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo di servizio</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.PreferenzaRicontatto}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ricontatto richiesto</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(request.richiestaAt)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data richiesta</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div className="flex items-center space-x-2">
                  <UrgencyBadge urgent={request.Urgenza} size="sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Urgenza</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div className="flex items-center space-x-2">
                  <StatusBadge status={request.stato} size="sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stato</p>
                </div>
              </div>

              {request.spamFuoriZona && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Segnalato come spam/fuori zona
                      </p>
                    </div>
                  </div>
                  </div>
                )}
              </div>
              </>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Azioni
            </h3>
            
            {/* Client Actions */}
            <div className="space-y-2">
              {onViewClientProfile && request.Numero && (
                <button
                  onClick={() => onViewClientProfile(request)}
                  className="w-full text-left px-3 py-2 text-sm rounded-md text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Visualizza profilo cliente
                  </div>
                </button>
              )}
              
              {request.Numero && setConversationSearchPhoneNumber && onTabChange && (
                <button
                  onClick={handleViewConversations}
                  className="w-full text-left px-3 py-2 text-sm rounded-md text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Visualizza conversazioni
                  </div>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="w-full text-left px-3 py-2 text-sm rounded-md text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Elimina richiesta
                  </div>
                </button>
              )}
            </div>

            {/* Status Update Section */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Aggiorna Stato
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'Non letto', color: 'red', icon: EyeOff, label: 'Non letto' },
                  { status: 'Letto', color: 'yellow', icon: Eye, label: 'Letto' },
                  { status: 'Contattato', color: 'blue', icon: PhoneCall, label: 'Contattato' },
                  { status: 'Completato', color: 'green', icon: CheckCircle2, label: 'Completato' }
                ].map(({ status, color, icon: Icon, label }) => {
                  const isActive = request?.stato === status;
                  const isUpdating = updating === status;
                  
                  const colorClasses = {
                    red: isActive 
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40',
                    yellow: isActive 
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700' 
                      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
                    blue: isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700' 
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40',
                    green: isActive 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700' 
                      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40'
                  };

                  return (
                    <button
                      key={status as string}
                      onClick={() => handleStatusUpdate(status as Request['stato'])}
                      disabled={isActive || updating !== null}
                      className={`relative px-3 py-3 text-xs font-medium rounded-lg border transition-all duration-200 touch-target ${
                        isActive 
                          ? `${colorClasses[color as keyof typeof colorClasses]} cursor-default ring-2 ring-opacity-50` 
                          : isUpdating
                          ? `${colorClasses[color as keyof typeof colorClasses]} opacity-75`
                          : `${colorClasses[color as keyof typeof colorClasses]} focus:outline-none focus:ring-2 focus:ring-offset-2`
                      } ${isActive ? 'ring-current' : ''}`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        <span className="text-center leading-tight">
                          {label}
                        </span>
                        {isActive && (
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Conferma Eliminazione"
        message="Sei sicuro di voler eliminare questa richiesta? Questa azione non può essere annullata e tutti i dati associati verranno eliminati."
        confirmLabel="Elimina Richiesta"
        cancelLabel="Annulla"
        isLoading={deleting}
      />
    </>
  );
}