'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnomalies } from '../hooks/useAnomalies';
import { ApplicationName, Anomaly } from '../types/anomaly';
import AnomalyCard from '../components/AnomalyCard';
import AnomalyModal from '../components/AnomalyModal';
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
];

export default function AnomaliesPage() {
  const { mode, isAuthenticated } = useAuth();
  const { anomalies, addAnomaly, updateAnomaly, deleteAnomaly, reorderAnomalies, getAnomaliesByApp } =
    useAnomalies();

  const [selectedApp, setSelectedApp] = useState<ApplicationName>('Bandeau');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnomaly, setEditingAnomaly] = useState<Anomaly | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentAnomalies = getAnomaliesByApp(selectedApp);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentAnomalies.findIndex((a) => a.id === active.id);
      const newIndex = currentAnomalies.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(currentAnomalies, oldIndex, newIndex);
      reorderAnomalies(selectedApp, reordered);
    }
  };

  const handleAddAnomaly = () => {
    setEditingAnomaly(null);
    setIsModalOpen(true);
  };

  const handleEditAnomaly = (anomaly: Anomaly) => {
    setEditingAnomaly(anomaly);
    setIsModalOpen(true);
  };

  const handleSaveAnomaly = (data: {
    title: string;
    description: string;
    incidentReferences: string;
    correctionDate: string;
  }) => {
    if (editingAnomaly) {
      updateAnomaly(editingAnomaly.id, data);
    } else {
      addAnomaly(selectedApp, data.title, data.description, data.incidentReferences, data.correctionDate);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            margin: 0,
          }}
        >
          Gestion des Anomalies
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddAnomaly}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.95rem',
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
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(29, 30, 60, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
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
                  padding: '0.75rem 1.25rem',
                  backgroundColor: isSelected ? 'var(--color-primary-blue)' : 'var(--color-light-blue)',
                  color: isSelected ? 'var(--color-white)' : 'var(--color-primary-dark)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
                    e.currentTarget.style.color = 'var(--color-white)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--color-light-blue)';
                    e.currentTarget.style.color = 'var(--color-primary-dark)';
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
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                  />
                ))}
              </SortableContext>
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
