import React from 'react';
import { X, User, Phone, MapPin, Home, Calendar, Wrench, FileText, MessageCircle } from 'lucide-react';
import { Client, Request } from '../../types';
import { StatusBadge } from '../UI/StatusBadge';

interface ClientProfileProps {
  client: Client | null;
  requests: Request[];
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
}

export function ClientProfile({ 
  client, 
  requests, 
  isOpen, 
  onClose, 
  onTabChange, 
  setConversationSearchPhoneNumber 
}: ClientProfileProps) {
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
                Client Profile
              </h2>
              <div className="flex items-center space-x-2">
                {client.telefono && (
                  <button
                    onClick={handleViewConversations}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="View conversations"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Conversations
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close client profile"
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
                    Personal Data
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.indirizzo || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full name</p>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      </div>
                    </div>

                    {client.luogo && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.luogo}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                        </div>
                      </div>
                    )}

                    {client.indirizzo && (
                      <div className="flex items-start space-x-2">
                        <Home className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.indirizzo}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Full address</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total requests</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {clientRequests.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {clientRequests.filter(r => r.stato === 'Completato').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Request History ({clientRequests.length})
                </h3>
                
                {clientRequests.length > 0 ? (
                  <div className="space-y-3">
                    {clientRequests.map((request, index) => (
                      <div 
                        key={request.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(request.richiestaAt)}
                            </span>
                          </div>
                          <StatusBadge status={request.stato} size="sm" />
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
                            <div className="mb-1">
                              <span className="font-medium">Location:</span> {request.Luogo}
                            </div>
                            <span className="font-medium">Luogo:</span> {request.Luogo}
                            <div>
                              <span className="font-medium">Callback preference:</span> {request.PreferenzaRicontatto}
                            </div>
                            <span className="font-medium">Preferenza ricontatto:</span> {request.PreferenzaRicontatto}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No requests found for this client.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}