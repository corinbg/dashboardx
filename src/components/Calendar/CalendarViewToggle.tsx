import React from 'react';
import { Calendar, List, Grid3x3 } from 'lucide-react';
import { CalendarView } from '../../types';

interface CalendarViewToggleProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarViewToggle({ currentView, onViewChange }: CalendarViewToggleProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        onClick={() => onViewChange('day')}
        className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
          currentView === 'day'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        } focus:z-10 focus:ring-2 focus:ring-blue-500 transition-colors`}
        aria-label="Vista giornaliera"
      >
        <span className="flex items-center">
          <List className="h-4 w-4 mr-2" aria-hidden="true" />
          Giorno
        </span>
      </button>

      <button
        type="button"
        onClick={() => onViewChange('week')}
        className={`px-4 py-2 text-sm font-medium border-t border-b ${
          currentView === 'week'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        } focus:z-10 focus:ring-2 focus:ring-blue-500 transition-colors`}
        aria-label="Vista settimanale"
      >
        <span className="flex items-center">
          <Grid3x3 className="h-4 w-4 mr-2" aria-hidden="true" />
          Settimana
        </span>
      </button>

      <button
        type="button"
        onClick={() => onViewChange('month')}
        className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
          currentView === 'month'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        } focus:z-10 focus:ring-2 focus:ring-blue-500 transition-colors`}
        aria-label="Vista mensile"
      >
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
          Mese
        </span>
      </button>
    </div>
  );
}
