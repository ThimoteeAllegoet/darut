'use client';

import { useState, useEffect } from 'react';
import { NotableEvent } from '../types/notableEvents';

const NOTABLE_EVENTS_STORAGE_KEY = 'darut_notable_events';

export function useNotableEvents() {
  const [notableEvents, setNotableEvents] = useState<NotableEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(NOTABLE_EVENTS_STORAGE_KEY);
    if (stored) {
      try {
        setNotableEvents(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading notable events:', error);
      }
    }
  }, []);

  const saveEvents = (events: NotableEvent[]) => {
    setNotableEvents(events);
    localStorage.setItem(NOTABLE_EVENTS_STORAGE_KEY, JSON.stringify(events));
  };

  const addEvent = (title: string, date: string, description?: string, createdBy?: string) => {
    const newEvent: NotableEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      date,
      description,
      createdBy: createdBy || 'Utilisateur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveEvents([...notableEvents, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Omit<NotableEvent, 'id' | 'createdAt' | 'createdBy'>>) => {
    const updated = notableEvents.map((event) =>
      event.id === id
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );
    saveEvents(updated);
  };

  const deleteEvent = (id: string) => {
    saveEvents(notableEvents.filter((event) => event.id !== id));
  };

  const getEventsByDate = (date: string) => {
    return notableEvents.filter((event) => event.date === date);
  };

  return {
    notableEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
  };
}
