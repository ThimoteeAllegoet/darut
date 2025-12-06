'use client';

import { useState, useEffect } from 'react';
import { LongPeriod } from '../types/longPeriod';

const STORAGE_KEY = 'darut_long_periods';

export function useLongPeriods() {
  const [longPeriods, setLongPeriods] = useState<LongPeriod[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLongPeriods(parsed);
      } catch (error) {
        console.error('Error loading long periods:', error);
      }
    }
  }, []);

  const saveLongPeriods = (newLongPeriods: LongPeriod[]) => {
    setLongPeriods(newLongPeriods);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLongPeriods));
  };

  const addLongPeriod = (
    longPeriodData: Omit<LongPeriod, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newLongPeriod: LongPeriod = {
      id: Date.now().toString(),
      ...longPeriodData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLongPeriods([...longPeriods, newLongPeriod]);
  };

  const updateLongPeriod = (id: string, updates: Partial<Omit<LongPeriod, 'id' | 'createdAt'>>) => {
    const updated = longPeriods.map((period) =>
      period.id === id
        ? { ...period, ...updates, updatedAt: new Date().toISOString() }
        : period
    );
    saveLongPeriods(updated);
  };

  const deleteLongPeriod = (id: string) => {
    saveLongPeriods(longPeriods.filter((p) => p.id !== id));
  };

  return {
    longPeriods,
    addLongPeriod,
    updateLongPeriod,
    deleteLongPeriod,
  };
}
