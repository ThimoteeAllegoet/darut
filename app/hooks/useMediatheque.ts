'use client';

import { useState, useEffect } from 'react';
import { MediathequeItem, ApplicationName } from '../types/mediatheque';

const STORAGE_KEY = 'darut_mediatheque';

export function useMediatheque() {
  const [items, setItems] = useState<MediathequeItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading mediatheque items:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (
    applicationName: ApplicationName,
    data: Omit<MediathequeItem, 'id' | 'applicationName' | 'createdAt' | 'updatedAt'>
  ) => {
    const newItem: MediathequeItem = {
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
    data: Omit<MediathequeItem, 'id' | 'applicationName' | 'createdAt' | 'updatedAt'>
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

  const getItemsByApp = (applicationName: ApplicationName): MediathequeItem[] => {
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
