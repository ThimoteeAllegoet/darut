'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../types/alert';

export default function AlertePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { alerts, addAlert, updateAlert, deleteAlert } = useAlert();

  // Redirect to homepage if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [concernedApplications, setConcernedApplications] = useState<string[]>([]);
  const [workaround, setWorkaround] = useState('');
  const [startDate, setStartDate] = useState('');
  const [snowTicket, setSnowTicket] = useState('');
  const [snowTicketUrl, setSnowTicketUrl] = useState('');
  const [affectedPopulation, setAffectedPopulation] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleAddAlert = () => {
    setEditingAlert(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    setTitle(alert.title);
    setDescription(alert.description);
    setImpact(alert.impact);
    setConcernedApplications(alert.concernedApplications);
    setWorkaround(alert.workaround || '');
    setStartDate(alert.startDate);
    setSnowTicket(alert.snowTicket || '');
    setSnowTicketUrl(alert.snowTicketUrl || '');
    setAffectedPopulation(alert.affectedPopulation);
    setIsActive(alert.isActive);
    setIsModalOpen(true);
  };

  const handleSaveAlert = () => {
    if (!title.trim() || !description.trim() || !impact.trim() || !startDate || !affectedPopulation.trim()) return;

    const alertData = {
      title: title.trim(),
      description: description.trim(),
      impact: impact.trim(),
      concernedApplications,
      workaround: workaround.trim() || undefined,
      startDate,
      snowTicket: snowTicket.trim() || undefined,
      snowTicketUrl: snowTicketUrl.trim() || undefined,
      affectedPopulation: affectedPopulation.trim(),
      isActive,
    };

    if (editingAlert) {
      updateAlert(editingAlert.id, alertData);
    } else {
      addAlert(alertData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImpact('');
    setConcernedApplications([]);
    setWorkaround('');
    setStartDate('');
    setSnowTicket('');
    setSnowTicketUrl('');
    setAffectedPopulation('');
    setIsActive(false);
    setEditingAlert(null);
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      deleteAlert(id);
    }
  };

  const handleToggleActive = (alert: Alert) => {
    updateAlert(alert.id, { ...alert, isActive: !alert.isActive });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleApplicationToggle = (app: string) => {
    if (concernedApplications.includes(app)) {
      setConcernedApplications(concernedApplications.filter(a => a !== app));
    } else {
      setConcernedApplications([...concernedApplications, app]);
    }
  };

  const availableApplications = ['Bandeau', 'CVM', 'AGENDA', 'Weplan', 'GEM', 'Visio', 'Scanner', 'eBorne', 'Trace de contact', 'Autres'];

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '2rem',
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
          Alertes Incidents Majeurs
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddAlert}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-accent-red)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B81D1D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
            }}
          >
            + Nouvelle alerte
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'rgba(40, 50, 118, 0.5)',
            fontSize: '0.95rem',
          }}
        >
          Aucune alerte enregistrée.
          {isAuthenticated && ' Cliquez sur "Nouvelle alerte" pour en ajouter une.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: alert.isActive ? '2px solid var(--color-accent-red)' : '1px solid rgba(230, 225, 219, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: 'var(--color-accent-red)',
                        margin: 0,
                      }}
                    >
                      {alert.title}
                    </h3>
                    {alert.isActive && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'var(--color-accent-red)',
                          color: 'var(--color-white)',
                          borderRadius: '10px',
                          fontWeight: '600',
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)', marginBottom: '0.5rem' }}>
                    Depuis le {new Date(alert.startDate).toLocaleDateString('fr-FR')} à {new Date(alert.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isAuthenticated && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggleActive(alert)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        color: alert.isActive ? 'rgba(34, 197, 94, 0.7)' : 'rgba(107, 114, 128, 0.7)',
                        border: `1px solid ${alert.isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = alert.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)';
                        e.currentTarget.style.color = alert.isActive ? '#22C55E' : '#6B7280';
                        e.currentTarget.style.borderColor = alert.isActive ? '#22C55E' : '#6B7280';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = alert.isActive ? 'rgba(34, 197, 94, 0.7)' : 'rgba(107, 114, 128, 0.7)';
                        e.currentTarget.style.borderColor = alert.isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)';
                      }}
                      title={alert.isActive ? 'Désactiver l\'alerte' : 'Activer l\'alerte'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                        {alert.isActive ? 'toggle_on' : 'toggle_off'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleEditAlert(alert)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        color: 'rgba(40, 50, 118, 0.5)',
                        border: '1px solid rgba(40, 50, 118, 0.2)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
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
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'transparent',
                        color: 'rgba(217, 36, 36, 0.5)',
                        border: '1px solid rgba(217, 36, 36, 0.2)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
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
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                    </button>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-primary-blue)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                {alert.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                    IMPACT
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>
                    {alert.impact}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                    POPULATION IMPACTÉE
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>
                    {alert.affectedPopulation}
                  </div>
                </div>

                {alert.concernedApplications.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                      APPLICATIONS CONCERNÉES
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {alert.concernedApplications.map((app) => (
                        <span
                          key={app}
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: 'rgba(217, 36, 36, 0.15)',
                            color: 'var(--color-accent-red)',
                            borderRadius: '10px',
                            fontWeight: '600',
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {alert.snowTicket && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                      TICKET SNOW
                    </div>
                    {alert.snowTicketUrl ? (
                      <a
                        href={alert.snowTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-secondary-blue)',
                          textDecoration: 'none',
                          fontWeight: '700',
                        }}
                      >
                        {alert.snowTicket}
                      </a>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', fontWeight: '700' }}>
                        {alert.snowTicket}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {alert.workaround && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    SOLUTION DE CONTOURNEMENT
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', lineHeight: '1.5' }}>
                    {alert.workaround}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
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
          }}
          onClick={handleModalClose}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
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
              {editingAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
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
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                  placeholder="Ex: Panne majeure SI RH"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Description détaillée de l'incident"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Impact *
                </label>
                <textarea
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Impact de l'incident"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Applications concernées
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {availableApplications.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => handleApplicationToggle(app)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        backgroundColor: concernedApplications.includes(app) ? 'var(--color-accent-red)' : 'rgba(230, 225, 219, 0.3)',
                        color: concernedApplications.includes(app) ? 'var(--color-white)' : 'var(--color-primary-blue)',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Population impactée *
                </label>
                <input
                  type="text"
                  value={affectedPopulation}
                  onChange={(e) => setAffectedPopulation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                  placeholder="Ex: Tous les utilisateurs, Managers, etc."
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  value={startDate ? new Date(startDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Ticket SNOW
                </label>
                <input
                  type="text"
                  value={snowTicket}
                  onChange={(e) => setSnowTicket(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                  placeholder="Ex: INC0012345"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  URL Ticket SNOW
                </label>
                <input
                  type="url"
                  value={snowTicketUrl}
                  onChange={(e) => setSnowTicketUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Solution de contournement
                </label>
                <textarea
                  value={workaround}
                  onChange={(e) => setWorkaround(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Solution temporaire pour contourner le problème"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                <label
                  htmlFor="isActive"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: 'var(--color-primary-dark)',
                    cursor: 'pointer',
                  }}
                >
                  Alerte active (affichée au démarrage de l'application)
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  onClick={handleSaveAlert}
                  disabled={!title.trim() || !description.trim() || !impact.trim() || !startDate || !affectedPopulation.trim()}
                  style={{
                    flex: 1,
                    padding: '0.6rem 1rem',
                    backgroundColor: (title.trim() && description.trim() && impact.trim() && startDate && affectedPopulation.trim()) ? 'var(--color-accent-red)' : '#9CA3AF',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (title.trim() && description.trim() && impact.trim() && startDate && affectedPopulation.trim()) ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (title.trim() && description.trim() && impact.trim() && startDate && affectedPopulation.trim()) {
                      e.currentTarget.style.backgroundColor = '#B81D1D';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (title.trim() && description.trim() && impact.trim() && startDate && affectedPopulation.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
                    }
                  }}
                >
                  {editingAlert ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button
                  onClick={handleModalClose}
                  style={{
                    flex: 1,
                    padding: '0.6rem 1rem',
                    backgroundColor: '#6B7280',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '4px',
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
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
