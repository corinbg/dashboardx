import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, User, Phone, MapPin, Home, RefreshCw, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Client, ViewMode } from '../types';
import { ClientProfile } from '../components/Clients/ClientProfile';
import { EmptyState } from '../components/UI/EmptyState';
import { ViewToggle } from '../components/UI/ViewToggle';
import { syncClientsFromRequests } from '../services/clientsService';

export function ClientsPage() {
  const { clients, requests, loading, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth < 768 ? 'card' : 'table';
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ created: number; updated: number; errors: number } | null>(null);
  const [showSyncResult, setShowSyncResult] = useState(false);

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
      client.nominativo.toLowerCase().includes(searchLower) ||
      client.telefono.toLowerCase().includes(searchLower)
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

  const handleSyncClients = async () => {
    setSyncing(true);
    setSyncResult(null);
    setShowSyncResult(false);

    try {
      const result = await syncClientsFromRequests();
      
      if (result.success) {
        setSyncResult({ created: result.created, updated: result.updated, errors: result.errors });
        setShowSyncResult(true);
        
        // Refresh data to show new clients
        await refreshData();
        
        // Auto-hide result after 5 seconds
        setTimeout(() => {
          setShowSyncResult(false);
        }, 5000);
      } else {
        alert('Errore durante la sincronizzazione. Controlla la console per i dettagli.');
      }
    } catch (error) {
      console.error('Error syncing clients:', error);
      alert('Errore durante la sincronizzazione.');
    } finally {
      setSyncing(false);
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
              Clients
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredClients.length} clients found
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={handleSyncClients}
              disabled={syncing}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Sync clients from requests"
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Override from requests</span>
                  <span className="sm:hidden">Sync</span>
                </>
              )}
            </button>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Sync Result Notification */}
        {showSyncResult && syncResult && (
          <div className={`mb-6 rounded-md p-4 border ${
            syncResult.errors > 0 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {syncResult.errors > 0 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  syncResult.errors > 0
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  Synchronization completed
                </h3>
                <div className={`mt-2 text-sm space-y-1 ${
                  syncResult.errors > 0
                    ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-green-700 dark:text-green-300'
                }`}>
                  {syncResult.created > 0 && (
                    <p>✅ {syncResult.created} new clients created</p>
                  )}
                  {syncResult.updated > 0 && (
                    <p>🔄 {syncResult.updated} clients updated</p>
                  )}
                  {syncResult.created === 0 && syncResult.updated === 0 && syncResult.errors === 0 && (
                    <p>ℹ️ Client database already synchronized</p>
                  )}
                  {syncResult.errors > 0 && (
                    <p>⚠️ {syncResult.errors} errors during processing</p>
                  )}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowSyncResult(false)}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      syncResult.errors > 0
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 focus:ring-yellow-600 focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900/20'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 focus:ring-green-600 focus:ring-offset-green-50 dark:focus:ring-offset-green-900/20'
                    }`}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <span className="text-sm font-medium text-gray-900 dark:text-white">Filters</span>
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
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Search clients"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredClients.length === 0 ? (
          <EmptyState
            type="clients"
            title={searchTerm ? "No clients found" : "No clients"}
            description={searchTerm ? "Try modifying your search terms." : "There are no registered clients yet. Use the 'Sync from requests' button to auto-populate from the requests list."}
          />
        ) : (
          <>
          {viewMode === 'table' ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            {/* Mobile hint */}
            <div className="md:hidden p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                💡 Scroll horizontally to see all fields
              </p>
            </div>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total requests
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
                      aria-label={`View profile of ${client.nominativo}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleClientClick(client);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {client.nominativo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <a 
                          href={`tel:${client.telefono}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {client.telefono}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {client.luogo || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {client.indirizzo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {getClientRequestCount(client)}
                        </span>
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
                  aria-label={`View profile of ${client.nominativo}`}
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
                        {client.nominativo}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {getClientRequestCount(client)} requests
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                    <a 
                      href={`tel:${client.telefono}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.telefono}
                    </a>
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
      />
    </div>
  );
}