import React from 'react';
import { Wrench, Phone, Package, Car, FileText, GraduationCap, Tag } from 'lucide-react';
import { Category } from '../../types';

interface CategoryTagProps {
  category: Category;
  customName?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  showRemove?: boolean;
  onRemove?: () => void;
}

const categoryConfig = {
  'riparazione': {
    label: 'Riparazione',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700'
  },
  'follow-up': {
    label: 'Follow-up',
    icon: Phone,
    color: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-700'
  },
  'materiali': {
    label: 'Materiali',
    icon: Package,
    color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700'
  },
  'trasferte': {
    label: 'Trasferte',
    icon: Car,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700'
  },
  'amministrativo': {
    label: 'Amministrativo',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
  },
  'formazione': {
    label: 'Formazione',
    icon: GraduationCap,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700'
  },
  'custom': {
    label: 'Personalizzata',
    icon: Tag,
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700'
  }
};

export function CategoryTag({ 
  category, 
  customName, 
  size = 'md', 
  onClick, 
  showRemove = false, 
  onRemove 
}: CategoryTagProps) {
  const config = categoryConfig[category];
  const IconComponent = config.icon;
  const displayName = category === 'custom' && customName ? customName : config.label;
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border ${config.color} ${sizeClasses} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <IconComponent className="h-3 w-3 mr-1" />
      {displayName}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-600 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
}

export function CategorySelector({ 
  category, 
  customName, 
  onChange, 
  disabled = false 
}: {
  category: Category;
  customName?: string;
  onChange: (category: Category, customName?: string) => void;
  disabled?: boolean;
}) {
  const [isCustom, setIsCustom] = React.useState(category === 'custom');
  const [customValue, setCustomValue] = React.useState(customName || '');

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      onChange(newCategory);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange('custom', customValue.trim());
      setIsCustom(false);
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={isCustom ? 'custom' : category}
        onChange={(e) => handleCategoryChange(e.target.value as Category)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
      >
        {Object.entries(categoryConfig).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>

      {isCustom && (
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nome categoria personalizzata"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customValue.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}