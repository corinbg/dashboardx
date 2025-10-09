import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, AlertCircle, List, Grid3x3 as Grid3X3 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { updateChecklistItemOrder } from '../services/checklistService';
import { ChecklistItemComponent } from '../components/Checklist/ChecklistItem';
import { NewTaskForm } from '../components/Checklist/NewTaskForm';
import { ChecklistFilters } from '../components/Checklist/ChecklistFilters';
import { TaskDrawer } from '../components/Checklist/TaskDrawer';
import { EmptyState } from '../components/UI/EmptyState';
import { ChecklistItem, Priority, Category } from '../types';

// Sortable Item Wrapper
function SortableChecklistItem({ 
  item, 
  onToggle, 
  onEdit, 
  onDelete 
}: {
  item: ChecklistItem;
  onToggle: (id: string) => Promise<void>;
  onEdit?: (item: ChecklistItem) => void;
  onDelete?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ChecklistItemComponent
        item={item}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function ChecklistPage() {
  const { checklist, addChecklistItem, addAdvancedChecklistItem, updateChecklistItem, deleteChecklistItem, toggleChecklistItem, loading, refreshData, setChecklist } = useApp();
  const { user } = useAuth();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTask, setSelectedTask] = useState<ChecklistItem | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  // Sync selectedTask when checklist updates
  React.useEffect(() => {
    if (selectedTask && isTaskDrawerOpen) {
      const updatedTask = checklist.find(t => t.id === selectedTask.id);
      if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(selectedTask)) {
        setSelectedTask(updatedTask);
      }
    }
  }, [checklist, selectedTask, isTaskDrawerOpen]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'no-date'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply filters with memoization to prevent unnecessary re-renders
  const filteredItems = React.useMemo(() => {
    return checklist.filter(item => {
      // Search filter
      if (searchTerm && !item.testo.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'all' && item.priorita !== priorityFilter) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && item.categoria !== categoryFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const hasDate = !!item.dataScadenza;
        const dueDate = item.dataScadenza ? new Date(item.dataScadenza) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for consistent comparison
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
      
      // Status filter
      if (statusFilter === 'completed' && !item.completata) return false;
      if (statusFilter === 'pending' && item.completata) return false;
      
      return true;
    });
  }, [checklist, searchTerm, priorityFilter, categoryFilter, dateFilter, statusFilter]);

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' ||
                          priorityFilter !== 'all' ||
                          categoryFilter !== 'all' ||
                          dateFilter !== 'all' ||
                          statusFilter !== 'all';

  // Sort items with memoization
  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // First by completion status
      if (a.completata !== b.completata) {
        return a.completata ? 1 : -1;
      }

      // If no filters are active, use manual order only for non-completed items
      if (!hasActiveFilters && !a.completata && !b.completata) {
        return a.ordine - b.ordine;
      }

      // Then by priority (only when filters are active or items are completed)
      const priorityOrder = { 'alta': 0, 'media': 1, 'bassa': 2, 'none': 3 };
      const aPriority = priorityOrder[a.priorita];
      const bPriority = priorityOrder[b.priorita];

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Then by due date
      if (a.dataScadenza && b.dataScadenza) {
        return new Date(a.dataScadenza).getTime() - new Date(b.dataScadenza).getTime();
      }
      if (a.dataScadenza && !b.dataScadenza) return -1;
      if (!a.dataScadenza && b.dataScadenza) return 1;

      // Finally by order
      return a.ordine - b.ordine;
    });
  }, [filteredItems, hasActiveFilters]);

  // Separate todo and completed items with memoization
  const todoItems = React.useMemo(() => {
    return sortedItems.filter(item => !item.completata);
  }, [sortedItems]);

  const completedItems = React.useMemo(() => {
    return sortedItems.filter(item => item.completata);
  }, [sortedItems]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('🎯 handleDragEnd called:', { activeId: active.id, overId: over?.id });

    if (over && active.id !== over.id) {
      const oldIndex = todoItems.findIndex(item => item.id === active.id);
      const newIndex = todoItems.findIndex(item => item.id === over.id);
      
      console.log('📊 Drag indices:', { oldIndex, newIndex, totalTodoItems: todoItems.length });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(todoItems, oldIndex, newIndex);
        
        console.log('🔄 Items after reorder:', reorderedItems.map(item => ({ id: item.id, text: item.testo.substring(0, 30) })));
        
        // 🚀 AGGIORNAMENTO OTTIMISTICO - Ricostruisce completamente la checklist
        const reorderedTodoItemsMap = new Map(reorderedItems.map((item, index) => [item.id, { ...item, ordine: index }]));
        
        const updatedChecklist = checklist.map(item => {
          // Se è un todo item riordinato, usa la nuova posizione
          if (reorderedTodoItemsMap.has(item.id)) {
            return reorderedTodoItemsMap.get(item.id)!;
          }
          // Altrimenti mantieni l'elemento invariato
          return item;
        });
        
        console.log('⚡ Updating checklist optimistically');
        console.log('📝 New order:', updatedChecklist.filter(item => !item.completata).map(item => ({ id: item.id, ordine: item.ordine, text: item.testo.substring(0, 20) })));
        
        setChecklist(updatedChecklist);
        
        // Prepara gli aggiornamenti dell'ordine per il database
        const orderUpdates = reorderedItems.map((item, index) => ({
          id: item.id,
          ordine: index
        }));
        
        console.log('💾 Preparing database updates:', orderUpdates);

        try {
          // 💾 Salva nel database (in background)
          const success = await updateChecklistItemOrder(orderUpdates);
          
          if (success) {
            console.log('✅ Ordine salvato nel database con successo');
          } else {
            console.error('❌ Errore nell\'aggiornamento dell\'ordine nel database');
            console.log('🔄 Ripristino stato precedente a causa di errore database');
            await refreshData();
            alert('Errore nel salvataggio dell\'ordine. Ordine ripristinato.');
          }
        } catch (error) {
          console.error('❌ Errore nel riordinamento:', error);
          console.log('🔄 Ripristino stato precedente a causa di errore di rete');
          await refreshData();
          alert('Errore nel riordinamento delle attività. Ordine ripristinato.');
        }
      }
    } else {
      console.log('❌ Drag cancelled or invalid:', { activeId: active.id, overId: over?.id });
    }
  };

  const handleAddItem = async (taskData: Omit<ChecklistItem, 'id' | 'completata' | 'completataAt' | 'ordine' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      alert('Devi essere autenticato per aggiungere elementi alla checklist');
      return;
    }
    
    try {
      // Save current scroll position before update
      const scrollY = window.scrollY;

      if (editingItem) {
        // Modifica attività esistente
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
        // Crea nuova attività
        await addAdvancedChecklistItem(taskData);
      }

      setShowNewTaskForm(false);
      setEditingItem(null);

      // Restore scroll position after state update
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Errore durante l\'aggiunta dell\'elemento');
    }
  };

  const handleEditItem = (item: ChecklistItem) => {
    setSelectedTask(item);
    setIsTaskDrawerOpen(true);
  };

  const handleTaskClick = (item: ChecklistItem) => {
    setSelectedTask(item);
    setIsTaskDrawerOpen(true);
  };

  const handleUpdateTask = async (id: string, updates: Partial<ChecklistItem>) => {
    await updateChecklistItem(id, updates);

    // Update selectedTask with fresh data after update
    if (selectedTask && selectedTask.id === id) {
      const updatedTask = checklist.find(t => t.id === id);
      if (updatedTask) {
        setSelectedTask({ ...updatedTask, ...updates });
      }
    }
  };

  const handleToggleTask = async (id: string) => {
    // Optimistically update the selectedTask before the API call
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({
        ...selectedTask,
        completata: !selectedTask.completata,
        completataAt: !selectedTask.completata ? new Date().toISOString() : null
      });
    }

    await toggleChecklistItem(id);
  };

  const handleCancelEdit = () => {
    setShowNewTaskForm(false);
    setEditingItem(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setStatusFilter('all');
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Header */}
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
              {/* View Mode Toggle */}
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-l-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
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

        {/* Filters */}
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
            onQuickAdd={user ? addChecklistItem : undefined}
          />
        </div>

        {/* New Task Form */}
        {showNewTaskForm && (
          <div className="mb-6">
            <NewTaskForm
              initialItem={editingItem}
              onSubmit={handleAddItem}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* Todo Items */}
        {todoItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              📝 Da fare ({todoItems.length})
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={todoItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                  {todoItems.map((item) => (
                    <SortableChecklistItem
                      key={item.id}
                      item={item}
                      onToggle={toggleChecklistItem}
                      onEdit={handleTaskClick}
                      onDelete={deleteChecklistItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Empty State */}
        {todoItems.length === 0 && (
          <div className="mb-8">
            <EmptyState
              type="checklist"
              title={searchTerm || priorityFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || statusFilter !== 'all' 
                ? "Nessuna attività trovata" 
                : "Nessuna attività da fare"}
              description={searchTerm || priorityFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || statusFilter !== 'all'
                ? "Prova a modificare i filtri per vedere più risultati."
                : "Ottimo lavoro! Non hai attività in sospeso."}
              action={!showNewTaskForm ? {
                label: "Aggiungi Attività",
                onClick: () => setShowNewTaskForm(true)
              } : undefined}
            />
          </div>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center w-full text-left p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-expanded={showCompleted}
              aria-controls="completed-items"
            >
              <div className="flex-1">
                <h2 className="text-lg font-medium text-green-800 dark:text-green-200 flex items-center">
                  ✅ Completate ({completedItems.length})
                </h2>
              </div>
              {showCompleted ? (
                <ChevronUp className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              )}
            </button>

            <div 
              id="completed-items"
              className={`transition-all duration-200 ease-in-out ${
                showCompleted ? 'block' : 'hidden'
              }`}
            >
              <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                {completedItems.map((item) => (
                  <ChecklistItemComponent
                    key={item.id}
                    item={item}
                    onToggle={toggleChecklistItem}
                    onEdit={handleTaskClick}
                    onDelete={deleteChecklistItem}
                  />
                ))}
              </div>
            </div>
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