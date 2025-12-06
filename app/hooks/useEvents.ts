'use client';

import { useState, useEffect } from 'react';
import { Event, EventType } from '../types/event';

const STORAGE_KEY = 'darut_events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }
  }, []);

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  };

  const addEvent = (
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>) => {
    const updated = events.map((event) =>
      event.id === id
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );
    saveEvents(updated);
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
