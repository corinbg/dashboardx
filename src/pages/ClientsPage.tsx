import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, User, Phone, MapPin, Home, Users, MessageCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Client, ViewMode } from '../types';
import { ClientProfile } from '../components/Clients/ClientProfile';
import { EmptyState } from '../components/UI/EmptyState';
import { ViewToggle } from '../components/UI/ViewToggle';

interface ClientsPageProps {
  onTabChange: (tab: string) => void;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
}

export function ClientsPage({ onTabChange, setConversationSearchPhoneNumber }: ClientsPageProps) {
  const { clients, requests, loading, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth < 768 ? 'card' : 'table';
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const getClientRequestCount = (client: Client) => {
    return requests.filter(req => 
      req.Numero && client.telefono &&
      req.Numero.replace(/\s+/g, '') === client.telefono.replace(/\s+/g, '')
    ).length;
  };

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (client.nominativo || '').toLowerCase().includes(searchLower) ||
      (client.telefono || '').toLowerCase().includes(searchLower)
    );
  });

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
  };

  const handleViewConversationsFromClientList = (client: Client) => {
    if (client.telefono) {
      setConversationSearchPhoneNumber(client.telefono);
      onTabChange('conversazioni');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Clienti
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredClients.length} clienti trovati
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-6 rounded-lg shadow-sm">
          {/* Mobile filter toggle */}
          <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Filtri</span>
              </div>
              {mobileFiltersOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Filters content */}
          <div className={`p-4 ${mobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                placeholder="Cerca per nome o telefono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Cerca clienti"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredClients.length === 0 ? (
          <EmptyState
            type="clients"
            title={searchTerm ? "Nessun cliente trovato" : "Nessun cliente"}
            description={searchTerm ? "Prova a modificare i termini di ricerca." : "Non ci sono ancora clienti registrati."}
          />
        ) : (
          <>
          {viewMode === 'table' ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            {/* Mobile hint */}
            <div className="md:hidden p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                💡 Scorri orizzontalmente per vedere tutti i campi
              </p>
            </div>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Telefono
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Luogo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Indirizzo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Richieste totali
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Conversazioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => handleClientClick(client)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                      tabIndex={0}
                      role="button"
                      aria-label={`View profile of ${client.nominativo || 'Unknown'}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleClientClick(client);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {client.nominativo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {client.telefono ? (
                          <a 
                            href={`tel:${client.telefono}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {client.telefono}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {client.luogo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {client.indirizzo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {getClientRequestCount(client)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewConversationsFromClientList(client);
                          }}
                          disabled={!client.telefono}
                          className="inline-flex items-center px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={client.telefono ? "Visualizza conversazioni" : "Nessun numero di telefono"}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  role="button"
                  aria-label={`View profile of ${client.nominativo || 'Unknown'}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClientClick(client);
                    }
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {client.nominativo || 'N/A'}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {getClientRequestCount(client)} richieste
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                    {client.telefono ? (
                      <a 
                        href={`tel:${client.telefono}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {client.telefono}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </div>

                  {/* Location */}
                  {client.luogo && (
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {client.luogo}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  {client.indirizzo && (
                    <div className="flex items-start">
                      <Home className="h-4 w-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {client.indirizzo}
                      </p>
                    </div>
                  )}

                  {/* Conversations Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewConversationsFromClientList(client);
                      }}
                      disabled={!client.telefono}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title={client.telefono ? "Visualizza conversazioni" : "Nessun numero di telefono disponibile"}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Visualizza Conversazioni
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </>
        )}
      </main>

      {/* Client Profile Modal */}
      <ClientProfile
        client={selectedClient}
        requests={requests}
        isOpen={modalOpen}
        onClose={closeModal}
        onTabChange={onTabChange}
        setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
      />
    </div>
  );
}