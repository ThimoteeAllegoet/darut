'use client';

import { useState, useEffect } from 'react';
import { Anomaly, ApplicationName } from '../types/anomaly';

const STORAGE_KEY = 'darut_anomalies';

export function useAnomalies() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migration: convertir status string en array si nécessaire
        const migrated = parsed.map((anomaly: any) => {
          if (anomaly.status && !Array.isArray(anomaly.status)) {
            return {
              ...anomaly,
              status: [anomaly.status],
            };
          }
          // S'assurer que status existe et est un array
          return {
            ...anomaly,
            status: anomaly.status || [],
          };
        });
        setAnomalies(migrated);
        // Sauvegarder la version migrée
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        }
      } catch (error) {
        console.error('Error loading anomalies:', error);
      }
    }
  }, []);

  const saveAnomalies = (newAnomalies: Anomaly[]) => {
    setAnomalies(newAnomalies);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnomalies));
  };

  const addAnomaly = (
    applicationName: ApplicationName,
    anomalyData: Omit<Anomaly, 'id' | 'applicationName' | 'priority' | 'createdAt' | 'updatedAt'>
  ) => {
    const appAnomalies = anomalies.filter((a) => a.applicationName === applicationName);
    const maxPriority = appAnomalies.length > 0
      ? Math.max(...appAnomalies.map((a) => a.priority))
      : 0;

    const newAnomaly: Anomaly = {
      id: Date.now().toString(),
      applicationName,
      priority: maxPriority + 1,
      ...anomalyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAnomalies([...anomalies, newAnomaly]);
  };

  const updateAnomaly = (id: string, updates: Partial<Omit<Anomaly, 'id' | 'createdAt'>>) => {
    const updated = anomalies.map((anomaly) =>
      anomaly.id === id
        ? { ...anomaly, ...updates, updatedAt: new Date().toISOString() }
        : anomaly
    );
    saveAnomalies(updated);
  };

  const deleteAnomaly = (id: string) => {
    const anomalyToDelete = anomalies.find((a) => a.id === id);
    if (!anomalyToDelete) return;

    const appAnomalies = anomalies.filter((a) => a.applicationName === anomalyToDelete.applicationName);
    const filtered = appAnomalies.filter((a) => a.id !== id);

    // Réorganiser les priorités pour qu'elles soient contigües
    const reindexed = filtered
      .sort((a, b) => a.priority - b.priority)
      .map((anomaly, index) => ({
        ...anomaly,
        priority: index + 1,
        updatedAt: new Date().toISOString(),
      }));

    const otherAnomalies = anomalies.filter((a) => a.applicationName !== anomalyToDelete.applicationName);
    saveAnomalies([...otherAnomalies, ...reindexed]);
  };

  const reorderAnomalies = (applicationName: ApplicationName, reorderedAnomalies: Anomaly[]) => {
    const updatedAnomalies = reorderedAnomalies.map((anomaly, index) => ({
      ...anomaly,
      priority: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    const otherAnomalies = anomalies.filter((a) => a.applicationName !== applicationName);
    saveAnomalies([...otherAnomalies, ...updatedAnomalies]);
  };

  const getAnomaliesByApp = (applicationName: ApplicationName) => {
    return anomalies
      .filter((a) => a.applicationName === applicationName)
      .sort((a, b) => a.priority - b.priority);
  };

  return {
    anomalies,
    addAnomaly,
    updateAnomaly,
    deleteAnomaly,
    reorderAnomalies,
    getAnomaliesByApp,
  };
}
