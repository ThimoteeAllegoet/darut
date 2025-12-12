'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnomalies } from '../hooks/useAnomalies';
import { ApplicationName, Anomaly, SupportEntity } from '../types/anomaly';
import AnomalyCard from '../components/AnomalyCard';
import AnomalyModal from '../components/AnomalyModal';
import { getPriorityColor } from '../utils/anomalyHelpers';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const applications: ApplicationName[] = [
  'Bandeau',
  'CVM',
  'AGENDA',
  'Weplan',
  'GEM',
  'Visio',
  'Scanner',
  'eBorne',
  'Trace de contact',
];

export default function AnomaliesPage() {
  const { mode, isAuthenticated } = useAuth();
  const { anomalies, addAnomaly, updateAnomaly, deleteAnomaly, reorderAnomalies, getAnomaliesByApp } =
    useAnomalies();

  const [selectedApp, setSelectedApp] = useState<ApplicationName>('Bandeau');
  const [supportEntityFilter, setSupportEntityFilter] = useState<SupportEntity>('France Travail');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnomaly, setEditingAnomaly] = useState<Anomaly | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  let currentAnomalies = getAnomaliesByApp(selectedApp);

  // Filter by support entity if Bandeau is selected (always filter for Bandeau, no 'all' option)
  if (selectedApp === 'Bandeau') {
    currentAnomalies = currentAnomalies.filter(anomaly => anomaly.supportEntity === supportEntityFilter);
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentAnomalies.findIndex((a) => a.id === active.id);
      const newIndex = currentAnomalies.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(currentAnomalies, oldIndex, newIndex);
      reorderAnomalies(selectedApp, reordered);
    }
    setActiveId(null);
  };

  const handleAddAnomaly = () => {
    setEditingAnomaly(null);
    setIsModalOpen(true);
  };

  const handleEditAnomaly = (anomaly: Anomaly) => {
    setEditingAnomaly(anomaly);
    setIsModalOpen(true);
  };

  const handleSaveAnomaly = (
    data: Omit<Anomaly, 'id' | 'applicationName' | 'priority' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingAnomaly) {
      updateAnomaly(editingAnomaly.id, data);
    } else {
      addAnomaly(selectedApp, data);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            margin: 0,
          }}
        >
          Priorisation et suivi des anomalies majeurs
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddAnomaly}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '0.9rem',
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
            + Nouvelle anomalie
          </button>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            overflowX: 'auto',
          }}
        >
          {applications.map((app) => {
            const isSelected = selectedApp === app;
            return (
              <button
                key={app}
                onClick={() => setSelectedApp(app)}
                style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'transparent',
                  color: isSelected ? 'var(--color-primary-dark)' : 'rgba(40, 50, 118, 0.7)',
                  border: 'none',
                  borderBottom: isSelected ? '2px solid var(--color-primary-dark)' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '700' : '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderBottom = '2px solid var(--color-primary-dark)';
                  e.currentTarget.style.color = 'var(--color-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderBottom = isSelected ? '2px solid var(--color-primary-dark)' : '2px solid transparent';
                  e.currentTarget.style.color = isSelected ? 'var(--color-primary-dark)' : 'rgba(40, 50, 118, 0.7)';
                }}
              >
                {app}
              </button>
            );
          })}
        </div>

        {/* Support entity filter for Bandeau */}
        {selectedApp === 'Bandeau' && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary-dark)', alignSelf: 'center' }}>
              Prise en charge :
            </span>
            <button
              onClick={() => setSupportEntityFilter('France Travail')}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: supportEntityFilter === 'France Travail' ? 'var(--color-secondary-blue)' : 'var(--color-light-blue)',
                color: supportEntityFilter === 'France Travail' ? 'var(--color-white)' : 'var(--color-primary-dark)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              France Travail
            </button>
            <button
              onClick={() => setSupportEntityFilter('ODIGO')}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: supportEntityFilter === 'ODIGO' ? 'var(--color-secondary-blue)' : 'var(--color-light-blue)',
                color: supportEntityFilter === 'ODIGO' ? 'var(--color-white)' : 'var(--color-primary-dark)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              ODIGO
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '1.5rem 0',
        }}
      >

        <div>
          {currentAnomalies.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-primary-blue)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: 'rgba(40, 50, 118, 0.5)' }}>
                help_center
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                Aucune anomalie pour {selectedApp}
              </p>
              {isAuthenticated && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Cliquez sur "Nouvelle anomalie" pour en ajouter une
                </p>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
            >
              <SortableContext
                items={currentAnomalies.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentAnomalies.map((anomaly) => (
                  <AnomalyCard
                    key={anomaly.id}
                    anomaly={anomaly}
                    onEdit={handleEditAnomaly}
                    onDelete={deleteAnomaly}
                    isEditMode={isAuthenticated}
                    totalAnomalies={currentAnomalies.length}
                    isDraggingAny={activeId !== null}
                  />
                ))}
              </SortableContext>
              <DragOverlay adjustScale={false} dropAnimation={null}>
                {activeId ? (
                  <div
                    style={{
                      backgroundColor: 'var(--color-white)',
                      borderRadius: '8px',
                      padding: '1rem',
                      boxShadow: '0 8px 20px rgba(29, 30, 60, 0.3)',
                      border: '2px solid var(--color-secondary-blue)',
                      opacity: 0.95,
                      cursor: 'grabbing',
                    }}
                  >
                    {(() => {
                      const anomaly = currentAnomalies.find((a) => a.id === activeId);
                      if (!anomaly) return null;
                      const priorityColor = anomaly
                        ? getPriorityColor(anomaly.priority, currentAnomalies.length)
                        : '#D92424';
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '39px',
                              height: '39px',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.125rem',
                              fontWeight: '700',
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              viewBox="0 0 460.51 460.49"
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
                                d="M387.41,443.39c-13.41,4.93-27.77,7.66-42,9.64-76.79,9.97-154.28,9.96-231.07-.12-28.18-3.85-58.29-11.58-78-33.13-18.28-19.64-25.1-47.5-28.7-73.65C-2.17,267.94-6.5,140.82,19.61,67.08,35.63,26.57,76.17,11.94,116.5,7.34c81.9-10.14,165.1-10.4,246.61,3.14,22.52,4.41,45.32,13.1,60.95,30.1,48.52,47.02,38.47,250.73,26.91,317.84-6.2,38.66-24.69,71.77-63.48,84.94l-.08.03Z"
                              />
                            </svg>
                            <span style={{ position: 'relative', zIndex: 1, color: 'var(--color-white)' }}>
                              {anomaly.priority}
                            </span>
                          </div>
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
                      );
                    })()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      <AnomalyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAnomaly(null);
        }}
        onSave={handleSaveAnomaly}
        applicationName={selectedApp}
        anomaly={editingAnomaly}
      />
    </div>
  );
}
