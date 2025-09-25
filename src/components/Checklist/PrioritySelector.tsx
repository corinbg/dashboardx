import React from 'react';
import { AlertTriangle, Circle, Minus } from 'lucide-react';
import { Priority } from '../../types';

interface PrioritySelectorProps {
  priority: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
}

export function PrioritySelector({ priority, onChange, disabled = false }: PrioritySelectorProps) {
  const priorities = [
    { value: 'none' as Priority, label: 'Nessuna', icon: Circle, color: 'text-gray-400' },
    { value: 'bassa' as Priority, label: 'Bassa', icon: Minus, color: 'text-green-500' },
    { value: 'media' as Priority, label: 'Media', icon: AlertTriangle, color: 'text-amber-500' },
    { value: 'alta' as Priority, label: 'Alta', icon: AlertTriangle, color: 'text-red-500' },
  ];

  const currentPriority = priorities.find(p => p.value === priority) || priorities[0];
  const IconComponent = currentPriority.icon;

  return (
    <div className="relative">
      <select
        value={priority}
        onChange={(e) => onChange(e.target.value as Priority)}
        disabled={disabled}
        className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-8 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
      >
        {priorities.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <IconComponent className={`h-4 w-4 ${currentPriority.color}`} />
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}