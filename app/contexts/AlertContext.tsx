'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from '../types/alert';

const STORAGE_KEY = 'darut_alerts';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAlert: (id: string, alertData: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  getActiveAlert: () => Alert | null;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
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

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        updateAlert,
        deleteAlert,
        getActiveAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
