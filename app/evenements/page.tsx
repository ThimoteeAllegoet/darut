'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { Event, EventType, ApplicationName } from '../types/event';

const eventTypes: EventType[] = ['Incident majeur', 'Version', 'Hotfix', 'Autre'];

const applicationNames: ApplicationName[] = [
  'Bandeau',
  'CVM',
  'AGENDA',
  'Weplan',
  'GEM',
  'Visio',
  'Scanner',
  'eBorne',
  'Trace de contact',
  'Autres',
];

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

const formatDateRange = (event: Event): string => {
  const startDate = new Date(event.startDate).toLocaleDateString('fr-FR');
  const endDate = new Date(event.endDate).toLocaleDateString('fr-FR');

  let dateStr = `${startDate} - ${endDate}`;

  if (event.startTime || event.endTime) {
    const times = [];
    if (event.startTime) times.push(event.startTime);
    if (event.endTime) times.push(event.endTime);
    dateStr += ` (${times.join(' - ')})`;
  }

  return dateStr;
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
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [changeTicket, setChangeTicket] = useState('');
  const [changeTicketUrl, setChangeTicketUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [applications, setApplications] = useState<ApplicationName[]>([]);

  // Filter state
  const [filterType, setFilterType] = useState<EventType | 'Tous'>('Tous');
  const [filterApp, setFilterApp] = useState<ApplicationName | 'Tous'>('Tous');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-desc');

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
    setStartTime(event.startTime || '');
    setEndTime(event.endTime || '');
    setChangeTicket(event.changeTicket || '');
    setChangeTicketUrl(event.changeTicketUrl || '');
    setContentUrl(event.contentUrl || '');
    setApplications(event.applications || []);
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
        startTime,
        endTime,
        changeTicket,
        changeTicketUrl,
        contentUrl,
        applications,
      });
    } else {
      addEvent({
        title,
        description,
        type,
        startDate,
        endDate,
        startTime,
        endTime,
        changeTicket,
        changeTicketUrl,
        contentUrl,
        applications,
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
    setStartTime('');
    setEndTime('');
    setChangeTicket('');
    setChangeTicketUrl('');
    setContentUrl('');
    setApplications([]);
  };

  const toggleApplication = (app: ApplicationName) => {
    setApplications((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
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

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      if (filterType !== 'Tous' && event.type !== filterType) return false;
      if (filterApp !== 'Tous' && !event.applications.includes(filterApp)) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

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

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '6px',
              border: '1px solid rgba(230, 225, 219, 0.5)',
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                }}
              >
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as EventType | 'Tous')}
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--color-white)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="Tous">Tous</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                }}
              >
                Application
              </label>
              <select
                value={filterApp}
                onChange={(e) => setFilterApp(e.target.value as ApplicationName | 'Tous')}
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--color-white)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="Tous">Tous</option>
                {applicationNames.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                }}
              >
                Tri
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date-asc' | 'date-desc')}
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--color-white)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="date-desc">Plus récent</option>
                <option value="date-asc">Plus ancien</option>
              </select>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-primary-blue)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {events.length === 0 ? 'Aucun événement enregistré' : 'Aucun événement ne correspond aux filtres'}
              </p>
              {isAuthenticated && events.length === 0 && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Cliquez sur "Nouvel événement" pour en ajouter un
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredEvents.map((event) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
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

                      {/* Applications badges */}
                      {event.applications && event.applications.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          {event.applications.map((app) => (
                            <span
                              key={app}
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.15rem 0.4rem',
                                backgroundColor: 'rgba(64, 107, 222, 0.15)',
                                color: 'var(--color-secondary-blue)',
                                borderRadius: '8px',
                                fontWeight: '600',
                                border: '1px solid rgba(64, 107, 222, 0.3)',
                              }}
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      )}

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

                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>Du:</span>{' '}
                        {new Date(event.startDate).toLocaleDateString('fr-FR')}
                        {event.startTime && ` à ${event.startTime}`}
                        {' '}<span style={{ fontWeight: '500' }}>au:</span>{' '}
                        {new Date(event.endDate).toLocaleDateString('fr-FR')}
                        {event.endTime && ` à ${event.endTime}`}
                      </div>

                      {/* Change ticket link */}
                      {event.changeTicket && (
                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-primary-blue)', fontWeight: '500' }}>
                            Change ticket:{' '}
                          </span>
                          {event.changeTicketUrl ? (
                            <a
                              href={event.changeTicketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: 'var(--color-secondary-blue)',
                                textDecoration: 'underline',
                                fontWeight: '600',
                              }}
                            >
                              {event.changeTicket}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--color-primary-blue)' }}>
                              {event.changeTicket}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Content URL button (only for Version and Hotfix) */}
                      {event.contentUrl && (event.type === 'Version' || event.type === 'Hotfix') && (
                        <div>
                          <a
                            href={event.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: 'var(--color-secondary-blue)',
                              color: 'var(--color-white)',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#2f4fb5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
                            }}
                          >
                            Voir le contenu
                          </a>
                        </div>
                      )}
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
                                <div style={{ marginBottom: '0.15rem' }}>{event.type}</div>
                                <div style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>
                                  {formatDateRange(event)}
                                </div>
                                {event.applications && event.applications.length > 0 && (
                                  <div style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>
                                    {event.applications.join(', ')}
                                  </div>
                                )}
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
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: '0 0 1.25rem 0',
                fontSize: '1.25rem',
                color: 'var(--color-primary-dark)',
              }}
            >
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h2>

            {/* Title */}
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

            {/* Description */}
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

            {/* Type selector */}
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

            {/* Applications multi-select */}
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
                Applications
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {applicationNames.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => toggleApplication(app)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: applications.includes(app)
                        ? 'var(--color-secondary-blue)'
                        : 'rgba(176, 191, 240, 0.2)',
                      color: applications.includes(app)
                        ? 'var(--color-white)'
                        : 'var(--color-primary-dark)',
                      border: applications.includes(app)
                        ? 'none'
                        : '1px solid rgba(176, 191, 240, 0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                    }}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
                  Heure de début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
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

            {/* Change Ticket */}
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
                Change ticket
              </label>
              <input
                type="text"
                value={changeTicket}
                onChange={(e) => setChangeTicket(e.target.value)}
                placeholder="Ex: CHG0012345"
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
                Change ticket URL
              </label>
              <input
                type="url"
                value={changeTicketUrl}
                onChange={(e) => setChangeTicketUrl(e.target.value)}
                placeholder="https://..."
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

            {/* Content URL (only for Version and Hotfix) */}
            {(type === 'Version' || type === 'Hotfix') && (
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  URL du contenu
                </label>
                <input
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://..."
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
            )}

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
