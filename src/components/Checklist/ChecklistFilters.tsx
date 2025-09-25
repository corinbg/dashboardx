import React from 'react';
import { Search, Filter, Calendar, AlertTriangle, Tag, RotateCcw } from 'lucide-react';
import { Priority, Category } from '../../types';

interface ChecklistFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
  categoryFilter: Category | 'all';
  onCategoryFilterChange: (category: Category | 'all') => void;
  dateFilter: 'all' | 'today' | 'overdue' | 'upcoming' | 'no-date';
  onDateFilterChange: (filter: 'all' | 'today' | 'overdue' | 'upcoming' | 'no-date') => void;
  statusFilter: 'all' | 'completed' | 'pending';
  onStatusFilterChange: (status: 'all' | 'completed' | 'pending') => void;
  onReset: () => void;
}

export function ChecklistFilters({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset
}: ChecklistFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Cerca attività..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Priority Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Priorità
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutte</option>
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="bassa">🟢 Bassa</option>
            <option value="none">⚪ Nessuna</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Tag className="h-3 w-3 inline mr-1" />
            Categoria
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value as Category | 'all')}
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutte</option>
            <option value="riparazione">🔧 Riparazione</option>
            <option value="follow-up">📞 Follow-up</option>
            <option value="materiali">📦 Materiali</option>
            <option value="trasferte">🚗 Trasferte</option>
            <option value="amministrativo">📋 Amministrativo</option>
            <option value="formazione">🎓 Formazione</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="h-3 w-3 inline mr-1" />
            Scadenze
          </label>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as any)}
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutte</option>
            <option value="overdue">🔴 Scadute</option>
            <option value="today">🟡 Oggi</option>
            <option value="upcoming">📅 Prossime</option>
            <option value="no-date">➖ Senza data</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Filter className="h-3 w-3 inline mr-1" />
            Stato
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'completed' | 'pending')}
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutti</option>
            <option value="pending">📝 Da fare</option>
            <option value="completed">✅ Completati</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}