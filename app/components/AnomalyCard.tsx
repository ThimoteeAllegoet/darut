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
  isDraggingAny: boolean;
}

export default function AnomalyCard({
  anomaly,
  onEdit,
  onDelete,
  isEditMode,
  totalAnomalies,
  isDraggingAny,
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

  // Mode compact : pendant le drag OU quand une autre carte est en train d'être déplacée
  const isCompact = isDragging || isDraggingAny;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.75rem',
        boxShadow: isDragging ? '0 4px 12px rgba(29, 30, 60, 0.2)' : '0 1px 3px rgba(29, 30, 60, 0.08)',
        border: '1px solid rgba(230, 225, 219, 0.5)',
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
              color: 'rgba(40, 50, 118, 0.4)',
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
            width: '52px',
            height: '55px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700',
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 433.47 460.49"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          >
            <path
              fill={priorityColor}
              d="M391.65,86.98c-42.08-32.57-88.7-59.59-138.73-79.92-23.19-9.42-49.18-9.42-72.37,0-50.03,20.33-96.65,47.35-138.73,79.92-19.83,15.35-32.86,37.92-36.3,62.75C1.82,176.54,0,203.44,0,230.24c0,26.8,1.82,53.7,5.52,80.51,3.44,24.84,16.47,47.41,36.3,62.75,42.08,32.57,88.7,59.59,138.73,79.92,23.19,9.42,49.18,9.42,72.37,0,50.03-20.33,96.65-47.35,138.73-79.92,19.83-15.35,32.86-37.92,36.3-62.75,3.71-26.81,5.53-53.71,5.52-80.51,0-26.8-1.82-53.7-5.52-80.51-3.44-24.84-16.47-47.41-36.3-62.75"
            />
          </svg>
          <span style={{ position: 'relative', zIndex: 1, color: 'var(--color-white)' }}>
            {anomaly.priority}
          </span>
        </div>

        {isCompact ? (
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

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(anomaly.appearanceDate || anomaly.correctionDate || anomaly.deliveryDate) && (
                <div
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(176, 191, 240, 0.15)',
                    borderRadius: '6px',
                    border: '1px solid rgba(176, 191, 240, 0.3)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                    DATES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-primary-blue)' }}>
                    {anomaly.appearanceDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', minWidth: '80px' }}>Apparition</span>
                        <span>{new Date(anomaly.appearanceDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {anomaly.correctionDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', minWidth: '80px' }}>Correction</span>
                        <span>{new Date(anomaly.correctionDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {anomaly.deliveryDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', minWidth: '80px' }}>Livraison</span>
                        <span>{new Date(anomaly.deliveryDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(anomaly.ticketSNOW || anomaly.ticketJIRA || anomaly.ticketMainteneur) && (
                <div
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(217, 201, 229, 0.15)',
                    borderRadius: '6px',
                    border: '1px solid rgba(217, 201, 229, 0.3)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                    TICKETS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-primary-blue)' }}>
                    {anomaly.ticketSNOW && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', minWidth: '90px' }}>SNOW</span>
                        <a
                          href={anomaly.ticketSNOWUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--color-primary-dark)',
                            textDecoration: 'underline',
                            fontWeight: '500',
                          }}
                          onClick={(e) => !anomaly.ticketSNOWUrl && e.preventDefault()}
                        >
                          {anomaly.ticketSNOW}
                        </a>
                      </div>
                    )}
                    {anomaly.ticketJIRA && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', minWidth: '90px' }}>JIRA</span>
                        <a
                          href={anomaly.ticketJIRAUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--color-primary-dark)',
                            textDecoration: 'underline',
                            fontWeight: '500',
                          }}
                          onClick={(e) => !anomaly.ticketJIRAUrl && e.preventDefault()}
                        >
                          {anomaly.ticketJIRA}
                        </a>
                      </div>
                    )}
                    {anomaly.ticketMainteneur && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', minWidth: '90px' }}>Mainteneur</span>
                        <a
                          href={anomaly.ticketMainteneurUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--color-primary-dark)',
                            textDecoration: 'underline',
                            fontWeight: '500',
                          }}
                          onClick={(e) => !anomaly.ticketMainteneurUrl && e.preventDefault()}
                        >
                          {anomaly.ticketMainteneur}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isEditMode && !isCompact && (
          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(anomaly);
              }}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'transparent',
                color: 'rgba(40, 50, 118, 0.5)',
                border: '1px solid rgba(40, 50, 118, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(40, 50, 118, 0.1)';
                e.currentTarget.style.color = 'var(--color-secondary-blue)';
                e.currentTarget.style.borderColor = 'var(--color-secondary-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(40, 50, 118, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(40, 50, 118, 0.2)';
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
                width: '28px',
                height: '28px',
                backgroundColor: 'transparent',
                color: 'rgba(217, 36, 36, 0.5)',
                border: '1px solid rgba(217, 36, 36, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(217, 36, 36, 0.1)';
                e.currentTarget.style.color = 'var(--color-accent-red)';
                e.currentTarget.style.borderColor = 'var(--color-accent-red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(217, 36, 36, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(217, 36, 36, 0.2)';
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
