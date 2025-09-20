import React, { useState } from 'react';
import { X, User, MapPin, Wrench, Phone, Clock, Calendar, AlertCircle, Flag, ExternalLink, MessageCircle } from 'lucide-react';
import { Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';
import { UrgencyBadge } from '../UI/UrgencyBadge';
import { useApp } from '../../contexts/AppContext';

interface RequestDrawerProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (request: Request) => void;
  onViewClientProfile?: (request: Request) => void;
  onTabChange?: (tab: string) => void;
  setConversationSearchPhoneNumber?: (phone: string | null) => void;
}

export function RequestDrawer({ 
  request, 
  isOpen, 
  onClose, 
  onStatusUpdate, 
  onViewClientProfile,
  onTabChange,
  setConversationSearchPhoneNumber 
}: RequestDrawerProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const { updateRequestStatus } = useApp();
  
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
      onClose(); // Chiudi il drawer
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
              Request Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close details"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Client Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.Nome}
                    </p>
                    {onViewClientProfile && request.Numero && (
                      <button
                        onClick={() => onViewClientProfile(request)}
                        className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        title="View client profile"
                      >
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`tel:${request.Numero}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {request.Numero}
                    </a>
                    <div className="flex items-center space-x-2">
                      {onViewClientProfile && request.Numero && (
                        <button
                          onClick={() => onViewClientProfile(request)}
                          className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 px-2 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="View client profile"
                        >
                          View client
                        </button>
                      )}
                      {request.Numero && setConversationSearchPhoneNumber && onTabChange && (
                        <button
                          onClick={handleViewConversations}
                          className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70 px-2 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                          title="View conversations with this client"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Conversations
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telefono</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.Luogo}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Service type</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.PreferenzaRicontatto}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Callback requested</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(request.richiestaAt)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Request date</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div className="flex items-center space-x-2">
                  <UrgencyBadge urgent={request.Urgenza === 'true' || request.Urgenza === 'Sì'} size="sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Urgency</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div className="flex items-center space-x-2">
                  <StatusBadge status={request.stato} size="sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                </div>
              </div>

              {request.spamFuoriZona && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Marked as spam/out of area
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Actions
              </h3>
              
              <div className="space-y-2">
                {['Non letto', 'Letto', 'Contattato', 'Completato'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status as Request['stato'])}
                    disabled={request?.stato === status || updating !== null}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors relative ${
                      request?.stato === status
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                        : updating === status
                        ? 'text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        Mark as {
                          status === 'Non letto' ? 'Unread' :
                          status === 'Letto' ? 'Read' :
                          status === 'Contattato' ? 'Contacted' :
                          status === 'Completato' ? 'Completed' : status
                        }
                        {request?.stato === status && ' (current)'}
                      </span>
                      {updating === status && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}