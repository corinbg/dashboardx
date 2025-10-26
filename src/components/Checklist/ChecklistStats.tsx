import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { ChecklistItem } from '../../types';

interface ChecklistStatsProps {
  items: ChecklistItem[];
}

export function ChecklistStats({ items }: ChecklistStatsProps) {
  const stats = React.useMemo(() => {
    const total = items.length;
    const completed = items.filter(item => item.completata).length;
    const pending = total - completed;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = items.filter(item => {
      if (item.completata || !item.dataScadenza) return false;
      const dueDate = new Date(item.dataScadenza);
      return dueDate < today;
    }).length;

    const dueToday = items.filter(item => {
      if (item.completata || !item.dataScadenza) return false;
      const dueDate = new Date(item.dataScadenza);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;

    const highPriority = items.filter(item => !item.completata && item.priorita === 'alta').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      highPriority,
      completionRate
    };
  }, [items]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Totali
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.pending}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
            <Clock className="h-3 w-3 mr-1" />
            Da fare
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.completed}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completate
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.overdue}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Scadute
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.dueToday}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
            <Calendar className="h-3 w-3 mr-1" />
            Oggi
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.highPriority}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Priorità Alta
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completionRate}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Completamento
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
