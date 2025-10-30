import React, { useState } from 'react';
import { X, EyeOff, Eye, PhoneCall, CheckCircle2, AlertCircle, Phone, MapPin, Wrench } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';

interface QuickStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickStatusUpdateModal({ isOpen, onClose }: QuickStatusUpdateModalProps) {
  const { requests, updateRequestStatus } = useApp();
  const [updating, setUpdating] = useState<string | null>(null);

  // Filter non-completed requests, sorted by most recent
  const pendingRequests = requests
    .filter(req => req.stato !== 'Completato')
    .sort((a, b) => new Date(b.richiestaAt).getTime() - new Date(a.richiestaAt).getTime())
    .slice(0, 8); // Show max 8 requests

  const handleStatusUpdate = async (requestId: string, newStatus: Request['stato']) => {
    setUpdating(requestId);
    try {
      await updateRequestStatus(requestId, newStatus);
      // If we just completed the last pending request, close the modal
      if (pendingRequests.length === 1 && newStatus === 'Completato') {
        setTimeout(() => onClose(), 500);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Errore durante l\'aggiornamento dello stato');
    } finally {
      setUpdating(null);
    }
  };

  const statusButtons: Array<{
    status: Request['stato'];
    color: 'red' | 'yellow' | 'blue' | 'green';
    icon: React.ComponentType<any>;
    label: string;
  }> = [
    { status: 'Non letto', color: 'red', icon: EyeOff, label: 'Non letto' },
    { status: 'Letto', color: 'yellow', icon: Eye, label: 'Letto' },
    { status: 'Contattato', color: 'blue', icon: PhoneCall, label: 'Contattato' },
    { status: 'Completato', color: 'green', icon: CheckCircle2, label: 'Completato' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Aggiorna Stato Richieste
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Chiudi modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Tutto completato!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Non ci sono richieste in sospeso da aggiornare.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Seleziona lo stato per le richieste in sospeso ({pendingRequests.length} richieste):
                </p>

                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    {/* Request Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {request.Nome}
                            </h3>
                            <UrgencyBadge urgent={request.Urgenza} size="sm" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <Phone className="h-3 w-3 mr-1" />
                              <a
                                href={`tel:${request.Numero}`}
                                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                              >
                                {request.Numero}
                              </a>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <div className="flex flex-col">
                                {request.comune && (
                                  <span className="font-medium">{request.comune}</span>
                                )}
                                {request.Indirizzo && (
                                  <span className="text-gray-500 dark:text-gray-500">{request.Indirizzo}</span>
                                )}
                                {!request.comune && !request.Indirizzo && request.Luogo && (
                                  <span>{request.Luogo}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <Wrench className="h-3 w-3 mr-1" />
                              {request.Problema}
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <StatusBadge status={request.stato} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {statusButtons.map(({ status, color, icon: Icon, label }) => {
                        const isActive = request.stato === status;
                        const isUpdating = updating === request.id;

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
                            key={status}
                            onClick={() => handleStatusUpdate(request.id, status)}
                            disabled={isActive || isUpdating}
                            className={`relative px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                              isActive
                                ? `${colorClasses[color]} cursor-default ring-2 ring-opacity-50 ring-current`
                                : isUpdating
                                ? `${colorClasses[color]} opacity-75`
                                : `${colorClasses[color]} focus:outline-none focus:ring-2 focus:ring-offset-2`
                            }`}
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

                    {/* Request Time */}
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Richiesta: {new Date(request.richiestaAt).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {pendingRequests.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Aggiorna rapidamente lo stato delle richieste senza navigare alla pagina completa
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
