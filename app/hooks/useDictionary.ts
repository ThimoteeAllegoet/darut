'use client';

import { useState, useEffect } from 'react';
import { DictionaryTerm, ApplicationName } from '../types/dictionary';

const STORAGE_KEY = 'darut_dictionary';

export function useDictionary() {
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTerms(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading dictionary:', error);
      }
    }
  }, []);

  const saveTerms = (newTerms: DictionaryTerm[]) => {
    setTerms(newTerms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTerms));
  };

  const addTerm = (termData: Omit<DictionaryTerm, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTerm: DictionaryTerm = {
      id: Date.now().toString(),
      ...termData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTerms([...terms, newTerm]);
  };

  const updateTerm = (id: string, updates: Partial<Omit<DictionaryTerm, 'id' | 'createdAt'>>) => {
    const updated = terms.map((term) =>
      term.id === id
        ? { ...term, ...updates, updatedAt: new Date().toISOString() }
        : term
    );
    saveTerms(updated);
  };

  const deleteTerm = (id: string) => {
    saveTerms(terms.filter((term) => term.id !== id));
  };

  const searchTerms = (query: string, applicationFilter?: ApplicationName) => {
    const lowerQuery = query.toLowerCase();

    return terms.filter((term) => {
      const matchesQuery =
        term.term.toLowerCase().includes(lowerQuery) ||
        term.definition.toLowerCase().includes(lowerQuery);

      const matchesApp = !applicationFilter || term.applications.includes(applicationFilter);

      return matchesQuery && matchesApp;
    }).sort((a, b) => a.term.localeCompare(b.term));
  };

  return {
    terms,
    addTerm,
    updateTerm,
    deleteTerm,
    searchTerms,
  };
}
