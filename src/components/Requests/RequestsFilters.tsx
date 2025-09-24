import React, { useRef, useState, useEffect } from 'react';
import { Search, Calendar, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState, UrgencyFilter, DatePeriodFilter } from '../../types';

interface RequestsFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  datePeriodFilter: DatePeriodFilter;
  onDatePeriodFilterChange: (filter: DatePeriodFilter) => void;
  urgencyFilter: UrgencyFilter;
  onUrgencyFilterChange: (filter: UrgencyFilter) => void;
  statusFilter: FilterState;
  onStatusFilterChange: (filter: FilterState) => void;
  onReset: () => void;
}

export function RequestsFilters({
  searchTerm,
  onSearchChange,
  selectedDate,
  onDateChange,
  datePeriodFilter,
  onDatePeriodFilterChange,
  urgencyFilter,
  onUrgencyFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset
}: RequestsFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Expose focus method for keyboard shortcuts
  React.useImperativeHandle(searchRef, () => ({
    focus: () => searchRef.current?.focus()
  }));

  // Open filters by default on mobile for better UX
  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileFiltersOpen(true);
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                  ref={searchRef}
                  id="search"
                  type="search"
                  placeholder="Nome, telefono, luogo, tipo..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  aria-describedby="search-description"
                />
                <div id="search-description" className="sr-only">
                  Cerca per nome, telefono, luogo o tipo di servizio
                </div>
              </div>
            </div>

            {/* Date Period Filter */}
            <div>
              <label htmlFor="date-period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periodo
              </label>
              <select
                id="date-period"
                value={datePeriodFilter}
                onChange={(e) => onDatePeriodFilterChange(e.target.value as DatePeriodFilter)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Filter by period"
              >
                <option value="today">Oggi</option>
                <option value="last3days">Ultimi 3 giorni</option>
                <option value="last7days">Ultimi 7 giorni</option>
                <option value="all">Tutte le richieste</option>
                <option value="custom">Data personalizzata</option>
              </select>
            </div>

            {/* Date */}
            <div className={datePeriodFilter === 'custom' ? '' : 'opacity-50'}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data specifica
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  disabled={datePeriodFilter !== 'custom'}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  aria-label="Select date"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urgenza
              </label>
              <select
                id="urgency"
                value={urgencyFilter}
                onChange={(e) => onUrgencyFilterChange(e.target.value as UrgencyFilter)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Filter by urgency"
              >
                <option value="All">Tutte</option>
                <option value="Urgent">Urgente</option>
                <option value="Non-urgent">Non urgente</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stato
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as FilterState)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Filter by status"
              >
                <option value="All">Tutti</option>
                <option value="Unread">Non letto</option>
                <option value="Read">Letto</option>
                <option value="Contacted">Contattato</option>
                <option value="Completed">Completato</option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={onReset}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Resetta filtri (R)"
            >
              <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
              Resetta filtri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}