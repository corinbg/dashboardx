import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { updateChecklistItemOrder } from '../services/checklistService';
import { getUserPreferences, updateUserPreferences } from '../services/userPreferencesService';
import { NewTaskForm } from '../components/Checklist/NewTaskForm';
import { ChecklistFilters } from '../components/Checklist/ChecklistFilters';
import { TaskDrawer } from '../components/Checklist/TaskDrawer';
import { EmptyState } from '../components/UI/EmptyState';
import { ChecklistStats } from '../components/Checklist/ChecklistStats';
import { GroupControls, GroupByMode } from '../components/Checklist/GroupControls';
import { GroupedChecklistSection } from '../components/Checklist/GroupedChecklistSection';
import { PaginationControls } from '../components/Checklist/PaginationControls';
import { ChecklistItem, Priority, Category } from '../types';

type ViewDensity = 'comfortable' | 'compact';

export function ChecklistPage() {
  const { checklist, addAdvancedChecklistItem, updateChecklistItem, deleteChecklistItem, toggleChecklistItem, loading, refreshData } = useApp();
  const { user } = useAuth();

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<ChecklistItem | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'no-date'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const [groupBy, setGroupBy] = useState<GroupByMode>('none');
  const [viewDensity, setViewDensity] = useState<ViewDensity>('comfortable');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    if (user && !preferencesLoaded) {
      loadUserPreferences();
    }
  }, [user, preferencesLoaded]);

  const loadUserPreferences = async () => {
    const preferences = await getUserPreferences();
    if (preferences) {
      setGroupBy(preferences.checklist_group_by);
      setViewDensity(preferences.checklist_view_density);
      setItemsPerPage(preferences.checklist_items_per_page);
    }
    setPreferencesLoaded(true);
  };

  const savePreference = async (key: string, value: any) => {
    if (!user) return;

    const updates: any = {};
    if (key === 'groupBy') updates.checklist_group_by = value;
    if (key === 'viewDensity') updates.checklist_view_density = value;
    if (key === 'itemsPerPage') updates.checklist_items_per_page = value;

    await updateUserPreferences(updates);
  };

  const handleGroupByChange = (newGroupBy: GroupByMode) => {
    setGroupBy(newGroupBy);
    savePreference('groupBy', newGroupBy);
  };

  const handleViewDensityChange = () => {
    const newDensity = viewDensity === 'comfortable' ? 'compact' : 'comfortable';
    setViewDensity(newDensity);
    savePreference('viewDensity', newDensity);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    savePreference('itemsPerPage', newItemsPerPage);
  };

  React.useEffect(() => {
    if (selectedTask && isTaskDrawerOpen) {
      const updatedTask = checklist.find(t => t.id === selectedTask.id);
      if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(selectedTask)) {
        setSelectedTask(updatedTask);
      }
    }
  }, [checklist, selectedTask, isTaskDrawerOpen]);

  const filteredItems = React.useMemo(() => {
    return checklist.filter(item => {
      if (searchTerm && !item.testo.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (priorityFilter !== 'all' && item.priorita !== priorityFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && item.categoria !== categoryFilter) {
        return false;
      }

      if (dateFilter !== 'all') {
        const hasDate = !!item.dataScadenza;
        const dueDate = item.dataScadenza ? new Date(item.dataScadenza) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) : null;

        switch (dateFilter) {
          case 'overdue':
            if (!hasDate || diffDays === null || diffDays >= 0) return false;
            break;
          case 'today':
            if (!hasDate || diffDays !== 0) return false;
            break;
          case 'upcoming':
            if (!hasDate || diffDays === null || diffDays <= 0) return false;
            break;
          case 'no-date':
            if (hasDate) return false;
            break;
        }
      }

      if (statusFilter === 'completed' && !item.completata) return false;
      if (statusFilter === 'pending' && item.completata) return false;

      return true;
    });
  }, [checklist, searchTerm, priorityFilter, categoryFilter, dateFilter, statusFilter]);

  const hasActiveFilters = searchTerm !== '' ||
                          priorityFilter !== 'all' ||
                          categoryFilter !== 'all' ||
                          dateFilter !== 'all' ||
                          statusFilter !== 'all';

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (a.completata !== b.completata) {
        return a.completata ? 1 : -1;
      }

      if (!hasActiveFilters && !a.completata && !b.completata) {
        return a.ordine - b.ordine;
      }

      const priorityOrder = { 'alta': 0, 'media': 1, 'bassa': 2, 'none': 3 };
      const aPriority = priorityOrder[a.priorita];
      const bPriority = priorityOrder[b.priorita];

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      if (a.dataScadenza && b.dataScadenza) {
        return new Date(a.dataScadenza).getTime() - new Date(b.dataScadenza).getTime();
      }
      if (a.dataScadenza && !b.dataScadenza) return -1;
      if (!a.dataScadenza && b.dataScadenza) return 1;

      return a.ordine - b.ordine;
    });
  }, [filteredItems, hasActiveFilters]);

  const todoItems = React.useMemo(() => {
    return sortedItems.filter(item => !item.completata);
  }, [sortedItems]);

  const completedItems = React.useMemo(() => {
    return sortedItems.filter(item => item.completata);
  }, [sortedItems]);

  const paginatedTodoItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return todoItems.slice(startIndex, endIndex);
  }, [todoItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(todoItems.length / itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const groupedTodoItems = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'Tutte le attività': paginatedTodoItems };
    }

    const groups: Record<string, ChecklistItem[]> = {};

    paginatedTodoItems.forEach(item => {
      let groupKey = '';

      switch (groupBy) {
        case 'category':
          groupKey = item.categoria === 'custom' && item.categoriaCustom
            ? item.categoriaCustom
            : item.categoria;
          break;
        case 'priority':
          groupKey = item.priorita;
          break;
        case 'date':
          if (!item.dataScadenza) {
            groupKey = 'no-date';
          } else {
            const due = new Date(item.dataScadenza);
            const now = new Date();
            const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

            if (diffDays < 0) groupKey = 'overdue';
            else if (diffDays === 0) groupKey = 'today';
            else if (diffDays <= 7) groupKey = 'this-week';
            else if (diffDays <= 30) groupKey = 'this-month';
            else groupKey = 'future';
          }
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [paginatedTodoItems, groupBy]);

  const getGroupTitle = (key: string): { title: string; icon: string; color: string } => {
    if (groupBy === 'category') {
      const categoryLabels: Record<string, { title: string; icon: string; color: string }> = {
        'riparazione': { title: 'Riparazione', icon: '🔧', color: 'blue' },
        'follow-up': { title: 'Follow-up', icon: '📞', color: 'green' },
        'materiali': { title: 'Materiali', icon: '📦', color: 'amber' },
        'trasferte': { title: 'Trasferte', icon: '🚗', color: 'blue' },
        'amministrativo': { title: 'Amministrativo', icon: '📋', color: 'gray' },
        'formazione': { title: 'Formazione', icon: '🎓', color: 'green' },
      };
      return categoryLabels[key] || { title: key, icon: '📌', color: 'gray' };
    }

    if (groupBy === 'priority') {
      const priorityLabels: Record<string, { title: string; icon: string; color: string }> = {
        'alta': { title: 'Priorità Alta', icon: '🔴', color: 'red' },
        'media': { title: 'Priorità Media', icon: '🟡', color: 'amber' },
        'bassa': { title: 'Priorità Bassa', icon: '🟢', color: 'green' },
        'none': { title: 'Nessuna Priorità', icon: '⚪', color: 'gray' },
      };
      return priorityLabels[key] || { title: key, icon: '❓', color: 'gray' };
    }

    if (groupBy === 'date') {
      const dateLabels: Record<string, { title: string; icon: string; color: string }> = {
        'overdue': { title: 'Scadute', icon: '🔴', color: 'red' },
        'today': { title: 'Oggi', icon: '📅', color: 'red' },
        'this-week': { title: 'Questa Settimana', icon: '📆', color: 'amber' },
        'this-month': { title: 'Questo Mese', icon: '🗓️', color: 'blue' },
        'future': { title: 'Futuro', icon: '🔮', color: 'gray' },
        'no-date': { title: 'Senza Scadenza', icon: '➖', color: 'gray' },
      };
      return dateLabels[key] || { title: key, icon: '📌', color: 'gray' };
    }

    return { title: key, icon: '📌', color: 'blue' };
  };

  const handleAddItem = async (taskData: Omit<ChecklistItem, 'id' | 'completata' | 'completataAt' | 'ordine' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      alert('Devi essere autenticato per aggiungere elementi alla checklist');
      return;
    }

    try {
      const scrollY = window.scrollY;

      if (editingItem) {
        await updateChecklistItem(editingItem.id, {
          testo: taskData.testo,
          priorita: taskData.priorita,
          categoria: taskData.categoria,
          categoriaCustom: taskData.categoriaCustom,
          dataScadenza: taskData.dataScadenza,
          dataPromemoria: taskData.dataPromemoria,
          ricorrente: taskData.ricorrente,
        });
      } else {
        await addAdvancedChecklistItem(taskData);
      }

      setShowNewTaskForm(false);
      setEditingItem(null);

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Errore durante l\'aggiunta dell\'elemento');
    }
  };

  const handleTaskClick = (item: ChecklistItem) => {
    setSelectedTask(item);
    setIsTaskDrawerOpen(true);
  };

  const handleUpdateTask = async (id: string, updates: Partial<ChecklistItem>) => {
    await updateChecklistItem(id, updates);

    if (selectedTask && selectedTask.id === id) {
      const updatedTask = checklist.find(t => t.id === id);
      if (updatedTask) {
        setSelectedTask({ ...updatedTask, ...updates });
      }
    }
  };

  const handleToggleTask = async (id: string) => {
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({
        ...selectedTask,
        completata: !selectedTask.completata,
        completataAt: !selectedTask.completata ? new Date().toISOString() : null
      });
    }

    await toggleChecklistItem(id);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setStatusFilter('all');
  };

  const handleGroupReorder = async (groupKey: string, reorderedItems: ChecklistItem[]) => {
    const orderUpdates = reorderedItems.map((item, index) => ({
      id: item.id,
      ordine: index
    }));

    try {
      await updateChecklistItemOrder(orderUpdates);
      await refreshData();
    } catch (error) {
      console.error('Error reordering items:', error);
      await refreshData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Checklist Avanzata
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Sistema completo di gestione attività con priorità, categorie e scadenze
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowNewTaskForm(true);
                }}
                disabled={!user}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuova Attività
              </button>
              <button
                onClick={handleViewDensityChange}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title={viewDensity === 'comfortable' ? 'Vista compatta' : 'Vista comoda'}
              >
                {viewDensity === 'comfortable' ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {!user && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Devi essere autenticato per usare la checklist
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChecklistStats items={checklist} />

        <div className="mb-6">
          <ChecklistFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onReset={handleResetFilters}
          />
        </div>

        <div className="mb-6">
          <GroupControls
            groupBy={groupBy}
            onGroupByChange={handleGroupByChange}
          />
        </div>

        {showNewTaskForm && (
          <div className="mb-6">
            <NewTaskForm
              initialItem={editingItem}
              onSubmit={handleAddItem}
              onCancel={() => {
                setShowNewTaskForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        )}

        {todoItems.length > 0 ? (
          <>
            <div className="mb-6">
              {(() => {
                const entries = Object.entries(groupedTodoItems);

                if (groupBy === 'priority') {
                  const priorityOrder = ['alta', 'media', 'bassa', 'none'];
                  entries.sort((a, b) => {
                    const aIndex = priorityOrder.indexOf(a[0]);
                    const bIndex = priorityOrder.indexOf(b[0]);
                    return aIndex - bIndex;
                  });
                } else if (groupBy === 'date') {
                  const dateOrder = ['overdue', 'today', 'this-week', 'this-month', 'future', 'no-date'];
                  entries.sort((a, b) => {
                    const aIndex = dateOrder.indexOf(a[0]);
                    const bIndex = dateOrder.indexOf(b[0]);
                    return aIndex - bIndex;
                  });
                }

                return entries.map(([groupKey, items]) => {
                  const { title, icon, color } = getGroupTitle(groupKey);
                  return (
                    <GroupedChecklistSection
                      key={groupKey}
                      title={title}
                      items={items}
                      icon={icon}
                      color={color}
                      defaultExpanded={true}
                      onToggle={toggleChecklistItem}
                      onEdit={handleTaskClick}
                      onDelete={deleteChecklistItem}
                      onReorder={(reorderedItems) => handleGroupReorder(groupKey, reorderedItems)}
                      isCompact={viewDensity === 'compact'}
                    />
                  );
                });
              })()}
            </div>

            {groupBy === 'none' && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={todoItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </>
        ) : (
          <div className="mb-8">
            <EmptyState
              type="checklist"
              title={hasActiveFilters ? "Nessuna attività trovata" : "Nessuna attività da fare"}
              description={hasActiveFilters
                ? "Prova a modificare i filtri per vedere più risultati."
                : "Clicca su 'Nuova Attività' per aggiungere la tua prima attività."}
            />
          </div>
        )}

        {completedItems.length > 0 && (
          <div className="mt-8">
            <GroupedChecklistSection
              title="Completate"
              items={completedItems}
              icon="✅"
              color="green"
              defaultExpanded={false}
              onToggle={toggleChecklistItem}
              onEdit={handleTaskClick}
              onDelete={deleteChecklistItem}
              isCompact={viewDensity === 'compact'}
            />
          </div>
        )}
      </main>

      <TaskDrawer
        task={selectedTask}
        isOpen={isTaskDrawerOpen}
        onClose={() => {
          setIsTaskDrawerOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
        onDelete={deleteChecklistItem}
        onToggle={handleToggleTask}
      />
    </div>
  );
}
