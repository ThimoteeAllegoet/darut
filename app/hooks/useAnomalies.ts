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
        setAnomalies(JSON.parse(stored));
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
    const filtered = anomalies.filter((a) => a.id !== id);
    saveAnomalies(filtered);
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
