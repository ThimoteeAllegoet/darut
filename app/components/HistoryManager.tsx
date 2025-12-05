'use client';

import { useState } from 'react';
import { HistoryEntry } from '../types/anomaly';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HistoryManagerProps {
  history: HistoryEntry[];
  onChange: (history: HistoryEntry[]) => void;
}

function HistoryItem({
  entry,
  onDelete,
  onUpdate,
}: {
  entry: HistoryEntry;
  onDelete: () => void;
  onUpdate: (date: string, action: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: entry.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        alignItems: 'center',
      }}
    >
      <button
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--color-primary-blue)',
          fontSize: '1rem',
          padding: '0.25rem',
        }}
        title="Glisser pour réorganiser"
      >
        ⋮⋮
      </button>
      <input
        type="date"
        value={entry.date}
        onChange={(e) => onUpdate(e.target.value, entry.action)}
        style={{
          padding: '0.5rem',
          border: '2px solid var(--color-neutral-beige)',
          borderRadius: '4px',
          fontSize: '0.9rem',
          outline: 'none',
          width: '150px',
        }}
      />
      <input
        type="text"
        value={entry.action}
        onChange={(e) => onUpdate(entry.date, e.target.value)}
        placeholder="Action effectuée"
        style={{
          flex: 1,
          padding: '0.5rem',
          border: '2px solid var(--color-neutral-beige)',
          borderRadius: '4px',
          fontSize: '0.9rem',
          outline: 'none',
        }}
      />
      <button
        onClick={onDelete}
        style={{
          padding: '0.5rem',
          backgroundColor: 'var(--color-accent-red)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function HistoryManager({ history, onChange }: HistoryManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = history.findIndex((item) => item.id === active.id);
      const newIndex = history.findIndex((item) => item.id === over.id);

      onChange(arrayMove(history, oldIndex, newIndex));
    }
  };

  const addEntry = () => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      action: '',
    };
    onChange([...history, newEntry]);
  };

  const deleteEntry = (id: string) => {
    onChange(history.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, date: string, action: string) => {
    onChange(
      history.map((entry) => (entry.id === id ? { ...entry, date, action } : entry))
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <label
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-primary-dark)',
            fontWeight: '500',
          }}
        >
          Historique
        </label>
        <button
          onClick={addEntry}
          type="button"
          style={{
            padding: '0.4rem 0.75rem',
            backgroundColor: 'var(--color-secondary-blue)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
          }}
        >
          + Ajouter
        </button>
      </div>

      {history.length === 0 ? (
        <div
          style={{
            padding: '1rem',
            textAlign: 'center',
            color: 'var(--color-primary-blue)',
            fontSize: '0.9rem',
            backgroundColor: 'var(--color-light-beige)',
            borderRadius: '4px',
          }}
        >
          Aucune entrée dans l'historique
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={history.map((h) => h.id)} strategy={verticalListSortingStrategy}>
            {history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onDelete={() => deleteEntry(entry.id)}
                onUpdate={(date, action) => updateEntry(entry.id, date, action)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
