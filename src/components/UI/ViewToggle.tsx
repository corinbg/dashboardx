import React from 'react';
import { Table, Grid3X3 } from 'lucide-react';
import { ViewMode } from '../../types';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group" aria-label="Modalità visualizzazione">
      <button
        onClick={() => onViewChange('table')}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          view === 'table'
            ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
        title="Vista tabella"
        aria-pressed={view === 'table'}
      >
        <Table className="h-4 w-4" aria-hidden="true" />
        <span className="ml-2 hidden sm:inline">Tabella</span>
      </button>
      <button
        onClick={() => onViewChange('card')}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-l-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          view === 'card'
            ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
        title="Vista schede"
        aria-pressed={view === 'card'}
      >
        <Grid3X3 className="h-4 w-4" aria-hidden="true" />
        <span className="ml-2 hidden sm:inline">Schede</span>
      </button>
    </div>
  );
}