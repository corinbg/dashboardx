import React from 'react';
import { FolderKanban, AlertTriangle, Calendar, List as ListIcon } from 'lucide-react';

export type GroupByMode = 'none' | 'category' | 'priority' | 'date';

interface GroupControlsProps {
  groupBy: GroupByMode;
  onGroupByChange: (mode: GroupByMode) => void;
}

export function GroupControls({ groupBy, onGroupByChange }: GroupControlsProps) {
  const options: { value: GroupByMode; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'Nessun raggruppamento', icon: <ListIcon className="h-4 w-4" /> },
    { value: 'category', label: 'Categoria', icon: <FolderKanban className="h-4 w-4" /> },
    { value: 'priority', label: 'Priorità', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'date', label: 'Scadenza', icon: <Calendar className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Raggruppa per:
      </span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onGroupByChange(option.value)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              index === 0 ? 'rounded-l-md' : ''
            } ${
              index === options.length - 1 ? 'rounded-r-md' : ''
            } ${
              index !== 0 ? 'border-l-0' : ''
            } ${
              groupBy === option.value
                ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            title={option.label}
          >
            {option.icon}
            <span className="ml-2 hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
