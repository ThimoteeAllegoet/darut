'use client';

import { useState, useEffect } from 'react';
import { Event, EventType, EventPeriod } from '../types/event';

const STORAGE_KEY = 'darut_events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migration: convert old single-period events to multi-period format
        const migrated = parsed.map((event: any) => {
          let periods: EventPeriod[] = event.periods || [];

          // If event has legacy startDate/endDate but no periods, migrate to periods array
          if ((!periods || periods.length === 0) && event.startDate && event.endDate) {
            periods = [{
              id: Date.now().toString(),
              startDate: event.startDate,
              endDate: event.endDate,
              startTime: event.startTime || undefined,
              endTime: event.endTime || undefined,
            }];
          }

          return {
            ...event,
            periods,
            applications: event.applications || [],
            // Keep legacy fields for backward compatibility
            startDate: event.startDate || (periods[0]?.startDate),
            endDate: event.endDate || (periods[0]?.endDate),
            startTime: event.startTime || '',
            endTime: event.endTime || '',
            changeTicket: event.changeTicket || '',
            changeTicketUrl: event.changeTicketUrl || '',
            contentUrl: event.contentUrl || '',
          };
        });
        setEvents(migrated);
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        }
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
