'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { Event, EventType } from '../types/event';

const eventTypes: EventType[] = ['Incident majeur', 'Version', 'Hotfix', 'Autre'];

const getEventColor = (type: EventType): string => {
  switch (type) {
    case 'Incident majeur':
      return '#D92424';
    case 'Version':
      return '#406BDE';
    case 'Hotfix':
      return '#FF9900';
    case 'Autre':
      return '#9CA3AF';
    default:
      return '#283276';
  }
};

export default function EvenementsPage() {
  const { isAuthenticated } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('Autre');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleAddEvent = () => {
    setEditingEvent(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setType(event.type);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim() || !startDate || !endDate) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title,
        description,
        type,
        startDate,
        endDate,
      });
    } else {
      addEvent({
        title,
        description,
        type,
        startDate,
        endDate,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('Autre');
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(id);
    }
  };

  const handleEventClick = (eventId: string) => {
    setHighlightedId(eventId);
    setTimeout(() => setHighlightedId(null), 2000);

    // Scroll to the event in the list
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Calendar rendering logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday=0 to Monday=0
  };

  const getEventsForDay = (day: number): Event[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return events.filter((event) => {
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            margin: 0,
          }}
        >
          Événements marquants du SI
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddEvent}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2f4fb5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
            }}
          >
            + Nouvel événement
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
        {/* Event List */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(15px)',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
            border: '1px solid rgba(230, 225, 219, 0.3)',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--color-primary-dark)',
              marginTop: 0,
              marginBottom: '1rem',
            }}
          >
            Liste des événements
          </h2>

          {events.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-primary-blue)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                Aucun événement enregistré
              </p>
              {isAuthenticated && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Cliquez sur "Nouvel événement" pour en ajouter un
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {events
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    id={`event-${event.id}`}
                    style={{
                      backgroundColor: highlightedId === event.id ? 'rgba(64, 107, 222, 0.1)' : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: highlightedId === event.id
                        ? '2px solid var(--color-secondary-blue)'
                        : '1px solid rgba(230, 225, 219, 0.5)',
                      boxShadow: highlightedId === event.id
                        ? '0 4px 12px rgba(64, 107, 222, 0.2)'
                        : '0 1px 3px rgba(29, 30, 60, 0.08)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: getEventColor(event.type),
                            }}
                          />
                          <h3
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'var(--color-primary-dark)',
                              margin: 0,
                            }}
                          >
                            {event.title}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.5rem',
                              backgroundColor: getEventColor(event.type),
                              color: 'var(--color-white)',
                              borderRadius: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {event.type}
                          </span>
                        </div>
                        {event.description && (
                          <p
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--color-primary-blue)',
                              margin: '0 0 0.5rem 0',
                            }}
                          >
                            {event.description}
                          </p>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)' }}>
                          <span style={{ fontWeight: '500' }}>Du:</span>{' '}
                          {new Date(event.startDate).toLocaleDateString('fr-FR')}
                          {' '}<span style={{ fontWeight: '500' }}>au:</span>{' '}
                          {new Date(event.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
                          <button
                            onClick={() => handleEditEvent(event)}
                            style={{
                              width: '28px',
                              height: '28px',
                              backgroundColor: 'transparent',
                              color: 'rgba(40, 50, 118, 0.5)',
                              border: '1px solid rgba(40, 50, 118, 0.2)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(40, 50, 118, 0.1)';
                              e.currentTarget.style.color = 'var(--color-secondary-blue)';
                              e.currentTarget.style.borderColor = 'var(--color-secondary-blue)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'rgba(40, 50, 118, 0.5)';
                              e.currentTarget.style.borderColor = 'rgba(40, 50, 118, 0.2)';
                            }}
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              backgroundColor: 'transparent',
                              color: 'rgba(217, 36, 36, 0.5)',
                              border: '1px solid rgba(217, 36, 36, 0.2)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(217, 36, 36, 0.1)';
                              e.currentTarget.style.color = 'var(--color-accent-red)';
                              e.currentTarget.style.borderColor = 'var(--color-accent-red)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'rgba(217, 36, 36, 0.5)';
                              e.currentTarget.style.borderColor = 'rgba(217, 36, 36, 0.2)';
                            }}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(15px)',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
            border: '1px solid rgba(230, 225, 219, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button
              onClick={prevMonth}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--color-primary-dark)',
                margin: 0,
              }}
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'var(--color-primary-dark)',
                  padding: '0.25rem',
                }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <div
                  key={index}
                  style={{
                    minHeight: '48px',
                    backgroundColor: day ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                    borderRadius: '4px',
                    padding: '0.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {day && (
                    <>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: '500',
                        }}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              onMouseEnter={(e) => {
                                const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                                if (tooltip) tooltip.style.display = 'block';
                              }}
                              onMouseLeave={(e) => {
                                const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                                if (tooltip) tooltip.style.display = 'none';
                              }}
                              onClick={() => handleEventClick(event.id)}
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: getEventColor(event.type),
                                cursor: 'pointer',
                                position: 'relative',
                              }}
                            >
                              <div
                                data-tooltip
                                style={{
                                  display: 'none',
                                  position: 'absolute',
                                  bottom: '100%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: 'var(--color-primary-dark)',
                                  color: 'var(--color-white)',
                                  padding: '0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  whiteSpace: 'nowrap',
                                  zIndex: 1000,
                                  marginBottom: '4px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                }}
                              >
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{event.title}</div>
                                <div>{event.type}</div>
                                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8 }}>
                                  Cliquer pour voir le détail
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(29, 30, 60, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                color: 'var(--color-primary-dark)',
              }}
            >
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h2>

            <div style={{ marginBottom: '0.75rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Type *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {eventTypes.map((eventType) => (
                  <button
                    key={eventType}
                    type="button"
                    onClick={() => setType(eventType)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: type === eventType ? getEventColor(eventType) : 'rgba(176, 191, 240, 0.2)',
                      color: type === eventType ? 'var(--color-white)' : 'var(--color-primary-dark)',
                      border: type === eventType ? 'none' : '1px solid rgba(176, 191, 240, 0.4)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                    }}
                  >
                    {eventType}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  Date de début *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid var(--color-neutral-beige)',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid var(--color-neutral-beige)',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-neutral-beige)',
                  color: 'var(--color-primary-dark)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEvent}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-secondary-blue)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                {editingEvent ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
