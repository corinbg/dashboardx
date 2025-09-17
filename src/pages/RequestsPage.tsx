import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, FilterState, UrgencyFilter, Request, DatePeriodFilter, Client } from '../types';
import { useApp } from '../contexts/AppContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { RequestsFilters } from '../components/Requests/RequestsFilters';
import { RequestTable } from '../components/Requests/RequestTable';
import { RequestCards } from '../components/Requests/RequestCards';
import { RequestDrawer } from '../components/Requests/RequestDrawer';
import { ClientProfile } from '../components/Clients/ClientProfile';
import { ViewToggle } from '../components/UI/ViewToggle';
import { EmptyState } from '../components/UI/EmptyState';

interface RequestsPageProps {
  onTabChange: (tab: string) => void;
  setConversationSearchPhoneNumber: (phone: string | null) => void;
}

export function RequestsPage({ onTabChange, setConversationSearchPhoneNumber }: RequestsPageProps) {
  const { requests, clients, loading } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Default to card view on mobile devices
    return window.innerWidth < 768 ? 'card' : 'table';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [datePeriodFilter, setDatePeriodFilter] = useState<DatePeriodFilter>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('All');
  const [statusFilter, setStatusFilter] = useState<FilterState>('All');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);

  // Handle window resize to automatically switch view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'table') {
        setViewMode('card');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setDatePeriodFilter('all');
    setUrgencyFilter('All');
    setStatusFilter('All');
    setSelectedIndex(-1);
  };

  const focusSearch = () => {
    searchRef.current?.focus();
  };

  useKeyboardShortcuts({
    onFocusSearch: focusSearch,
    onResetFilters: resetFilters
  });

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [drawerOpen]);

  // Helper function to check if a date falls within the selected period
  const isDateInPeriod = (requestDate: string): boolean => {
    const reqDate = new Date(requestDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    switch (datePeriodFilter) {
      case 'today':
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return reqDate >= todayStart && reqDate <= today;
      
      case 'last3days':
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 2);
        threeDaysAgo.setHours(0, 0, 0, 0);
        return reqDate >= threeDaysAgo && reqDate <= today;
      
      case 'last7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return reqDate >= sevenDaysAgo && reqDate <= today;
      
      case 'all':
        return true;
      
      case 'custom':
        const requestDateOnly = new Date(requestDate).toISOString().split('T')[0];
        return requestDateOnly === selectedDate;
      
      default:
        return true;
    }
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleViewClientProfileFromRequest = (request: Request) => {
    if (!request.Numero) return;
    
    // Normalize phone numbers for comparison
    const normalizePhone = (phone: string) => phone.replace(/\s+/g, '');
    const requestPhone = normalizePhone(request.Numero);
    
    // Find the client with matching phone number
    const foundClient = clients.find(client => 
      client.telefono && normalizePhone(client.telefono) === requestPhone
    );
    
    if (foundClient) {
      // Close request drawer and open client profile
      closeDrawer();
      setSelectedClient(foundClient);
      setClientModalOpen(true);
    }
  };

  const closeClientModal = () => {
    setClientModalOpen(false);
    setSelectedClient(null);
  };
  const handleStatusUpdate = (updatedRequest: Request) => {
    // Update the selected request immediately for instant UI feedback
    setSelectedRequest(updatedRequest);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter and sort requests
  const filteredRequests = requests.filter(request => {
    // Date period filter
    if (!isDateInPeriod(request.richiestaAt)) return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        request.Nome.toLowerCase().includes(searchLower) ||
        request.Numero.toLowerCase().includes(searchLower) ||
        request.Luogo.toLowerCase().includes(searchLower) ||
        request.Problema.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Urgency filter
    if (urgencyFilter === 'Urgent' && !(request.Urgenza === 'true' || request.Urgenza === 'Sì')) return false;
    if (urgencyFilter === 'Non-urgent' && (request.Urgenza === 'true' || request.Urgenza === 'Sì')) return false;

    // Status filter
    if (statusFilter !== 'All') {
      // Map English filter values to Italian database values
      const statusMap: Record<FilterState, Request['stato'] | null> = {
        'All': null,
        'Unread': 'Non letto',
        'Read': 'Letto',
        'Contacted': 'Contattato',
        'Completed': 'Completato'
      };
      const dbStatus = statusMap[statusFilter];
      if (dbStatus && request.stato !== dbStatus) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by request time (most recent first) - PRIMARY CRITERION
    const timeA = new Date(a.richiestaAt).getTime();
    const timeB = new Date(b.richiestaAt).getTime();
    
    // If dates are different, sort by date
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    
    // Sort by completion status (completed last)
    if (a.stato === 'Completato' && b.stato !== 'Completato') return 1;
    if (b.stato === 'Completato' && a.stato !== 'Completato') return -1;

    // Sort by urgency (urgent first)
    const aUrgent = a.Urgenza === 'true' || a.Urgenza === 'Sì';
    const bUrgent = b.Urgenza === 'true' || b.Urgenza === 'Sì';
    if (aUrgent && !bUrgent) return -1;
    if (bUrgent && !aUrgent) return 1;
    
    // If everything else is equal, maintain current order
    return 0;
  });

  // Get period description for the header
  const getPeriodDescription = () => {
    switch (datePeriodFilter) {
      case 'today':
        return `for today (${new Date().toLocaleDateString('en-US')})`;
      case 'last3days':
        return 'in the last 3 days';
      case 'last7days':
        return 'in the last 7 days';
      case 'all':
        return 'in total';
      case 'custom':
        return `for ${new Date(selectedDate).toLocaleDateString('en-US')}`;
      default:
        return '';
    }
  };
  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RequestsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        datePeriodFilter={datePeriodFilter}
        onDatePeriodFilterChange={setDatePeriodFilter}
        urgencyFilter={urgencyFilter}
        onUrgencyFilterChange={setUrgencyFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={resetFilters}
        ref={searchRef}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Requests
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredRequests.length} request(s) {getPeriodDescription()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            type="requests"
            title="No requests found"
            description="There are no requests matching the selected filters."
          />
        ) : (
          <div className="space-y-6">
            {viewMode === 'table' ? (
              <RequestTable
                requests={filteredRequests}
                onRequestClick={handleRequestClick}
                selectedIndex={selectedIndex}
                onSelectedChange={setSelectedIndex}
              />
            ) : (
              <RequestCards
                requests={filteredRequests}
                onRequestClick={handleRequestClick}
                selectedIndex={selectedIndex}
                onSelectedChange={setSelectedIndex}
              />
            )}
          </div>
        )}
      </main>

      {/* Request Drawer */}
      <RequestDrawer
        request={selectedRequest}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onStatusUpdate={handleStatusUpdate}
        onViewClientProfile={handleViewClientProfileFromRequest}
      />

      {/* Client Profile Modal */}
      <ClientProfile
        client={selectedClient}
        requests={requests}
        isOpen={clientModalOpen}
        onClose={closeClientModal}
        onTabChange={onTabChange}
        setConversationSearchPhoneNumber={setConversationSearchPhoneNumber}
      />
    </div>
  );
}