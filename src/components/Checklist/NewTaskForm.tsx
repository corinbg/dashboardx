import React, { useState } from 'react';
import { Plus, X, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Priority, Category, ChecklistItem } from '../../types';
import { PrioritySelector } from './PrioritySelector';
import { CategorySelector } from './CategoryTag';
import { DueDatePicker } from './DueDatePicker';

interface NewTaskFormProps {
  initialItem?: ChecklistItem;
  onSubmit: (task: Omit<ChecklistItem, 'id' | 'completata' | 'completataAt' | 'ordine' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function NewTaskForm({ initialItem, onSubmit, onCancel }: NewTaskFormProps) {
  const [text, setText] = useState(initialItem?.testo || '');
  const [priority, setPriority] = useState<Priority>(initialItem?.priorita || 'none');
  const [category, setCategory] = useState<Category>(initialItem?.categoria || 'riparazione');
  const [customCategoryName, setCustomCategoryName] = useState<string>(initialItem?.categoriaCustom);
  const [dueDate, setDueDate] = useState<string>(initialItem?.dataScadenza);
  const [reminderDate, setReminderDate] = useState<string>(initialItem?.dataPromemoria);
  const [recurrence, setRecurrence] = useState<'none' | 'giornaliera' | 'settimanale' | 'mensile'>(initialItem?.ricorrente || 'none');
  const [showAdvanced, setShowAdvanced] = useState(!!initialItem && (initialItem.dataScadenza || initialItem.categoriaCustom || initialItem.ricorrente !== 'none'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    onSubmit({
      testo: text.trim(),
      priorita: priority,
      categoria: category,
      categoriaCustom: customCategoryName,
      dataScadenza: dueDate,
      dataPromemoria: reminderDate,
      ricorrente: recurrence,
    });

    // Reset form only if not editing
    if (!initialItem) {
      setText('');
      setPriority('none');
      setCategory('riparazione');
      setCustomCategoryName(undefined);
      setDueDate(undefined);
      setReminderDate(undefined);
      setRecurrence('none');
      setShowAdvanced(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      {/* Task Text */}
      <div>
        <input
          type="text"
          placeholder={initialItem ? "Modifica attività..." : "Nuova attività..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
      </div>

      {/* Quick Settings Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-gray-400" />
          <PrioritySelector priority={priority} onChange={setPriority} />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Calendar className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Meno opzioni' : 'Più opzioni'}
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Categoria
            </label>
            <CategorySelector
              category={category}
              customName={customCategoryName}
              onChange={(cat, custom) => {
                setCategory(cat);
                setCustomCategoryName(custom);
              }}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date e Scadenze
            </label>
            <DueDatePicker
              dueDate={dueDate}
              reminderDate={reminderDate}
              recurrence={recurrence}
              onChange={({ dueDate: dd, reminderDate: rd, recurrence: rec }) => {
                setDueDate(dd);
                setReminderDate(rd);
                setRecurrence(rec || 'none');
              }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-1" />
          {initialItem ? 'Salva Modifiche' : 'Aggiungi Attività'}
        </button>
      </div>
    </form>
  );
}