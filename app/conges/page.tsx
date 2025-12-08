'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLeaves } from '../hooks/useLeaves';
import { LeaveType, PeriodType, TeamMember } from '../types/leaves';

const leaveTypes: LeaveType[] = ['Télétravail', 'Congés', 'Formation', 'Déplacement', 'Absence'];

const leaveTypeColors: Record<LeaveType, string> = {
  'Télétravail': '#3b82f6',
  'Congés': '#22c55e',
  'Formation': '#f59e0b',
  'Déplacement': '#a855f7',
  'Absence': '#ef4444',
};

export default function CongesPage() {
  const { isAuthenticated } = useAuth();
  const {
    leaves,
    members,
    addLeave,
    deleteLeave,
    approveLeave,
    rejectLeave,
    addMember,
    updateMember,
    deleteMember,
    getPendingLeaves,
    getLeavesByDate,
  } = useLeaves();

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
  const [leavePeriod, setLeavePeriod] = useState<PeriodType>('journée');
  const [leaveComment, setLeaveComment] = useState('');

  if (!isAuthenticated) {
    return null;
  }

  const pendingLeaves = getPendingLeaves();

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

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

    // Helper function to add days to a date string (YYYY-MM-DD)
    const addDaysToDateString = (dateStr: string, days: number): string => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Days in each month (non-leap year, will handle Feb separately)
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // Check for leap year
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (isLeapYear) daysInMonth[1] = 29;

      let newDay = day + days;
      let newMonth = month;
      let newYear = year;

      // Handle month/year overflow
      while (newDay > daysInMonth[newMonth - 1]) {
        newDay -= daysInMonth[newMonth - 1];
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }

      return `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
    };

    // Generate all dates in the range
    const endDate = leaveEndDate || leaveStartDate;

    // Calculate number of days between start and end
    const startDate = new Date(leaveStartDate + 'T12:00:00');
    const finalDate = new Date(endDate + 'T12:00:00');
    const diffDays = Math.round((finalDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Add leave for each day
    for (let i = 0; i <= diffDays; i++) {
      const dateStr = addDaysToDateString(leaveStartDate, i);
      addLeave(modalSelectedMember, leaveType, dateStr, leavePeriod, leaveComment);
    }

    setModalSelectedMember('');
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveType('Congés');
    setLeavePeriod('journée');
    setLeaveComment('');
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

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
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
          Gestion des Congés
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
            }}
          >
            + Ajouter une absence
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
          {/* Day headers */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div
              key={day}
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--color-primary-blue)',
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
            const allDayLeaves = getLeavesByDate(dateStr).filter(
              (leave) => !calendarMemberFilter || leave.memberId === calendarMemberFilter
            );

            // Separate leaves by period
            const morningOnlyLeaves = allDayLeaves.filter(l => l.period === 'matin');
            const afternoonOnlyLeaves = allDayLeaves.filter(l => l.period === 'après-midi');
            const fullDayLeaves = allDayLeaves.filter(l => l.period === 'journée');

            // Combine for display: full day leaves span both periods
            const morningLeaves = [...morningOnlyLeaves, ...fullDayLeaves];
            const afternoonLeaves = [...afternoonOnlyLeaves, ...fullDayLeaves];

            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={day}
                style={{
                  minHeight: '100px',
                  backgroundColor: isToday ? 'rgba(64, 107, 222, 0.1)' : 'var(--color-off-white-1)',
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
                    padding: '0.4rem 0.5rem',
                  }}
                >
                  {day}
                </div>

                {/* Morning and Afternoon side by side */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    gap: '0px',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Morning period (left) */}
                  <div
                    style={{
                      flex: 1,
                      borderRight: '2px solid rgba(40, 50, 118, 0.25)',
                      padding: '0.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    {morningLeaves.map((leave) => {
                      // Check if this is a full day leave
                      const isFullDay = leave.period === 'journée';
                      return (
                        <div
                          key={leave.id}
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.2rem 0.4rem',
                            backgroundColor: leaveTypeColors[leave.type],
                            color: 'white',
                            borderRadius: isFullDay ? '3px 0 0 3px' : '3px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            opacity: leave.status === 'pending' ? 0.5 : 1,
                            border: leave.status === 'pending' ? '1px dashed white' : 'none',
                            marginRight: isFullDay ? '-2px' : '0',
                            position: 'relative',
                            zIndex: isFullDay ? 2 : 1,
                          }}
                          title={`${leave.memberName} - ${leave.type}${leave.status === 'pending' ? ' (En attente)' : ''}${leave.comment ? ` - ${leave.comment}` : ''}`}
                        >
                          {leave.memberName.split(' ')[0]}
                        </div>
                      );
                    })}
                  </div>

                  {/* Afternoon period (right) */}
                  <div
                    style={{
                      flex: 1,
                      padding: '0.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    {afternoonLeaves.map((leave) => {
                      // Check if this is a full day leave
                      const isFullDay = leave.period === 'journée';
                      return (
                        <div
                          key={`afternoon-${leave.id}`}
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.2rem 0.4rem',
                            backgroundColor: leaveTypeColors[leave.type],
                            color: 'white',
                            borderRadius: isFullDay ? '0 3px 3px 0' : '3px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            opacity: leave.status === 'pending' ? 0.5 : 1,
                            border: leave.status === 'pending' ? '1px dashed white' : 'none',
                            marginLeft: isFullDay ? '-2px' : '0',
                            position: 'relative',
                            zIndex: isFullDay ? 2 : 1,
                          }}
                          title={`${leave.memberName} - ${leave.type}${leave.status === 'pending' ? ' (En attente)' : ''}${leave.comment ? ` - ${leave.comment}` : ''}`}
                        >
                          {leave.memberName.split(' ')[0]}
                        </div>
                      );
                    })}
                  </div>
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
          <div><strong>⏳ En attente</strong> : Demande de congés non encore validée (affichée avec opacité réduite et bordure pointillée)</div>
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
                  Date de début *
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
                  Date de fin (optionnel, pour une période)
                </label>
                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
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
                  onChange={(e) => setLeavePeriod(e.target.value as PeriodType)}
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
                  <option value="matin">Matin</option>
                  <option value="après-midi">Après-midi</option>
                  <option value="journée">Journée complète</option>
                </select>
              </div>
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
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-off-white-1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
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
                  </div>
                </div>
              ))}
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
    </div>
  );
}
