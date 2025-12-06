'use client';

import { useState, useEffect } from 'react';
import { MediathequeItem } from '../types/mediatheque';

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
    data: Omit<MediathequeItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newItem: MediathequeItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
  };

  const updateItem = (
    id: string,
    data: Omit<MediathequeItem, 'id' | 'createdAt' | 'updatedAt'>
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

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
  };
}
