'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Anomaly } from '../types/anomaly';

interface AnomalyCardProps {
  anomaly: Anomaly;
  onEdit: (anomaly: Anomaly) => void;
  onDelete: (id: string) => void;
  isEditMode: boolean;
}

export default function AnomalyCard({ anomaly, onEdit, onDelete, isEditMode }: AnomalyCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: anomaly.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'var(--color-white)',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '0.75rem',
        boxShadow: '0 1px 3px rgba(29, 30, 60, 0.1)',
        border: '1px solid var(--color-neutral-beige)',
        cursor: isEditMode ? 'grab' : 'default',
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-secondary-blue)',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '700',
            flexShrink: 0,
          }}
        >
          {anomaly.priority}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--color-primary-dark)',
              marginBottom: '0.5rem',
              margin: 0,
            }}
          >
            {anomaly.title}
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-primary-blue)',
              marginBottom: '0.75rem',
              lineHeight: '1.5',
            }}
          >
            {anomaly.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--color-primary-blue)',
            }}
          >
            {anomaly.incidentReferences && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontWeight: '600' }}>Incident:</span>
                <span>{anomaly.incidentReferences}</span>
              </div>
            )}
            {anomaly.correctionDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontWeight: '600' }}>Date correction:</span>
                <span>{new Date(anomaly.correctionDate).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>

        {isEditMode && (
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(anomaly);
              }}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2f4fb5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
              }}
            >
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Êtes-vous sûr de vouloir supprimer cette anomalie ?')) {
                  onDelete(anomaly.id);
                }
              }}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--color-accent-red)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a01a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
