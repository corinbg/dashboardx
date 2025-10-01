import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, User, Phone, MapPin, Home, Users, MessageCircle, Plus, ArrowUpDown, MessageSquare } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Client, ViewMode } from '../types';
import { ClientProfile } from '../components/Clients/ClientProfile';
import { NewClientModal } from '../components/Clients/NewClientModal';
import { EmptyState } from '../components/UI/EmptyState';
import { ViewToggle } from '../components/UI/ViewToggle';
import { createClient, getUniqueCities } from '../services/clientsService';

interface ClientsPageProps {
  onTabChange: (tab: string) => void;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
}

export function ClientsPage({ onTabChange, setConversationSearchPhoneNumber }: ClientsPageProps) {
  const { clients, requests, loading, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [requestsFilter, setRequestsFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'requests'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth < 768 ? 'card' : 'table';
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load unique cities for filter
  React.useEffect(() => {
    const loadCities = async () => {
      const cities = await getUniqueCities();
      setUniqueCities(cities);
    };
    loadCities();
  }, [clients]);

  const getClientRequestCount = (client: Client) => {
    return requests.filter(req => 
      req.Numero && client.telefono &&
      req.Numero.replace(/\s+/g, '') === client.telefono.replace(/\s+/g, '')
    ).length;
  };

  const filteredClients = clients.filter(client => {
    // Text search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        (client.nominativo || '').toLowerCase().includes(searchLower) ||
        (client.telefono || '').toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // City filter
    if (cityFilter !== 'all') {
      if (cityFilter === 'no-city') {
        if (client.comune) return false;
      } else {
        if (client.comune !== cityFilter) return false;
      }
    }

    // Requests count filter
    if (requestsFilter !== 'all') {
      const requestCount = getClientRequestCount(client);
      if (requestsFilter === '0' && requestCount !== 0) return false;
      if (requestsFilter === '1-3' && (requestCount < 1 || requestCount > 3)) return false;
      if (requestsFilter === '4+' && requestCount < 4) return false;
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      const nameA = (a.nominativo || '').toLowerCase();
      const nameB = (b.nominativo || '').toLowerCase();
      comparison = nameA.localeCompare(nameB);
    } else if (sortBy === 'requests') {
      const requestsA = getClientRequestCount(a);
      const requestsB = getClientRequestCount(b);
      comparison = requestsA - requestsB;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Enhanced filtering and sorting
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

  const handleCreateClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const result = await createClient(clientData);
    if (result) {
      await refreshData();
    } else {
      throw new Error('Failed to create client');
    }
  };

  const handleCallClient = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessageClient = (phone: string) => {
    // Open SMS app
    window.location.href = `sms:${phone}`;
  };

  const toggleSort = (newSortBy: 'name' | 'requests') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
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
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Clienti
              </h1>
              <button
                onClick={() => setNewClientModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                title="Aggiungi nuovo cliente"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Cliente
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredClients.length} clienti trovati
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6 rounded-lg shadow-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cerca
                </label>
                <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                  id="search"
                type="search"
                placeholder="Cerca per nome o telefono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Cerca clienti"
              />
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comune
                </label>
                <select
                  id="city-filter"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Tutti i comuni</option>
                  <option value="no-city">Senza comune</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Requests Filter */}
              <div>
                <label htmlFor="requests-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Richieste
                </label>
                <select
                  id="requests-filter"
                  value={requestsFilter}
                  onChange={(e) => setRequestsFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Tutte</option>
                  <option value="0">0 richieste</option>
                  <option value="1-3">1-3 richieste</option>
                  <option value="4+">4+ richieste</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ordinamento
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleSort('name')}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      sortBy === 'name' 
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    Nome
                    {sortBy === 'name' && (
                      <ArrowUpDown className={`h-3 w-3 ml-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  <button
                    onClick={() => toggleSort('requests')}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      sortBy === 'requests' 
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    Richieste
                    {sortBy === 'requests' && (
                      <ArrowUpDown className={`h-3 w-3 ml-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </div>
              </div>
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
                      Richieste totali
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Azioni
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
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {client.comune || client.indirizzo ? (
                          <div>
                            {client.comune && (
                              <div className="font-medium text-gray-900 dark:text-white">{client.comune}</div>
                            )}
                            {client.indirizzo && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{client.indirizzo}</div>
                            )}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                          getClientRequestCount(client) > 0 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {getClientRequestCount(client)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallClient(client.telefono!);
                            }}
                            disabled={!client.telefono}
                            className="inline-flex items-center p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={client.telefono ? `Chiama ${client.telefono}` : "Nessun numero di telefono"}
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageClient(client.telefono!);
                            }}
                            disabled={!client.telefono}
                            className="inline-flex items-center p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={client.telefono ? `Invia SMS a ${client.telefono}` : "Nessun numero di telefono"}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewConversationsFromClientList(client);
                            }}
                            disabled={!client.telefono}
                            className="inline-flex items-center p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={client.telefono ? "Visualizza conversazioni" : "Nessun numero di telefono"}
                        >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
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
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                      getClientRequestCount(client) > 0 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
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
                  {(client.comune || client.indirizzo) && (
                    <div className="flex items-start mb-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        {client.comune && (
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.comune}
                          </p>
                        )}
                        {client.indirizzo && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                            {client.indirizzo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Conversations Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallClient(client.telefono!);
                          }}
                          disabled={!client.telefono}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={client.telefono ? `Chiama ${client.telefono}` : "Nessun numero di telefono"}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Chiama
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageClient(client.telefono!);
                          }}
                          disabled={!client.telefono}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={client.telefono ? `Invia SMS a ${client.telefono}` : "Nessun numero di telefono"}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          SMS
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewConversationsFromClientList(client);
                        }}
                        disabled={!client.telefono}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={client.telefono ? "Visualizza conversazioni" : "Nessun numero di telefono disponibile"}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </button>
                    </div>
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
      
      {/* New Client Modal */}
      <NewClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSave={handleCreateClient}
      />
    </div>
  );
}