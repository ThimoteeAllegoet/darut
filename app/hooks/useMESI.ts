'use client';

import { useState, useEffect } from 'react';
import { MESIItem, ApplicationName } from '../types/mesi';

const STORAGE_KEY = 'darut_mesi';

export function useMESI() {
  const [items, setItems] = useState<MESIItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading MESI items:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (
    applicationName: ApplicationName,
    data: Omit<MESIItem, 'id' | 'applicationName' | 'createdAt' | 'updatedAt'>
  ) => {
    const newItem: MESIItem = {
      ...data,
      id: Date.now().toString(),
      applicationName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
  };

  const updateItem = (
    id: string,
    data: Omit<MESIItem, 'id' | 'applicationName' | 'createdAt' | 'updatedAt'>
  ) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, ...data, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getItemsByApp = (applicationName: ApplicationName): MESIItem[] => {
    return items.filter((item) => item.applicationName === applicationName);
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemsByApp,
  };
}
