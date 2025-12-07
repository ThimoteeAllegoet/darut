'use client';

import { useState, useEffect } from 'react';
import { Alert } from '../types/alert';

const STORAGE_KEY = 'darut_alerts';

export function useAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading alerts:', error);
        setAlerts([]);
      }
    }
  }, []);

  const saveAlerts = (newAlerts: Alert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
  };

  const addAlert = (alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAlerts([...alerts, newAlert]);
  };

  const updateAlert = (id: string, alertData: Partial<Alert>) => {
    const updated = alerts.map((alert) =>
      alert.id === id
        ? { ...alert, ...alertData, updatedAt: new Date().toISOString() }
        : alert
    );
    saveAlerts(updated);
  };

  const deleteAlert = (id: string) => {
    saveAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const getActiveAlert = (): Alert | null => {
    return alerts.find((alert) => alert.isActive) || null;
  };

  return {
    alerts,
    addAlert,
    updateAlert,
    deleteAlert,
    getActiveAlert,
  };
}
