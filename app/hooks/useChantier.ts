'use client';

import { useState, useEffect } from 'react';
import { Chantier } from '../types/chantier';

const STORAGE_KEY = 'darut_chantier';

export function useChantier() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setChantiers(parsed);
      } catch (error) {
        console.error('Error loading chantiers:', error);
      }
    }
  }, []);

  const saveChantiers = (newChantiers: Chantier[]) => {
    setChantiers(newChantiers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChantiers));
  };

  const addChantier = (
    chantierData: Omit<Chantier, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newChantier: Chantier = {
      id: Date.now().toString(),
      ...chantierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveChantiers([...chantiers, newChantier]);
  };

  const updateChantier = (id: string, updates: Partial<Omit<Chantier, 'id' | 'createdAt'>>) => {
    const updated = chantiers.map((chantier) =>
      chantier.id === id
        ? { ...chantier, ...updates, updatedAt: new Date().toISOString() }
        : chantier
    );
    saveChantiers(updated);
  };

  const deleteChantier = (id: string) => {
    saveChantiers(chantiers.filter((c) => c.id !== id));
  };

  return {
    chantiers,
    addChantier,
    updateChantier,
    deleteChantier,
  };
}
