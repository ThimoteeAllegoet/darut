'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnomalies } from '../hooks/useAnomalies';
import { ApplicationName, Anomaly } from '../types/anomaly';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnomaly, setEditingAnomaly] = useState<Anomaly | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentAnomalies = getAnomaliesByApp(selectedApp);

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
          Priorisation et suivi des anomalies
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddAnomaly}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
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
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(15px)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
          border: '1px solid rgba(230, 225, 219, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          {applications.map((app) => {
            const isSelected = selectedApp === app;
            const appAnomaliesCount = getAnomaliesByApp(app).length;
            return (
              <button
                key={app}
                onClick={() => setSelectedApp(app)}
                style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: isSelected ? 'var(--color-primary-blue)' : 'rgba(176, 191, 240, 0.2)',
                  color: isSelected ? 'var(--color-white)' : 'var(--color-primary-dark)',
                  border: isSelected ? 'none' : '1px solid rgba(176, 191, 240, 0.4)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'rgba(176, 191, 240, 0.35)';
                    e.currentTarget.style.borderColor = 'rgba(176, 191, 240, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'rgba(176, 191, 240, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(176, 191, 240, 0.4)';
                  }
                }}
              >
                {app}
                {appAnomaliesCount > 0 && (
                  <span
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--color-secondary-yellow)'
                        : 'var(--color-secondary-blue)',
                      color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-white)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                    }}
                  >
                    {appAnomaliesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div>
          {currentAnomalies.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-primary-blue)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
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
              <DragOverlay>
                {activeId ? (
                  <div
                    style={{
                      backgroundColor: 'var(--color-white)',
                      borderRadius: '8px',
                      padding: '1rem',
                      boxShadow: '0 4px 12px rgba(29, 30, 60, 0.3)',
                      border: '2px solid var(--color-secondary-blue)',
                      opacity: 0.9,
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
                            }}
                          >
                            {anomaly.priority}
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
