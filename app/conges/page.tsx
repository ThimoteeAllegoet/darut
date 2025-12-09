'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLeaves } from '../hooks/useLeaves';
import { useNotableEvents } from '../hooks/useNotableEvents';
import { LeaveType, PeriodType, TeamMember } from '../types/leaves';
import { RecurrenceConfig, RecurrenceType, DayOfWeek, WeekOfMonth } from '../types/recurrence';

const leaveTypes: LeaveType[] = ['Télétravail', 'Congés', 'Formation', 'Déplacement', 'Absence', 'Temps partiel'];

const leaveTypeColors: Record<LeaveType, string> = {
  'Télétravail': '#6b7280',
  'Congés': '#22c55e',
  'Formation': '#8b5cf6',
  'Déplacement': '#a855f7',
  'Absence': '#ef4444',
  'Temps partiel': '#06b6d4',
};

// Function to darken a color for comment indicator
const darkenColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const darkenFactor = 0.6; // Darken by 40%
  const newR = Math.floor(r * darkenFactor);
  const newG = Math.floor(g * darkenFactor);
  const newB = Math.floor(b * darkenFactor);

  return `rgb(${newR}, ${newG}, ${newB})`;
};

export default function CongesPage() {
  const { isAuthenticated } = useAuth();
  const {
    leaves,
    members,
    addLeave,
    addMultipleLeaves,
    deleteLeave,
    approveLeave,
    rejectLeave,
    requestDeletion,
    approveDeletion,
    rejectDeletion,
    addMember,
    updateMember,
    deleteMember,
    getPendingLeaves,
    getLeavesByDate,
  } = useLeaves();

  const {
    notableEvents,
    addEvent: addNotableEvent,
    updateEvent: updateNotableEvent,
    deleteEvent: deleteNotableEvent,
    getEventsByDate,
  } = useNotableEvents();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMemberFilter, setCalendarMemberFilter] = useState<string>('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; comment: string | null }>({ x: 0, y: 0, comment: null });
  const [showEditLeaveModal, setShowEditLeaveModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState<any | null>(null);

  // Notable event modal state
  const [showNotableEventModal, setShowNotableEventModal] = useState(false);
  const [notableEventTitle, setNotableEventTitle] = useState('');
  const [notableEventDate, setNotableEventDate] = useState('');
  const [notableEventDescription, setNotableEventDescription] = useState('');
  const [editingNotableEvent, setEditingNotableEvent] = useState<any | null>(null);

  // Member form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberIsValidator, setMemberIsValidator] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Leave form - modified for period selection
  const [modalSelectedMember, setModalSelectedMember] = useState<string>('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Congés');
  const [leavePeriod, setLeavePeriod] = useState<PeriodType | 'periode'>('journée');
  const [leaveComment, setLeaveComment] = useState('');

  // Recurrence states for leaves
  const [leaveRecurrenceType, setLeaveRecurrenceType] = useState<RecurrenceType>('none');
  const [leaveRecurrenceDays, setLeaveRecurrenceDays] = useState<DayOfWeek[]>([]);
  const [leaveRecurrenceDayOfMonth, setLeaveRecurrenceDayOfMonth] = useState<number>(1);
  const [leaveRecurrenceWeekOfMonth, setLeaveRecurrenceWeekOfMonth] = useState<WeekOfMonth>(1);
  const [leaveRecurrenceDayOfWeek, setLeaveRecurrenceDayOfWeek] = useState<DayOfWeek>(1);
  const [leaveRecurrenceEndDate, setLeaveRecurrenceEndDate] = useState('');

  // Recurrence states for notable events
  const [eventRecurrenceType, setEventRecurrenceType] = useState<RecurrenceType>('none');
  const [eventRecurrenceDays, setEventRecurrenceDays] = useState<DayOfWeek[]>([]);
  const [eventRecurrenceDayOfMonth, setEventRecurrenceDayOfMonth] = useState<number>(1);
  const [eventRecurrenceWeekOfMonth, setEventRecurrenceWeekOfMonth] = useState<WeekOfMonth>(1);
  const [eventRecurrenceDayOfWeek, setEventRecurrenceDayOfWeek] = useState<DayOfWeek>(1);
  const [eventRecurrenceEndDate, setEventRecurrenceEndDate] = useState('');

  if (!isAuthenticated) {
    return null;
  }

  const pendingLeaves = getPendingLeaves();

  // French holidays 2024-2026 with names
  const frenchHolidays: Record<string, string> = {
    // 2024
    '2024-01-01': 'Jour de l\'an',
    '2024-04-01': 'Lundi de Pâques',
    '2024-05-01': 'Fête du Travail',
    '2024-05-08': 'Victoire 1945',
    '2024-05-09': 'Ascension',
    '2024-05-20': 'Lundi de Pentecôte',
    '2024-07-14': 'Fête nationale',
    '2024-08-15': 'Assomption',
    '2024-11-01': 'Toussaint',
    '2024-11-11': 'Armistice 1918',
    '2024-12-25': 'Noël',
    // 2025
    '2025-01-01': 'Jour de l\'an',
    '2025-04-21': 'Lundi de Pâques',
    '2025-05-01': 'Fête du Travail',
    '2025-05-08': 'Victoire 1945',
    '2025-05-29': 'Ascension',
    '2025-06-09': 'Lundi de Pentecôte',
    '2025-07-14': 'Fête nationale',
    '2025-08-15': 'Assomption',
    '2025-11-01': 'Toussaint',
    '2025-11-11': 'Armistice 1918',
    '2025-12-25': 'Noël',
    // 2026
    '2026-01-01': 'Jour de l\'an',
    '2026-04-06': 'Lundi de Pâques',
    '2026-05-01': 'Fête du Travail',
    '2026-05-08': 'Victoire 1945',
    '2026-05-14': 'Ascension',
    '2026-05-25': 'Lundi de Pentecôte',
    '2026-07-14': 'Fête nationale',
    '2026-08-15': 'Assomption',
    '2026-11-01': 'Toussaint',
    '2026-11-11': 'Armistice 1918',
    '2026-12-25': 'Noël',
  };

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  // Adjust to Monday-based week (0 = Sunday becomes 6, 1 = Monday becomes 0)
  const startingDayOfWeekMonday = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddNotableEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notableEventTitle || !notableEventDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingNotableEvent) {
      updateNotableEvent(editingNotableEvent.id, {
        title: notableEventTitle,
        date: notableEventDate,
        description: notableEventDescription,
      });
    } else {
      // Build recurrence config
      let recurrence: RecurrenceConfig | undefined;
      if (eventRecurrenceType !== 'none') {
        recurrence = {
          type: eventRecurrenceType,
          daysOfWeek: eventRecurrenceType === 'weekly' || eventRecurrenceType === 'biweekly' ? eventRecurrenceDays : undefined,
          dayOfMonth: eventRecurrenceType === 'monthly_day' ? eventRecurrenceDayOfMonth : undefined,
          weekOfMonth: eventRecurrenceType === 'monthly_weekday' ? eventRecurrenceWeekOfMonth : undefined,
          dayOfWeek: eventRecurrenceType === 'monthly_weekday' ? eventRecurrenceDayOfWeek : undefined,
          endDate: eventRecurrenceEndDate || undefined,
        };
      }

      addNotableEvent(notableEventTitle, notableEventDate, notableEventDescription, undefined, recurrence);
    }

    setNotableEventTitle('');
    setNotableEventDate('');
    setNotableEventDescription('');
    setEventRecurrenceType('none');
    setEventRecurrenceDays([]);
    setEventRecurrenceDayOfMonth(1);
    setEventRecurrenceWeekOfMonth(1);
    setEventRecurrenceDayOfWeek(1);
    setEventRecurrenceEndDate('');
    setEditingNotableEvent(null);
    setShowNotableEventModal(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        name: memberName,
        email: memberEmail,
        isValidator: memberIsValidator,
      });
    } else {
      addMember({
        name: memberName,
        email: memberEmail,
        isValidator: memberIsValidator,
      });
    }

    setMemberName('');
    setMemberEmail('');
    setMemberIsValidator(false);
    setEditingMember(null);
    setShowMemberModal(false);
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSelectedMember || !leaveStartDate) {
      alert('Veuillez sélectionner un membre et une date de début');
      return;
    }

    // Check if periode mode and end date is required
    if (leavePeriod === 'periode' && !leaveEndDate) {
      alert('Veuillez sélectionner une date de fin pour la période');
      return;
    }

    // Build recurrence config
    let recurrence: RecurrenceConfig | undefined;
    if (leaveRecurrenceType !== 'none') {
      recurrence = {
        type: leaveRecurrenceType,
        daysOfWeek: leaveRecurrenceType === 'weekly' || leaveRecurrenceType === 'biweekly' ? leaveRecurrenceDays : undefined,
        dayOfMonth: leaveRecurrenceType === 'monthly_day' ? leaveRecurrenceDayOfMonth : undefined,
        weekOfMonth: leaveRecurrenceType === 'monthly_weekday' ? leaveRecurrenceWeekOfMonth : undefined,
        dayOfWeek: leaveRecurrenceType === 'monthly_weekday' ? leaveRecurrenceDayOfWeek : undefined,
        endDate: leaveRecurrenceEndDate || undefined,
      };
    }

    // If periode mode, add multiple days
    if (leavePeriod === 'periode') {
      const endDate = leaveEndDate || leaveStartDate;

      // Parse dates manually to avoid timezone issues
      const [startYear, startMonth, startDay] = leaveStartDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

      // Create Date objects at noon to avoid timezone issues
      const currentDate = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);
      const finalDate = new Date(endYear, endMonth - 1, endDay, 12, 0, 0);

      // Generate all dates in the range
      const dates: string[] = [];
      while (currentDate <= finalDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        dates.push(dateStr);

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Add all leaves at once
      addMultipleLeaves(modalSelectedMember, leaveType, dates, 'journée', leaveComment);
    } else {
      // Single day with specific period
      addLeave(modalSelectedMember, leaveType, leaveStartDate, leavePeriod, leaveComment, recurrence);
    }

    setModalSelectedMember('');
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveType('Congés');
    setLeavePeriod('journée');
    setLeaveComment('');
    setLeaveRecurrenceType('none');
    setLeaveRecurrenceDays([]);
    setLeaveRecurrenceDayOfMonth(1);
    setLeaveRecurrenceWeekOfMonth(1);
    setLeaveRecurrenceDayOfWeek(1);
    setLeaveRecurrenceEndDate('');
    setShowLeaveModal(false);
  };

  const openMemberModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setMemberName(member.name);
      setMemberEmail(member.email);
      setMemberIsValidator(member.isValidator);
    } else {
      setEditingMember(null);
      setMemberName('');
      setMemberEmail('');
      setMemberIsValidator(false);
    }
    setShowMemberModal(true);
  };

  // Generate calendar days (Monday-based)
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeekMonday; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
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
          Calendrier interne
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowMemberModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary-dark)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            + Ajouter un membre
          </button>
          <button
            onClick={() => setShowLeaveModal(true)}
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
            + Ajouter une absence
          </button>
          <button
            onClick={() => setShowNotableEventModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
            }}
          >
            + Événement notable
          </button>
          {pendingLeaves.length > 0 && (
            <button
              onClick={() => setShowPendingModal(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-accent-red)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                notifications
              </span>
              {pendingLeaves.length} en attente
            </button>
          )}
        </div>
      </div>

      {/* Member filter */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
          Afficher :
        </label>
        <select
          value={calendarMemberFilter}
          onChange={(e) => setCalendarMemberFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            border: '1px solid rgba(230, 225, 219, 0.5)',
            borderRadius: '6px',
            outline: 'none',
            backgroundColor: 'var(--color-white)',
            cursor: 'pointer',
            flex: '1 1 200px',
          }}
        >
          <option value="">Tous les membres</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={previousMonth}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-light-blue)',
              color: 'var(--color-secondary-blue)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            ← Précédent
          </button>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-primary-dark)',
              textTransform: 'capitalize',
              margin: 0,
            }}
          >
            {monthName}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={goToToday}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Aujourd'hui
            </button>
            <button
              onClick={nextMonth}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-light-blue)',
                color: 'var(--color-secondary-blue)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
          }}
        >
          {/* Day headers (Monday-Sunday) */}
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
            <div
              key={day}
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: index >= 5 ? 'rgba(40, 50, 118, 0.4)' : 'var(--color-primary-blue)',
              }}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Check if weekend or holiday
            const currentDayOfWeek = new Date(year, month, day).getDay();
            const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6; // Saturday or Sunday
            const holidayName = frenchHolidays[dateStr];
            const isHoliday = !!holidayName;
            const isGrayedOut = isWeekend || isHoliday;

            const allDayLeaves = getLeavesByDate(dateStr).filter(
              (leave) => !calendarMemberFilter || leave.memberId === calendarMemberFilter
            );

            // Separate leaves by period and sort alphabetically by member name
            const morningLeaves = allDayLeaves.filter(l => l.period === 'matin').sort((a, b) => a.memberName.localeCompare(b.memberName));
            const afternoonLeaves = allDayLeaves.filter(l => l.period === 'après-midi').sort((a, b) => a.memberName.localeCompare(b.memberName));
            let fullDayLeaves = allDayLeaves.filter(l => l.period === 'journée').sort((a, b) => a.memberName.localeCompare(b.memberName));

            // Detect agents with both morning AND afternoon - treat as full day
            const mergedFullDays: typeof fullDayLeaves = [];
            const morningOnlyLeaves: typeof morningLeaves = [];
            const afternoonOnlyLeaves: typeof afternoonLeaves = [];

            morningLeaves.forEach(morning => {
              const afternoon = afternoonLeaves.find(a => a.memberId === morning.memberId);
              // Merge only if same type AND same status
              if (afternoon && morning.type === afternoon.type && morning.status === afternoon.status) {
                // Same agent has both periods with same type and status - merge into full day
                mergedFullDays.push({
                  ...morning,
                  period: 'journée' as PeriodType,
                  comment: morning.comment || afternoon.comment, // Keep any comment from either
                });
              } else {
                morningOnlyLeaves.push(morning);
              }
            });

            afternoonLeaves.forEach(afternoon => {
              const morning = morningLeaves.find(m => m.memberId === afternoon.memberId);
              // Only add if NOT already merged (i.e., no matching morning, different type, or different status)
              if (!morning || morning.type !== afternoon.type || morning.status !== afternoon.status) {
                afternoonOnlyLeaves.push(afternoon);
              }
            });

            // Combine original full days with merged ones and sort
            fullDayLeaves = [...fullDayLeaves, ...mergedFullDays].sort((a, b) => a.memberName.localeCompare(b.memberName));

            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={day}
                style={{
                  minHeight: '100px',
                  backgroundColor: isGrayedOut
                    ? '#dadada'
                    : isToday
                      ? 'rgba(64, 107, 222, 0.1)'
                      : 'var(--color-off-white-1)',
                  borderRadius: '6px',
                  border: isToday ? '2px solid var(--color-secondary-blue)' : 'none',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Day number */}
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    padding: '0.4rem 0.5rem 0.3rem 0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>{day}</span>
                  {holidayName && (
                    <span style={{ fontSize: '0.65rem', fontWeight: '500', color: 'rgba(40, 50, 118, 0.7)' }}>
                      {holidayName}
                    </span>
                  )}
                </div>

                {/* Notable events */}
                {getEventsByDate(dateStr).map((event) => (
                  <div
                    key={event.id}
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.3rem 0.5rem',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '3px',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      marginBottom: '0.2rem',
                      marginLeft: '0.3rem',
                      marginRight: '0.3rem',
                      border: '1px solid #fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                    }}
                    onClick={() => {
                      setEditingNotableEvent(event);
                      setNotableEventTitle(event.title);
                      setNotableEventDate(event.date);
                      setNotableEventDescription(event.description || '');
                      setShowNotableEventModal(true);
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>info</span>
                    <span>{event.title}</span>
                  </div>
                ))}

                {/* Leaves container with alignment */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    padding: '0.3rem',
                  }}
                >
                  {/* Full day leaves (spanning both periods) */}
                  {fullDayLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.2rem 0.4rem',
                        backgroundColor: leaveTypeColors[leave.type],
                        color: 'white',
                        borderRadius: '3px',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        opacity: isGrayedOut ? 0.5 : (leave.status === 'pending' || leave.status === 'deletion_pending' ? 0.5 : 1),
                        border: leave.status === 'pending' || leave.status === 'deletion_pending' ? '1px dashed white' : 'none',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setEditingLeave(leave);
                        setShowEditLeaveModal(true);
                      }}
                    >
                      {leave.memberName.split(' ')[0]}
                      {leave.comment && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '0',
                            height: '0',
                            borderLeft: '12px solid transparent',
                            borderBottom: `12px solid ${darkenColor(leaveTypeColors[leave.type])}`,
                            borderBottomRightRadius: '3px',
                            cursor: 'help',
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setTooltip({ x: e.clientX, y: e.clientY, comment: leave.comment || '' });
                          }}
                          onMouseMove={(e) => {
                            e.stopPropagation();
                            setTooltip({ x: e.clientX, y: e.clientY, comment: leave.comment || '' });
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setTooltip({ x: 0, y: 0, comment: null });
                          }}
                        />
                      )}
                    </div>
                  ))}

                  {/* Half-day leaves - one row per user */}
                  {(() => {
                    // Group half-day leaves by member
                    const memberIds = new Set([
                      ...morningOnlyLeaves.map(l => l.memberId),
                      ...afternoonOnlyLeaves.map(l => l.memberId)
                    ]);

                    // Sort member IDs alphabetically by member name
                    const sortedMemberIds = Array.from(memberIds).sort((a, b) => {
                      const memberA = members.find(m => m.id === a);
                      const memberB = members.find(m => m.id === b);
                      return (memberA?.name || '').localeCompare(memberB?.name || '');
                    });

                    return sortedMemberIds.map(memberId => {
                      const morning = morningOnlyLeaves.find(l => l.memberId === memberId);
                      const afternoon = afternoonOnlyLeaves.find(l => l.memberId === memberId);

                      return (
                        <div
                          key={memberId}
                          style={{
                            display: 'flex',
                            gap: '0px',
                            alignItems: 'flex-start',
                          }}
                        >
                          {/* Morning period (left) */}
                          <div
                            style={{
                              flex: 1,
                              borderRight: '2px solid rgba(40, 50, 118, 0.25)',
                              paddingRight: '0.25rem',
                            }}
                          >
                            {morning && (
                              <div
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.2rem 0.4rem',
                                  backgroundColor: leaveTypeColors[morning.type],
                                  color: 'white',
                                  borderRadius: '3px',
                                  fontWeight: '600',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  opacity: isGrayedOut ? 0.5 : (morning.status === 'pending' || morning.status === 'deletion_pending' ? 0.5 : 1),
                                  border: morning.status === 'pending' || morning.status === 'deletion_pending' ? '1px dashed white' : 'none',
                                  position: 'relative',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setEditingLeave(morning);
                                  setShowEditLeaveModal(true);
                                }}
                              >
                                {morning.memberName.split(' ')[0]}
                                {morning.comment && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '0',
                                      right: '0',
                                      width: '0',
                                      height: '0',
                                      borderLeft: '12px solid transparent',
                                      borderBottom: `12px solid ${darkenColor(leaveTypeColors[morning.type])}`,
                                      borderBottomRightRadius: '3px',
                                      cursor: 'help',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: e.clientX, y: e.clientY, comment: morning.comment || '' });
                                    }}
                                    onMouseMove={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: e.clientX, y: e.clientY, comment: morning.comment || '' });
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: 0, y: 0, comment: null });
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Afternoon period (right) */}
                          <div
                            style={{
                              flex: 1,
                              paddingLeft: '0.25rem',
                              borderLeft: !morning ? '2px solid rgba(40, 50, 118, 0.25)' : 'none',
                            }}
                          >
                            {afternoon && (
                              <div
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.2rem 0.4rem',
                                  backgroundColor: leaveTypeColors[afternoon.type],
                                  color: 'white',
                                  borderRadius: '3px',
                                  fontWeight: '600',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  opacity: isGrayedOut ? 0.5 : (afternoon.status === 'pending' || afternoon.status === 'deletion_pending' ? 0.5 : 1),
                                  border: afternoon.status === 'pending' || afternoon.status === 'deletion_pending' ? '1px dashed white' : 'none',
                                  position: 'relative',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setEditingLeave(afternoon);
                                  setShowEditLeaveModal(true);
                                }}
                              >
                                {afternoon.memberName.split(' ')[0]}
                                {afternoon.comment && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '0',
                                      right: '0',
                                      width: '0',
                                      height: '0',
                                      borderLeft: '12px solid transparent',
                                      borderBottom: `12px solid ${darkenColor(leaveTypeColors[afternoon.type])}`,
                                      borderBottomRightRadius: '3px',
                                      cursor: 'help',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: e.clientX, y: e.clientY, comment: afternoon.comment || '' });
                                    }}
                                    onMouseMove={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: e.clientX, y: e.clientY, comment: afternoon.comment || '' });
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      setTooltip({ x: 0, y: 0, comment: null });
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            marginBottom: '0.75rem',
          }}
        >
          Légende
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          {leaveTypes.map((type) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: leaveTypeColors[type],
                  borderRadius: '3px',
                }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>{type}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-blue)' }}>
          <div><strong>Événements notables</strong> : Événements partagés (repas, réunions, etc.) affichés en jaune - Cliquer pour modifier ou supprimer</div>
          <div style={{ marginTop: '0.25rem' }}><strong>En attente</strong> : Demande de congés non encore validée (affichée avec opacité réduite et bordure pointillée)</div>
          <div style={{ marginTop: '0.25rem' }}><strong>Suppression en attente</strong> : Demande de suppression d'un congé validé (affichée avec opacité réduite et bordure pointillée)</div>
          <div style={{ marginTop: '0.25rem' }}><strong>Périodes</strong> : Les cases sont divisées verticalement (gauche = matin, droite = après-midi)</div>
        </div>
      </div>

      {/* Team members list */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            marginBottom: '1rem',
          }}
        >
          Membres de l'équipe
        </h3>
        {members.length === 0 ? (
          <p style={{ color: 'var(--color-primary-blue)', fontSize: '0.9rem' }}>
            Aucun membre. Ajoutez des membres pour commencer.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-off-white-1)',
                  borderRadius: '6px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                    {member.name}
                    {member.isValidator && (
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'var(--color-secondary-blue)',
                          color: 'white',
                          borderRadius: '3px',
                        }}
                      >
                        Validateur
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-blue)' }}>{member.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openMemberModal(member)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'var(--color-secondary-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer ${member.name} et toutes ses absences ?`)) {
                        deleteMember(member.id);
                      }
                    }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'var(--color-accent-red)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowMemberModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                marginBottom: '1.5rem',
              }}
            >
              {editingMember ? 'Modifier le membre' : 'Ajouter un membre'}
            </h2>
            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Nom *
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={memberIsValidator}
                    onChange={(e) => setMemberIsValidator(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                    Ce membre peut valider les demandes de congés
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberModal(false);
                    setEditingMember(null);
                  }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-primary-blue)',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: 'var(--color-primary-dark)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  {editingMember ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                marginBottom: '1.5rem',
              }}
            >
              Ajouter une absence
            </h2>
            <form onSubmit={handleAddLeave}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Membre *
                </label>
                <select
                  value={modalSelectedMember}
                  onChange={(e) => setModalSelectedMember(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: 'var(--color-white)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Type *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: 'var(--color-white)',
                    cursor: 'pointer',
                  }}
                >
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Période *
                </label>
                <select
                  value={leavePeriod}
                  onChange={(e) => {
                    setLeavePeriod(e.target.value as PeriodType | 'periode');
                    // Reset dates when changing period type
                    if (e.target.value !== 'periode') {
                      setLeaveEndDate('');
                    }
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: 'var(--color-white)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="journée">Journée</option>
                  <option value="matin">Matinée</option>
                  <option value="après-midi">Après-midi</option>
                  <option value="periode">Période (plusieurs jours)</option>
                </select>
              </div>

              {/* Recurrence section - only for single day periods */}
              {leavePeriod !== 'periode' && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(64, 107, 222, 0.05)', borderRadius: '6px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Périodicité
                  </label>
                  <select
                    value={leaveRecurrenceType}
                    onChange={(e) => setLeaveRecurrenceType(e.target.value as RecurrenceType)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      border: '1px solid rgba(230, 225, 219, 0.5)',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: 'var(--color-white)',
                      cursor: 'pointer',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <option value="none">Aucune (une seule fois)</option>
                    <option value="daily">Tous les jours</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="biweekly">Bimensuel</option>
                    <option value="monthly_day">Mensuel (jour fixe)</option>
                    <option value="monthly_weekday">Mensuel (jour de semaine)</option>
                  </select>

                  {/* Weekly/Biweekly: Select days of week */}
                  {(leaveRecurrenceType === 'weekly' || leaveRecurrenceType === 'biweekly') && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Jours de la semaine :
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[
                          { value: 1, label: 'Lun' },
                          { value: 2, label: 'Mar' },
                          { value: 3, label: 'Mer' },
                          { value: 4, label: 'Jeu' },
                          { value: 5, label: 'Ven' },
                          { value: 6, label: 'Sam' },
                          { value: 0, label: 'Dim' },
                        ].map((day) => (
                          <label
                            key={day.value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.4rem 0.6rem',
                              backgroundColor: leaveRecurrenceDays.includes(day.value as DayOfWeek)
                                ? 'var(--color-secondary-blue)'
                                : 'var(--color-white)',
                              color: leaveRecurrenceDays.includes(day.value as DayOfWeek)
                                ? 'white'
                                : 'var(--color-primary-dark)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              border: '1px solid rgba(230, 225, 219, 0.5)',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={leaveRecurrenceDays.includes(day.value as DayOfWeek)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setLeaveRecurrenceDays([...leaveRecurrenceDays, day.value as DayOfWeek]);
                                } else {
                                  setLeaveRecurrenceDays(leaveRecurrenceDays.filter((d) => d !== day.value));
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            {day.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly (day): Select day of month */}
                  {leaveRecurrenceType === 'monthly_day' && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Jour du mois :
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={leaveRecurrenceDayOfMonth}
                        onChange={(e) => setLeaveRecurrenceDayOfMonth(parseInt(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          border: '1px solid rgba(230, 225, 219, 0.5)',
                          borderRadius: '6px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* Monthly (weekday): Select week and day */}
                  {leaveRecurrenceType === 'monthly_weekday' && (
                    <>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                          Semaine du mois :
                        </label>
                        <select
                          value={leaveRecurrenceWeekOfMonth}
                          onChange={(e) => setLeaveRecurrenceWeekOfMonth(parseInt(e.target.value) as WeekOfMonth)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.95rem',
                            border: '1px solid rgba(230, 225, 219, 0.5)',
                            borderRadius: '6px',
                            outline: 'none',
                            backgroundColor: 'var(--color-white)',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="1">Premier</option>
                          <option value="2">Deuxième</option>
                          <option value="3">Troisième</option>
                          <option value="4">Quatrième</option>
                          <option value="5">Cinquième</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                          Jour de la semaine :
                        </label>
                        <select
                          value={leaveRecurrenceDayOfWeek}
                          onChange={(e) => setLeaveRecurrenceDayOfWeek(parseInt(e.target.value) as DayOfWeek)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.95rem',
                            border: '1px solid rgba(230, 225, 219, 0.5)',
                            borderRadius: '6px',
                            outline: 'none',
                            backgroundColor: 'var(--color-white)',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="1">Lundi</option>
                          <option value="2">Mardi</option>
                          <option value="3">Mercredi</option>
                          <option value="4">Jeudi</option>
                          <option value="5">Vendredi</option>
                          <option value="6">Samedi</option>
                          <option value="0">Dimanche</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* End date for recurrence */}
                  {leaveRecurrenceType !== 'none' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Date de fin de la récurrence (optionnel, 2 ans par défaut) :
                      </label>
                      <input
                        type="date"
                        value={leaveRecurrenceEndDate}
                        onChange={(e) => setLeaveRecurrenceEndDate(e.target.value)}
                        min={leaveStartDate}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          border: '1px solid rgba(230, 225, 219, 0.5)',
                          borderRadius: '6px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {leavePeriod === 'periode'
                    ? 'Date de début *'
                    : leaveRecurrenceType !== 'none'
                      ? 'Date de début de la récurrence *'
                      : 'Date *'}
                </label>
                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
              {leavePeriod === 'periode' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    min={leaveStartDate}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      border: '1px solid rgba(230, 225, 219, 0.5)',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={leaveComment}
                  onChange={(e) => setLeaveComment(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              {leaveType === 'Congés' && (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  <strong>Note :</strong> Les demandes de congés doivent être validées par un validateur.
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-primary-blue)',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: 'var(--color-secondary-blue)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Leaves Modal */}
      {showPendingModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowPendingModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                marginBottom: '1.5rem',
              }}
            >
              Demandes en attente ({pendingLeaves.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingLeaves.map((leave) => {
                const isDeletionRequest = leave.status === 'deletion_pending';
                return (
                  <div
                    key={leave.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: isDeletionRequest ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-off-white-1)',
                      borderRadius: '6px',
                      border: isDeletionRequest ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(230, 225, 219, 0.5)',
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isDeletionRequest && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: 'var(--color-accent-red)',
                            color: 'white',
                            borderRadius: '3px',
                            fontWeight: '600',
                          }}
                        >
                          SUPPRESSION
                        </span>
                      )}
                      <strong style={{ color: 'var(--color-primary-dark)' }}>{leave.memberName}</strong>
                      <span style={{ marginLeft: '0.5rem', color: 'var(--color-primary-blue)', fontSize: '0.9rem' }}>
                        {new Date(leave.date).toLocaleDateString('fr-FR')} - {leave.period === 'journée' ? 'Journée' : leave.period === 'matin' ? 'Matin' : 'Après-midi'}
                      </span>
                    </div>
                    {leave.comment && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', marginBottom: '0.75rem' }}>
                        {leave.comment}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isDeletionRequest ? (
                        <>
                          <button
                            onClick={() => {
                              if (confirm('Approuver la suppression de ce congé ?')) {
                                approveDeletion(leave.id);
                                if (pendingLeaves.length === 1) {
                                  setShowPendingModal(false);
                                }
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                            }}
                          >
                            Approuver la suppression
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Refuser la suppression ? Le congé sera conservé.')) {
                                rejectDeletion(leave.id);
                                if (pendingLeaves.length === 1) {
                                  setShowPendingModal(false);
                                }
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--color-accent-red)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                            }}
                          >
                            Refuser la suppression
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              approveLeave(leave.id);
                              if (pendingLeaves.length === 1) {
                                setShowPendingModal(false);
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                            }}
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => {
                              const comment = prompt('Raison du refus (optionnel) :');
                              rejectLeave(leave.id, comment || undefined);
                              if (pendingLeaves.length === 1) {
                                setShowPendingModal(false);
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--color-accent-red)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                            }}
                          >
                            Refuser
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Supprimer cette demande ?')) {
                                deleteLeave(leave.id);
                                if (pendingLeaves.length === 1) {
                                  setShowPendingModal(false);
                                }
                              }
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--color-primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                            }}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setShowPendingModal(false)}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--color-white)',
                  color: 'var(--color-primary-blue)',
                  border: '1px solid rgba(230, 225, 219, 0.5)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Delete Leave Modal */}
      {showEditLeaveModal && editingLeave && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => {
            setShowEditLeaveModal(false);
            setEditingLeave(null);
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                marginBottom: '1rem',
              }}
            >
              Gérer l'absence
            </h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-primary-blue)', marginBottom: '0.5rem' }}>
                <strong>{editingLeave.memberName}</strong> - {editingLeave.type}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>
                {new Date(editingLeave.date).toLocaleDateString('fr-FR')} - {editingLeave.period === 'journée' ? 'Journée' : editingLeave.period === 'matin' ? 'Matin' : 'Après-midi'}
              </p>
              {editingLeave.comment && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Commentaire : {editingLeave.comment}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditLeaveModal(false);
                  setEditingLeave(null);
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--color-white)',
                  color: 'var(--color-primary-blue)',
                  border: '1px solid rgba(230, 225, 219, 0.5)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const message = editingLeave.type === 'Congés' && editingLeave.status === 'approved'
                    ? `Demander la suppression de ce congé validé ?\n\nLa demande devra être approuvée par un validateur.`
                    : `Supprimer cette absence ?`;

                  if (confirm(message)) {
                    requestDeletion(editingLeave.id);
                    setShowEditLeaveModal(false);
                    setEditingLeave(null);
                  }
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--color-accent-red)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notable Event Modal */}
      {showNotableEventModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowNotableEventModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                marginBottom: '1.5rem',
              }}
            >
              {editingNotableEvent ? 'Modifier l\'événement' : 'Ajouter un événement notable'}
            </h2>
            <form onSubmit={handleAddNotableEvent}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Titre *
                </label>
                <input
                  type="text"
                  value={notableEventTitle}
                  onChange={(e) => setNotableEventTitle(e.target.value)}
                  placeholder="Ex: Repas de service"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  value={notableEventDate}
                  onChange={(e) => setNotableEventDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Recurrence section - only when adding new event */}
              {!editingNotableEvent && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Périodicité
                  </label>
                  <select
                    value={eventRecurrenceType}
                    onChange={(e) => setEventRecurrenceType(e.target.value as RecurrenceType)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      border: '1px solid rgba(230, 225, 219, 0.5)',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: 'var(--color-white)',
                      cursor: 'pointer',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <option value="none">Aucune (une seule fois)</option>
                    <option value="daily">Tous les jours</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="biweekly">Bimensuel</option>
                    <option value="monthly_day">Mensuel (jour fixe)</option>
                    <option value="monthly_weekday">Mensuel (jour de semaine)</option>
                  </select>

                  {/* Weekly/Biweekly: Select days of week */}
                  {(eventRecurrenceType === 'weekly' || eventRecurrenceType === 'biweekly') && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Jours de la semaine :
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[
                          { value: 1, label: 'Lun' },
                          { value: 2, label: 'Mar' },
                          { value: 3, label: 'Mer' },
                          { value: 4, label: 'Jeu' },
                          { value: 5, label: 'Ven' },
                          { value: 6, label: 'Sam' },
                          { value: 0, label: 'Dim' },
                        ].map((day) => (
                          <label
                            key={day.value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.4rem 0.6rem',
                              backgroundColor: eventRecurrenceDays.includes(day.value as DayOfWeek)
                                ? '#f59e0b'
                                : 'var(--color-white)',
                              color: eventRecurrenceDays.includes(day.value as DayOfWeek)
                                ? 'white'
                                : 'var(--color-primary-dark)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              border: '1px solid rgba(230, 225, 219, 0.5)',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={eventRecurrenceDays.includes(day.value as DayOfWeek)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEventRecurrenceDays([...eventRecurrenceDays, day.value as DayOfWeek]);
                                } else {
                                  setEventRecurrenceDays(eventRecurrenceDays.filter((d) => d !== day.value));
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            {day.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly (day): Select day of month */}
                  {eventRecurrenceType === 'monthly_day' && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Jour du mois :
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={eventRecurrenceDayOfMonth}
                        onChange={(e) => setEventRecurrenceDayOfMonth(parseInt(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          border: '1px solid rgba(230, 225, 219, 0.5)',
                          borderRadius: '6px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* Monthly (weekday): Select week and day */}
                  {eventRecurrenceType === 'monthly_weekday' && (
                    <>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                          Semaine du mois :
                        </label>
                        <select
                          value={eventRecurrenceWeekOfMonth}
                          onChange={(e) => setEventRecurrenceWeekOfMonth(parseInt(e.target.value) as WeekOfMonth)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.95rem',
                            border: '1px solid rgba(230, 225, 219, 0.5)',
                            borderRadius: '6px',
                            outline: 'none',
                            backgroundColor: 'var(--color-white)',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="1">Premier</option>
                          <option value="2">Deuxième</option>
                          <option value="3">Troisième</option>
                          <option value="4">Quatrième</option>
                          <option value="5">Cinquième</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                          Jour de la semaine :
                        </label>
                        <select
                          value={eventRecurrenceDayOfWeek}
                          onChange={(e) => setEventRecurrenceDayOfWeek(parseInt(e.target.value) as DayOfWeek)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.95rem',
                            border: '1px solid rgba(230, 225, 219, 0.5)',
                            borderRadius: '6px',
                            outline: 'none',
                            backgroundColor: 'var(--color-white)',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="1">Lundi</option>
                          <option value="2">Mardi</option>
                          <option value="3">Mercredi</option>
                          <option value="4">Jeudi</option>
                          <option value="5">Vendredi</option>
                          <option value="6">Samedi</option>
                          <option value="0">Dimanche</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* End date for recurrence */}
                  {eventRecurrenceType !== 'none' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                        Date de fin de la récurrence (optionnel, 2 ans par défaut) :
                      </label>
                      <input
                        type="date"
                        value={eventRecurrenceEndDate}
                        onChange={(e) => setEventRecurrenceEndDate(e.target.value)}
                        min={notableEventDate}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          border: '1px solid rgba(230, 225, 219, 0.5)',
                          borderRadius: '6px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Description (optionnel)
                </label>
                <textarea
                  value={notableEventDescription}
                  onChange={(e) => setNotableEventDescription(e.target.value)}
                  rows={3}
                  placeholder="Informations supplémentaires..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: editingNotableEvent ? 'space-between' : 'flex-end' }}>
                {editingNotableEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Supprimer "${editingNotableEvent.title}" ?`)) {
                        deleteNotableEvent(editingNotableEvent.id);
                        setNotableEventTitle('');
                        setNotableEventDate('');
                        setNotableEventDescription('');
                        setEditingNotableEvent(null);
                        setShowNotableEventModal(false);
                      }
                    }}
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: 'var(--color-accent-red)',
                      color: 'var(--color-white)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                    }}
                  >
                    Supprimer
                  </button>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotableEventModal(false);
                      setNotableEventTitle('');
                      setNotableEventDate('');
                      setNotableEventDescription('');
                      setEditingNotableEvent(null);
                    }}
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: 'var(--color-white)',
                      color: 'var(--color-primary-blue)',
                      border: '1px solid rgba(230, 225, 219, 0.5)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#f59e0b',
                      color: 'var(--color-white)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                    }}
                  >
                    {editingNotableEvent ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tooltip suivant la souris */}
      {tooltip.comment && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            backgroundColor: 'rgba(40, 50, 118, 0.95)',
            color: 'var(--color-white)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            maxWidth: '250px',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.35rem' }}>
            Commentaire
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
            {tooltip.comment}
          </div>
        </div>
      )}
    </div>
  );
}
