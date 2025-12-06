'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useLongPeriods } from '../hooks/useLongPeriods';
import { Event, EventType, ApplicationName, EventPeriod } from '../types/event';
import { LongPeriod } from '../types/longPeriod';

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

const formatDateRange = (period: EventPeriod): string => {
  const startDate = new Date(period.startDate).toLocaleDateString('fr-FR');
  const endDate = new Date(period.endDate).toLocaleDateString('fr-FR');

  let dateStr = `Du ${startDate} au ${endDate}`;

  if (period.startTime || period.endTime) {
    const times = [];
    if (period.startTime) times.push(period.startTime);
    if (period.endTime) times.push(period.endTime);
    dateStr += ` (${times.join(' - ')})`;
  }

  return dateStr;
};

const getOrdinalLabel = (index: number): string => {
  const ordinals = [
    'Première occurrence',
    'Deuxième occurrence',
    'Troisième occurrence',
    'Quatrième occurrence',
    'Cinquième occurrence',
    'Sixième occurrence',
    'Septième occurrence',
    'Huitième occurrence',
    'Neuvième occurrence',
    'Dixième occurrence',
  ];
  return ordinals[index] || `${index + 1}ème occurrence`;
};

const presetColors = [
  '#FFE5E5', // Light red
  '#E5F3FF', // Light blue
  '#FFF3E5', // Light orange
  '#E5FFE5', // Light green
  '#F3E5FF', // Light purple
  '#FFFFE5', // Light yellow
  '#FFE5F3', // Light pink
  '#E5FFF3', // Light mint
];

export default function EvenementsPage() {
  const { isAuthenticated } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { longPeriods, addLongPeriod, updateLongPeriod, deleteLongPeriod } = useLongPeriods();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLongPeriodModalOpen, setIsLongPeriodModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingLongPeriod, setEditingLongPeriod] = useState<LongPeriod | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('Autre');
  const [periods, setPeriods] = useState<EventPeriod[]>([{
    id: Date.now().toString(),
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  }]);
  const [changeTicket, setChangeTicket] = useState('');
  const [changeTicketUrl, setChangeTicketUrl] = useState('');
  const [parentIncident, setParentIncident] = useState('');
  const [parentIncidentUrl, setParentIncidentUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [applications, setApplications] = useState<ApplicationName[]>([]);

  // Long period form state
  const [longPeriodTitle, setLongPeriodTitle] = useState('');
  const [longPeriodStartDate, setLongPeriodStartDate] = useState('');
  const [longPeriodEndDate, setLongPeriodEndDate] = useState('');
  const [longPeriodColor, setLongPeriodColor] = useState(presetColors[0]);

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
    setPeriods(event.periods.length > 0 ? event.periods.map(p => ({ ...p })) : [{
      id: Date.now().toString(),
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }]);
    setChangeTicket(event.changeTicket || '');
    setChangeTicketUrl(event.changeTicketUrl || '');
    setParentIncident(event.parentIncident || '');
    setParentIncidentUrl(event.parentIncidentUrl || '');
    setContentUrl(event.contentUrl || '');
    setApplications(event.applications || []);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) return;

    // Validate at least one period with dates
    const validPeriods = periods.filter(p => p.startDate && p.endDate);
    if (validPeriods.length === 0) return;

    const eventData = {
      title,
      description,
      type,
      periods: validPeriods,
      // Set legacy fields to first period for backward compatibility
      startDate: validPeriods[0].startDate,
      endDate: validPeriods[0].endDate,
      startTime: validPeriods[0].startTime,
      endTime: validPeriods[0].endTime,
      changeTicket,
      changeTicketUrl,
      parentIncident,
      parentIncidentUrl,
      contentUrl,
      applications,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('Autre');
    setPeriods([{
      id: Date.now().toString(),
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }]);
    setChangeTicket('');
    setChangeTicketUrl('');
    setParentIncident('');
    setParentIncidentUrl('');
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

  // Long period handlers
  const handleAddLongPeriod = () => {
    setEditingLongPeriod(null);
    resetLongPeriodForm();
    setIsLongPeriodModalOpen(true);
  };

  const handleEditLongPeriod = (longPeriod: LongPeriod) => {
    setEditingLongPeriod(longPeriod);
    setLongPeriodTitle(longPeriod.title);
    setLongPeriodStartDate(longPeriod.startDate);
    setLongPeriodEndDate(longPeriod.endDate);
    setLongPeriodColor(longPeriod.color);
    setIsLongPeriodModalOpen(true);
  };

  const handleSaveLongPeriod = () => {
    if (!longPeriodTitle.trim() || !longPeriodStartDate || !longPeriodEndDate) return;

    const longPeriodData = {
      title: longPeriodTitle,
      startDate: longPeriodStartDate,
      endDate: longPeriodEndDate,
      color: longPeriodColor,
    };

    if (editingLongPeriod) {
      updateLongPeriod(editingLongPeriod.id, longPeriodData);
    } else {
      addLongPeriod(longPeriodData);
    }

    setIsLongPeriodModalOpen(false);
    resetLongPeriodForm();
  };

  const resetLongPeriodForm = () => {
    setLongPeriodTitle('');
    setLongPeriodStartDate('');
    setLongPeriodEndDate('');
    setLongPeriodColor(presetColors[0]);
  };

  const handleDeleteLongPeriod = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) {
      deleteLongPeriod(id);
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

  // Period management functions
  const addPeriod = () => {
    setPeriods([...periods, {
      id: Date.now().toString(),
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }]);
  };

  const removePeriod = (periodId: string) => {
    if (periods.length > 1) {
      setPeriods(periods.filter(p => p.id !== periodId));
    }
  };

  const updatePeriod = (periodId: string, field: keyof EventPeriod, value: string) => {
    setPeriods(periods.map(p =>
      p.id === periodId ? { ...p, [field]: value } : p
    ));
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
      // Check if the date falls within any of the event's periods
      return event.periods.some(period =>
        dateStr >= period.startDate && dateStr <= period.endDate
      );
    });
  };

  const getLongPeriodsForDay = (day: number): LongPeriod[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return longPeriods.filter((period) =>
      dateStr >= period.startDate && dateStr <= period.endDate
    );
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

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      if (filterType !== 'Tous' && event.type !== filterType) return false;
      if (filterApp !== 'Tous' && !event.applications.includes(filterApp)) return false;
      return true;
    })
    .sort((a, b) => {
      // Use first period for sorting
      const dateA = a.periods.length > 0 ? new Date(a.periods[0].startDate).getTime() : 0;
      const dateB = b.periods.length > 0 ? new Date(b.periods[0].startDate).getTime() : 0;
      return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Statistics calculations based on displayed calendar month/year
  const displayedYear = currentMonth.getFullYear();
  const displayedMonth = currentMonth.getMonth();

  const majorIncidents = events.filter(e => e.type === 'Incident majeur');

  // Incidents in displayed month
  const incidentsThisMonth = majorIncidents.filter(event => {
    return event.periods.some(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const monthStart = new Date(displayedYear, displayedMonth, 1);
      const monthEnd = new Date(displayedYear, displayedMonth + 1, 0);

      return (
        (startDate >= monthStart && startDate <= monthEnd) ||
        (endDate >= monthStart && endDate <= monthEnd) ||
        (startDate <= monthStart && endDate >= monthEnd)
      );
    });
  }).length;

  // Incidents in displayed year
  const incidentsThisYear = majorIncidents.filter(event => {
    return event.periods.some(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const yearStart = new Date(displayedYear, 0, 1);
      const yearEnd = new Date(displayedYear, 11, 31);

      return (
        (startDate >= yearStart && startDate <= yearEnd) ||
        (endDate >= yearStart && endDate <= yearEnd) ||
        (startDate <= yearStart && endDate >= yearEnd)
      );
    });
  }).length;

  // Incidents by application (for the entire year)
  const incidentsByApp: { [key: string]: number } = {};
  majorIncidents.forEach(event => {
    const eventInYear = event.periods.some(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const yearStart = new Date(displayedYear, 0, 1);
      const yearEnd = new Date(displayedYear, 11, 31);

      return (
        (startDate >= yearStart && startDate <= yearEnd) ||
        (endDate >= yearStart && endDate <= yearEnd) ||
        (startDate <= yearStart && endDate >= yearEnd)
      );
    });

    if (eventInYear) {
      event.applications.forEach(app => {
        incidentsByApp[app] = (incidentsByApp[app] || 0) + 1;
      });
    }
  });

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
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleAddEvent}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '50px',
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
            <button
              onClick={handleAddLongPeriod}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6B7280',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4B5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6B7280';
              }}
            >
              + Ajouter une période
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
        {/* Event List */}
        <div>
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
                    position: 'relative',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: highlightedId === event.id
                      ? '2px solid var(--color-secondary-blue)'
                      : '1px solid rgba(230, 225, 219, 0.5)',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
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

                      {/* Display all periods */}
                      <div style={{ marginBottom: '0.5rem' }}>
                        {event.periods && event.periods.length > 0 ? (
                          event.periods.map((period, index) => (
                            <div
                              key={period.id}
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-primary-blue)',
                                marginBottom: index < event.periods.length - 1 ? '0.25rem' : '0',
                                paddingLeft: event.periods.length > 1 ? '0.5rem' : '0',
                                borderLeft: event.periods.length > 1 ? '2px solid rgba(64, 107, 222, 0.3)' : 'none',
                              }}
                            >
                              {event.periods.length > 1 && (
                                <span style={{ fontWeight: '600', marginRight: '0.25rem' }}>
                                  {getOrdinalLabel(index)}:
                                </span>
                              )}
                              <span style={{ fontWeight: '500' }}>Du:</span>{' '}
                              {new Date(period.startDate).toLocaleDateString('fr-FR')}
                              {period.startTime && ` à ${period.startTime}`}
                              {' '}<span style={{ fontWeight: '500' }}>au:</span>{' '}
                              {new Date(period.endDate).toLocaleDateString('fr-FR')}
                              {period.endTime && ` à ${period.endTime}`}
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)' }}>
                            Aucune période définie
                          </div>
                        )}
                      </div>

                      {/* Change ticket link */}
                      {event.changeTicket && (
                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-primary-blue)', fontWeight: '500' }}>
                            Changement en cause:{' '}
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

                      {/* Parent incident link */}
                      {event.parentIncident && (
                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-primary-blue)', fontWeight: '500' }}>
                            Incident parent:{' '}
                          </span>
                          {event.parentIncidentUrl ? (
                            <a
                              href={event.parentIncidentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: 'var(--color-secondary-blue)',
                                textDecoration: 'underline',
                                fontWeight: '600',
                              }}
                            >
                              {event.parentIncident}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--color-primary-blue)' }}>
                              {event.parentIncident}
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

                    {/* Right side container for badges and buttons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.75rem',
                      flexShrink: 0,
                    }}>
                      {/* Applications badges */}
                      {event.applications && event.applications.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '0.35rem',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-end',
                          maxWidth: '200px',
                        }}>
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

                      {/* Admin buttons */}
                      {isAuthenticated && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditEvent(event)}
                            style={{
                              width: '32px',
                              height: '32px',
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
                              width: '32px',
                              height: '32px',
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Calendar and Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Calendar */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              padding: '1.5rem',
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
                  padding: 0,
                }}
              >
                ‹
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
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
                  onClick={goToToday}
                  style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: 'transparent',
                    color: 'var(--color-secondary-blue)',
                    border: '1px solid var(--color-secondary-blue)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
                    e.currentTarget.style.color = 'var(--color-white)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-secondary-blue)';
                  }}
                >
                  Aujourd'hui
                </button>
              </div>
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
                  padding: 0,
                }}
              >
                ›
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
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
                const dayLongPeriods = day ? getLongPeriodsForDay(day) : [];

                // Calculate combined background color from long periods
                let backgroundColor = day ? 'rgba(255, 255, 255, 0.6)' : 'transparent';
                if (day && dayLongPeriods.length > 0) {
                  // Use the first long period's color as base
                  backgroundColor = dayLongPeriods[0].color;
                }

                return (
                  <div
                    key={index}
                    style={{
                      minHeight: '48px',
                      backgroundColor,
                      border: day ? '1.5px solid rgba(230, 225, 219, 0.8)' : 'none',
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
                        {(dayEvents.length > 0 || dayLongPeriods.length > 0) && (
                          <div
                            onMouseEnter={(e) => {
                              const tooltip = e.currentTarget.querySelector('[data-calendar-tooltip]') as HTMLElement;
                              if (tooltip) tooltip.style.display = 'block';
                            }}
                            onMouseLeave={(e) => {
                              const tooltip = e.currentTarget.querySelector('[data-calendar-tooltip]') as HTMLElement;
                              if (tooltip) tooltip.style.display = 'none';
                            }}
                            style={{
                              display: dayEvents.length > 0 ? 'flex' : 'block',
                              gap: '2px',
                              marginTop: '2px',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              position: 'relative',
                              width: '100%',
                              height: dayEvents.length === 0 ? '1px' : 'auto',
                            }}
                          >
                            {/* Combined tooltip for long periods and events */}
                            <div
                              data-calendar-tooltip
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
                                maxWidth: '250px',
                                minWidth: '150px',
                              }}
                            >
                              {dayLongPeriods.length > 0 && (
                                <div style={{ marginBottom: dayEvents.length > 0 ? '0.5rem' : '0' }}>
                                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.65rem', opacity: 0.8 }}>
                                    PÉRIODE
                                  </div>
                                  {dayLongPeriods.map((period) => (
                                    <div key={period.id} style={{ marginBottom: '0.25rem' }}>
                                      <div style={{ fontWeight: '600' }}>{period.title}</div>
                                      <div style={{ fontSize: '0.65rem' }}>
                                        {new Date(period.startDate).toLocaleDateString('fr-FR')} - {new Date(period.endDate).toLocaleDateString('fr-FR')}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {dayEvents.length > 0 && (
                                <div>
                                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.65rem', opacity: 0.8 }}>
                                    ÉVÉNEMENTS
                                  </div>
                                  {dayEvents.map((event) => (
                                    <div key={event.id} style={{ marginBottom: '0.25rem', cursor: 'pointer' }} onClick={() => handleEventClick(event.id)}>
                                      <div style={{ fontWeight: '600' }}>{event.title}</div>
                                      <div style={{ fontSize: '0.65rem' }}>{event.type}</div>
                                      {event.applications && event.applications.length > 0 && (
                                        <div style={{ fontSize: '0.65rem' }}>
                                          {event.applications.join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8 }}>
                                    Cliquer sur un événement pour voir le détail
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Event dots */}
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                onClick={() => handleEventClick(event.id)}
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: getEventColor(event.type),
                                  cursor: 'pointer',
                                }}
                              />
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

          {/* Statistics Report */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              padding: '1.5rem',
              border: '1px solid rgba(230, 225, 219, 0.3)',
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--color-primary-dark)',
                margin: '0 0 1rem 0',
              }}
            >
              Statistiques
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Current month */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(217, 36, 36, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(217, 36, 36, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-blue)', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Incidents majeurs - {monthNames[displayedMonth]} {displayedYear}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D92424' }}>
                  {incidentsThisMonth}
                </div>
              </div>

              {/* Current year */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(217, 36, 36, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(217, 36, 36, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-blue)', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Incidents majeurs - {displayedYear}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D92424' }}>
                  {incidentsThisYear}
                </div>
              </div>

              {/* By application */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(64, 107, 222, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(64, 107, 222, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-blue)', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Par application ({displayedYear})
                </div>
                {Object.keys(incidentsByApp).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {Object.entries(incidentsByApp)
                      .sort(([, a], [, b]) => b - a)
                      .map(([app, count]) => (
                        <div key={app} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)' }}>{app}</span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: '#D92424',
                              backgroundColor: 'rgba(217, 36, 36, 0.15)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '10px',
                            }}
                          >
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)', fontStyle: 'italic' }}>
                    Aucun incident enregistré
                  </div>
                )}
              </div>
            </div>
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

            {/* Periods Section */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  Occurence *
                </label>
                <button
                  type="button"
                  onClick={addPeriod}
                  style={{
                    padding: '0.25rem 0.6rem',
                    backgroundColor: 'var(--color-secondary-blue)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
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
                  + Ajouter une période
                </button>
              </div>

              {periods.map((period, index) => (
                <div
                  key={period.id}
                  style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(176, 191, 240, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(176, 191, 240, 0.3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                      {getOrdinalLabel(index)}
                    </span>
                    {periods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePeriod(period.id)}
                        style={{
                          width: '22px',
                          height: '22px',
                          backgroundColor: 'transparent',
                          color: 'rgba(217, 36, 36, 0.6)',
                          border: '1px solid rgba(217, 36, 36, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(217, 36, 36, 0.1)';
                          e.currentTarget.style.color = 'var(--color-accent-red)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgba(217, 36, 36, 0.6)';
                        }}
                        title="Supprimer cette période"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Date fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.7rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: '500',
                        }}
                      >
                        Date de début *
                      </label>
                      <input
                        type="date"
                        value={period.startDate}
                        onChange={(e) => updatePeriod(period.id, 'startDate', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '2px solid var(--color-neutral-beige)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.7rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: '500',
                        }}
                      >
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        value={period.endDate}
                        onChange={(e) => updatePeriod(period.id, 'endDate', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '2px solid var(--color-neutral-beige)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Time fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.7rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: '500',
                        }}
                      >
                        Heure de début
                      </label>
                      <input
                        type="time"
                        value={period.startTime || ''}
                        onChange={(e) => updatePeriod(period.id, 'startTime', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '2px solid var(--color-neutral-beige)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.7rem',
                          color: 'var(--color-primary-dark)',
                          fontWeight: '500',
                        }}
                      >
                        Heure de fin
                      </label>
                      <input
                        type="time"
                        value={period.endTime || ''}
                        onChange={(e) => updatePeriod(period.id, 'endTime', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '2px solid var(--color-neutral-beige)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                Changement en cause
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
                Changement en cause - URL
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

            {/* Parent Incident */}
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
                Incident parent
              </label>
              <input
                type="text"
                value={parentIncident}
                onChange={(e) => setParentIncident(e.target.value)}
                placeholder="Ex: INC0012345"
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
                Incident parent - URL
              </label>
              <input
                type="url"
                value={parentIncidentUrl}
                onChange={(e) => setParentIncidentUrl(e.target.value)}
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

      {/* Long Period Modal */}
      {isLongPeriodModalOpen && (
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
            setIsLongPeriodModalOpen(false);
            resetLongPeriodForm();
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '500px',
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
              {editingLongPeriod ? 'Modifier la période' : 'Nouvelle période longue'}
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
                value={longPeriodTitle}
                onChange={(e) => setLongPeriodTitle(e.target.value)}
                placeholder="Ex: Gel développement, Période de maintenance"
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

            {/* Date fields */}
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
                  value={longPeriodStartDate}
                  onChange={(e) => setLongPeriodStartDate(e.target.value)}
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
                  value={longPeriodEndDate}
                  onChange={(e) => setLongPeriodEndDate(e.target.value)}
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

            {/* Color picker */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Couleur *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setLongPeriodColor(color)}
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: color,
                      border: longPeriodColor === color ? '3px solid var(--color-secondary-blue)' : '2px solid rgba(230, 225, 219, 0.8)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                    title={color}
                  >
                    {longPeriodColor === color && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '1.2rem',
                          color: 'var(--color-secondary-blue)',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Manage existing long periods */}
            {isAuthenticated && longPeriods.length > 0 && !editingLongPeriod && (
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  Périodes existantes
                </label>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(230, 225, 219, 0.5)', borderRadius: '4px', padding: '0.5rem' }}>
                  {longPeriods.map((period) => (
                    <div
                      key={period.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        marginBottom: '0.25rem',
                        backgroundColor: period.color,
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                          {period.title}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-primary-blue)' }}>
                          {new Date(period.startDate).toLocaleDateString('fr-FR')} - {new Date(period.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => {
                            setIsLongPeriodModalOpen(false);
                            handleEditLongPeriod(period);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#6B7280',
                            color: 'var(--color-white)',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.65rem',
                            fontWeight: '500',
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteLongPeriod(period.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#D92424',
                            color: 'var(--color-white)',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.65rem',
                            fontWeight: '500',
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsLongPeriodModalOpen(false);
                  resetLongPeriodForm();
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
                onClick={handleSaveLongPeriod}
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
                {editingLongPeriod ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
