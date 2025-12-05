'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Anomaly } from '../types/anomaly';
import { getPriorityColor, getStatusColor, getStatusTextColor } from '../utils/anomalyHelpers';

interface AnomalyCardProps {
  anomaly: Anomaly;
  onEdit: (anomaly: Anomaly) => void;
  onDelete: (id: string) => void;
  isEditMode: boolean;
  totalAnomalies: number;
}

export default function AnomalyCard({
  anomaly,
  onEdit,
  onDelete,
  isEditMode,
  totalAnomalies,
}: AnomalyCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: anomaly.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityColor = getPriorityColor(anomaly.priority, totalAnomalies);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'var(--color-white)',
        borderRadius: '8px',
        padding: isDragging ? '1rem' : '1rem',
        marginBottom: '0.75rem',
        boxShadow: isDragging ? '0 4px 12px rgba(29, 30, 60, 0.2)' : '0 1px 3px rgba(29, 30, 60, 0.1)',
        border: '1px solid var(--color-neutral-beige)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {isEditMode && (
          <button
            {...attributes}
            {...listeners}
            style={{
              width: '32px',
              height: '40px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-blue)',
              fontSize: '1.2rem',
              padding: 0,
              flexShrink: 0,
            }}
            title="Glisser pour réorganiser"
          >
            ⋮⋮
          </button>
        )}

        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '30%',
            backgroundColor: priorityColor,
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: '700',
            flexShrink: 0,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {anomaly.priority}
        </div>

        {isDragging ? (
          // Vue simplifiée pendant le drag
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--color-primary-dark)',
                margin: 0,
              }}
            >
              {anomaly.title}
            </h3>
          </div>
        ) : (
          // Vue complète normale
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-primary-dark)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {anomaly.title}
              </h3>
              {anomaly.status && anomaly.status.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginLeft: '1rem' }}>
                  {anomaly.status.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '10px',
                        backgroundColor: getStatusColor(s),
                        color: getStatusTextColor(s),
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                      title={s}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

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

            {/* Dates et Tickets organisés */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              {/* Dates */}
              {(anomaly.appearanceDate || anomaly.correctionDate || anomaly.deliveryDate) && (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    color: 'var(--color-primary-blue)',
                    flexWrap: 'wrap',
                  }}
                >
                  {anomaly.appearanceDate && (
                    <div>
                      <span style={{ fontWeight: '600' }}>📅 Apparition:</span>{' '}
                      {new Date(anomaly.appearanceDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {anomaly.correctionDate && (
                    <div>
                      <span style={{ fontWeight: '600' }}>📅 Correction:</span>{' '}
                      {new Date(anomaly.correctionDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {anomaly.deliveryDate && (
                    <div>
                      <span style={{ fontWeight: '600' }}>📅 Livraison:</span>{' '}
                      {new Date(anomaly.deliveryDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              )}

              {/* Tickets */}
              {(anomaly.ticketSNOW || anomaly.ticketJIRA || anomaly.ticketMainteneur) && (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {anomaly.ticketSNOW && (
                    <a
                      href={anomaly.ticketSNOWUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-secondary-blue)',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                      onClick={(e) => !anomaly.ticketSNOWUrl && e.preventDefault()}
                    >
                      🎫 SNOW: {anomaly.ticketSNOW}
                    </a>
                  )}
                  {anomaly.ticketJIRA && (
                    <a
                      href={anomaly.ticketJIRAUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-secondary-blue)',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                      onClick={(e) => !anomaly.ticketJIRAUrl && e.preventDefault()}
                    >
                      🎫 JIRA: {anomaly.ticketJIRA}
                    </a>
                  )}
                  {anomaly.ticketMainteneur && (
                    <a
                      href={anomaly.ticketMainteneurUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-secondary-blue)',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                      onClick={(e) => !anomaly.ticketMainteneurUrl && e.preventDefault()}
                    >
                      🎫 Mainteneur: {anomaly.ticketMainteneur}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {isEditMode && !isDragging && (
          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(anomaly);
              }}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2f4fb5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
              }}
              title="Modifier"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Êtes-vous sûr de vouloir supprimer cette anomalie ?')) {
                  onDelete(anomaly.id);
                }
              }}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-accent-red)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a01a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
              }}
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
