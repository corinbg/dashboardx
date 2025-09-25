import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, AlertCircle, List, Grid3X3 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ChecklistItemComponent } from '../components/Checklist/ChecklistItem';
import { NewTaskForm } from '../components/Checklist/NewTaskForm';
import { ChecklistFilters } from '../components/Checklist/ChecklistFilters';
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
  const { checklist, addChecklistItem, addAdvancedChecklistItem, updateChecklistItem, deleteChecklistItem, toggleChecklistItem, loading } = useApp();
  const { user } = useAuth();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'no-date'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  // Mock data for now - will be replaced with actual API calls
  const mockChecklistItems: ChecklistItem[] = checklist.map((item, index) => ({
    ...item,
    priorita: (['alta', 'media', 'bassa', 'none'] as Priority[])[index % 4],
    categoria: (['riparazione', 'follow-up', 'materiali', 'trasferte', 'amministrativo', 'formazione'] as Category[])[index % 6],
    dataScadenza: index % 3 === 0 ? new Date(Date.now() + (index - 2) * 86400000).toISOString().split('T')[0] : undefined,
    ricorrente: index % 5 === 0 ? 'settimanale' : 'none',
    ordine: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Apply filters
  const filteredItems = mockChecklistItems.filter(item => {
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

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    // First by completion status
    if (a.completata !== b.completata) {
      return a.completata ? 1 : -1;
    }
    
    // Then by priority
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

  const todoItems = sortedItems.filter(item => !item.completata);
  const completedItems = sortedItems.filter(item => item.completata);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // In a real app, you would update the order in the backend
      console.log('Reorder items:', active.id, 'to position of', over.id);
      // For now, we'll just log this action
    }
  };

  const handleAddItem = async (taskData: Omit<ChecklistItem, 'id' | 'completata' | 'completataAt' | 'ordine' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      alert('Devi essere autenticato per aggiungere elementi alla checklist');
      return;
    }
    
    try {
      if (editingItem) {
        // Update existing item
        await updateChecklistItem(editingItem.id, {
          testo: taskData.testo,
          priorita: taskData.priorita,
          categoria: taskData.categoria,
          categoriaCustom: taskData.categoriaCustom,
          dataScadenza: taskData.dataScadenza,
          dataPromemoria: taskData.dataPromemoria,
          ricorrente: taskData.ricorrente,
        });
        setEditingItem(null);
      } else {
        // Create new item
        await addAdvancedChecklistItem({
          testo: taskData.testo,
          priorita: taskData.priorita,
          categoria: taskData.categoria,
          categoriaCustom: taskData.categoriaCustom,
          dataScadenza: taskData.dataScadenza,
          dataPromemoria: taskData.dataPromemoria,
          ricorrente: taskData.ricorrente,
        });
      }
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Errore durante il salvataggio dell\'elemento');
    }
  };

  const handleEditItem = (item: ChecklistItem) => {
    setEditingItem(item);
    setShowNewTaskForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!user) {
      alert('Devi essere autenticato per eliminare elementi dalla checklist');
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating checklist item:', error);
    return false;
  }

  return true;
}

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
export async function deleteChecklistItem(id: string): Promise<boolean> {
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
              
              <button
                onClick={() => setShowNewTaskForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuova Attività
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
          />
        </div>

        {/* New Task Form */}
        {showNewTaskForm && (
          <div className="mb-6">
            <NewTaskForm
              onSubmit={handleAddItem}
              onCancel={() => setShowNewTaskForm(false)}
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
                label: "Aggiungi Prima Attività",
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
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}