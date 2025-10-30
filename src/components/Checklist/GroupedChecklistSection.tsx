import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChecklistItem } from '../../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChecklistItemComponent } from './ChecklistItem';
import { CompactChecklistItem } from './CompactChecklistItem';

interface SortableItemProps {
  item: ChecklistItem;
  onToggle: (id: string) => Promise<void>;
  onEdit?: (item: ChecklistItem) => void;
  onDelete?: (id: string) => void;
  isCompact?: boolean;
}

function SortableItem({ item, onToggle, onEdit, onDelete, isCompact }: SortableItemProps) {
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

  const ItemComponent = isCompact ? CompactChecklistItem : ChecklistItemComponent;

  return (
    <div ref={setNodeRef} style={style}>
      <ItemComponent
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

interface GroupedChecklistSectionProps {
  title: string;
  items: ChecklistItem[];
  icon?: string;
  color?: string;
  defaultExpanded?: boolean;
  onToggle: (id: string) => Promise<void>;
  onEdit?: (item: ChecklistItem) => void;
  onDelete?: (id: string) => void;
  onReorder?: (items: ChecklistItem[]) => void;
  isCompact?: boolean;
}

export function GroupedChecklistSection({
  title,
  items,
  icon = '',
  color = 'blue',
  defaultExpanded = true,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  isCompact = false
}: GroupedChecklistSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        onReorder?.(reorderedItems);
      }
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    gray: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between w-full p-3 rounded-lg border transition-colors ${colorClass} hover:opacity-90`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="text-sm font-semibold">
            {title}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
            {items.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className={isCompact ? 'space-y-1' : 'space-y-3'}>
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isCompact={isCompact}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
