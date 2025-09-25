import React from 'react';
import { Calendar, Clock, RotateCw, X } from 'lucide-react';

interface DueDatePickerProps {
  dueDate?: string;
  reminderDate?: string;
  recurrence?: 'none' | 'giornaliera' | 'settimanale' | 'mensile';
  onChange: (dates: {
    dueDate?: string;
    reminderDate?: string;
    recurrence?: 'none' | 'giornaliera' | 'settimanale' | 'mensile';
  }) => void;
  disabled?: boolean;
}

export function DueDatePicker({ 
  dueDate, 
  reminderDate, 
  recurrence = 'none', 
  onChange, 
  disabled = false 
}: DueDatePickerProps) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const getDueDateStatus = () => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { type: 'overdue', text: `Scaduta da ${Math.abs(diffDays)} giorni`, color: 'text-red-600' };
    if (diffDays === 0) return { type: 'today', text: 'Scade oggi', color: 'text-red-600' };
    if (diffDays === 1) return { type: 'tomorrow', text: 'Scade domani', color: 'text-amber-600' };
    if (diffDays <= 3) return { type: 'soon', text: `Scade in ${diffDays} giorni`, color: 'text-amber-600' };
    return { type: 'future', text: `Scade in ${diffDays} giorni`, color: 'text-gray-600' };
  };

  const dueDateStatus = getDueDateStatus();

  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    onChange({ 
      dueDate: date.toISOString().split('T')[0], 
      reminderDate, 
      recurrence 
    });
  };

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickDate(0)}
          disabled={disabled}
          className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 rounded-md disabled:opacity-50"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Oggi
        </button>
        <button
          onClick={() => handleQuickDate(1)}
          disabled={disabled}
          className="inline-flex items-center px-2 py-1 text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 rounded-md disabled:opacity-50"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Domani
        </button>
        <button
          onClick={() => handleQuickDate(7)}
          disabled={disabled}
          className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 rounded-md disabled:opacity-50"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Settimana
        </button>
        {dueDate && (
          <button
            onClick={() => onChange({ reminderDate, recurrence })}
            disabled={disabled}
            className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
          >
            <X className="h-3 w-3 mr-1" />
            Rimuovi
          </button>
        )}
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data Scadenza
          </label>
          <input
            type="date"
            value={dueDate || ''}
            onChange={(e) => onChange({ 
              dueDate: e.target.value || undefined, 
              reminderDate, 
              recurrence 
            })}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
          />
          {dueDateStatus && (
            <p className={`text-xs mt-1 font-medium ${dueDateStatus.color}`}>
              {dueDateStatus.text}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Promemoria
          </label>
          <input
            type="date"
            value={reminderDate || ''}
            max={dueDate || undefined}
            onChange={(e) => onChange({ 
              dueDate, 
              reminderDate: e.target.value || undefined, 
              recurrence 
            })}
            disabled={disabled || !dueDate}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
          />
        </div>
      </div>

      {/* Recurrence */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          <RotateCw className="h-3 w-3 inline mr-1" />
          Ricorrenza
        </label>
        <select
          value={recurrence}
          onChange={(e) => onChange({ 
            dueDate, 
            reminderDate, 
            recurrence: e.target.value as 'none' | 'giornaliera' | 'settimanale' | 'mensile'
          })}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
        >
          <option value="none">Nessuna</option>
          <option value="giornaliera">Giornaliera</option>
          <option value="settimanale">Settimanale</option>
          <option value="mensile">Mensile</option>
        </select>
      </div>
    </div>
  );
}