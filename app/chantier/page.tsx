'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChantier } from '../hooks/useChantier';
import { Chantier, ChantierState, ChantierHistoryEntry, ChantierHistoryType } from '../types/chantier';

const chantierStates: ChantierState[] = ['En cours', 'Terminé', 'En attente', 'Bloqué'];

const getHistoryTypeColor = (type: ChantierHistoryType): string => {
  return type === 'information' ? '#406BDE' : '#D92424';
};

const getStateColor = (state: ChantierState): string => {
  switch (state) {
    case 'En cours':
      return '#406BDE'; // Blue
    case 'Terminé':
      return '#22C55E'; // Green
    case 'En attente':
      return '#FF9900'; // Orange
    case 'Bloqué':
      return '#D92424'; // Red
    default:
      return '#9CA3AF'; // Gray
  }
};

const getProgressColor = (progress: number): string => {
  if (progress >= 75) return '#22C55E'; // Green
  if (progress >= 50) return '#406BDE'; // Blue
  if (progress >= 25) return '#FF9900'; // Orange
  return '#D92424'; // Red
};

export default function ChantierPage() {
  const { isAuthenticated } = useAuth();
  const { chantiers, addChantier, updateChantier, deleteChantier } = useChantier();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChantier, setEditingChantier] = useState<Chantier | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<ChantierState>('En cours');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  const [deliveryPeriod, setDeliveryPeriod] = useState('');
  const [history, setHistory] = useState<ChantierHistoryEntry[]>([]);

  // History form state
  const [historyMessage, setHistoryMessage] = useState('');
  const [historyDate, setHistoryDate] = useState('');
  const [historyType, setHistoryType] = useState<ChantierHistoryType>('information');
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);

  const handleAddChantier = () => {
    setEditingChantier(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditChantier = (chantier: Chantier) => {
    setEditingChantier(chantier);
    setTitle(chantier.title);
    setDescription(chantier.description);
    setState(chantier.state);
    setProgress(chantier.progress);
    setShowProgress(chantier.showProgress !== false);
    setDeliveryPeriod(chantier.deliveryPeriod || '');
    setHistory([...chantier.history]);
    setIsModalOpen(true);
  };

  const handleSaveChantier = () => {
    if (!title.trim() || !description.trim()) return;

    const chantierData = {
      title,
      description,
      state,
      progress,
      showProgress,
      deliveryPeriod: deliveryPeriod.trim() || undefined,
      history,
    };

    if (editingChantier) {
      updateChantier(editingChantier.id, chantierData);
    } else {
      addChantier(chantierData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setState('En cours');
    setProgress(0);
    setShowProgress(true);
    setDeliveryPeriod('');
    setHistory([]);
    setHistoryMessage('');
    setHistoryDate('');
    setHistoryType('information');
    setEditingHistoryId(null);
  };

  const handleDeleteChantier = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      deleteChantier(id);
    }
  };

  const handleAddHistoryEntry = () => {
    if (!historyMessage.trim() || !historyDate.trim()) return;

    if (editingHistoryId) {
      // Edit existing entry
      setHistory(
        history.map((entry) =>
          entry.id === editingHistoryId
            ? { ...entry, message: historyMessage, date: historyDate, type: historyType }
            : entry
        )
      );
      setEditingHistoryId(null);
    } else {
      // Add new entry
      const newEntry: ChantierHistoryEntry = {
        id: Date.now().toString(),
        date: historyDate,
        message: historyMessage,
        type: historyType,
      };
      setHistory([...history, newEntry]);
    }

    setHistoryMessage('');
    setHistoryDate('');
    setHistoryType('information');
    setIsHistoryModalOpen(false);
  };

  const handleEditHistoryEntry = (entry: ChantierHistoryEntry) => {
    setEditingHistoryId(entry.id);
    setHistoryMessage(entry.message);
    setHistoryDate(entry.date);
    setHistoryType(entry.type || 'information');
    setIsHistoryModalOpen(true);
  };

  const handleDeleteHistoryEntry = (entryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée d\'historique ?')) {
      setHistory(history.filter((entry) => entry.id !== entryId));
    }
  };

  // Sort chantiers by updatedAt (most recent first)
  const sortedChantiers = [...chantiers].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
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
          Chantier
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddChantier}
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
            + Nouveau chantier
          </button>
        )}
      </div>

      {sortedChantiers.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--color-primary-blue)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
            Aucun chantier enregistré
          </p>
          {isAuthenticated && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Cliquez sur "Nouveau chantier" pour en ajouter un
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {sortedChantiers.map((chantier) => {
            return (
              <div
                key={chantier.id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  border: '1px solid rgba(230, 225, 219, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header with title and state badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--color-primary-dark)',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {chantier.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.6rem',
                      backgroundColor: getStateColor(chantier.state),
                      color: 'var(--color-white)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chantier.state}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-primary-blue)',
                    margin: 0,
                    lineHeight: '1.4',
                  }}
                >
                  {chantier.description}
                </p>

                {/* Delivery Period */}
                {chantier.deliveryPeriod && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-primary-dark)',
                      backgroundColor: 'rgba(176, 191, 240, 0.15)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>Livraison prévue :</span> {chantier.deliveryPeriod}
                  </div>
                )}

                {/* Progress bar */}
                {chantier.showProgress !== false && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--color-primary-blue)',
                          fontWeight: '600',
                        }}
                      >
                        Progression
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: getProgressColor(chantier.progress),
                        }}
                      >
                        {chantier.progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(176, 191, 240, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${chantier.progress}%`,
                          height: '100%',
                          backgroundColor: getProgressColor(chantier.progress),
                          borderRadius: '4px',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Full history */}
                {chantier.history.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--color-primary-dark)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Historique
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {chantier.history.slice().reverse().map((entry) => {
                        const entryColor = getHistoryTypeColor(entry.type || 'information');
                        return (
                          <div
                            key={entry.id}
                            style={{
                              padding: '0.75rem',
                              backgroundColor: entry.type === 'problème' ? 'rgba(217, 36, 36, 0.05)' : 'rgba(64, 107, 222, 0.05)',
                              borderLeft: `3px solid ${entryColor}`,
                            }}
                          >
                            <div
                              style={{
                                fontSize: '0.65rem',
                                color: entryColor,
                                fontWeight: '600',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {entry.type === 'problème' ? '⚠️ ' : 'ℹ️ '}
                              {new Date(entry.date).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(entry.date).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-primary-dark)',
                                lineHeight: '1.3',
                              }}
                            >
                              {entry.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {isAuthenticated && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'flex-end',
                      marginTop: '0.25rem',
                    }}
                  >
                    <button
                      onClick={() => handleEditChantier(chantier)}
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
                      onClick={() => handleDeleteChantier(chantier.id)}
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
            );
          })}
        </div>
      )}

      {/* Main Modal for Add/Edit Chantier */}
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
              {editingChantier ? 'Modifier le chantier' : 'Nouveau chantier'}
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
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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

            {/* State */}
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
                État *
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value as ChantierState)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--color-white)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {chantierStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Period */}
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
                Date/Période de livraison prévisionnelle
              </label>
              <input
                type="text"
                value={deliveryPeriod}
                onChange={(e) => setDeliveryPeriod(e.target.value)}
                placeholder="Ex: Mi-février 2025, Semaine 12, T2 2025..."
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

            {/* Progress */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="showProgress"
                  checked={showProgress}
                  onChange={(e) => setShowProgress(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                  }}
                />
                <label
                  htmlFor="showProgress"
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Afficher la progression
                </label>
              </div>
              {showProgress && (
                <>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-primary-dark)',
                      fontWeight: '500',
                    }}
                  >
                    Progression (0-100) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 100) {
                          setProgress(val);
                        }
                      }}
                      style={{
                        width: '70px',
                        padding: '0.5rem',
                        border: '2px solid var(--color-neutral-beige)',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--color-primary-dark)',
                      }}
                    >
                      %
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* History Section */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                  }}
                >
                  Historique
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEditingHistoryId(null);
                    setHistoryMessage('');
                    setHistoryDate(new Date().toISOString());
                    setHistoryType('information');
                    setIsHistoryModalOpen(true);
                  }}
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
                  + Ajouter une entrée
                </button>
              </div>

              {history.length === 0 ? (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(176, 191, 240, 0.1)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-blue)',
                    fontStyle: 'italic',
                  }}
                >
                  Aucune entrée d'historique
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    border: '1px solid rgba(230, 225, 219, 0.5)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                  }}
                >
                  {history
                    .slice()
                    .reverse()
                    .map((entry) => {
                      const entryColor = getHistoryTypeColor(entry.type || 'information');
                      return (
                        <div
                          key={entry.id}
                          style={{
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            backgroundColor: entry.type === 'problème' ? 'rgba(217, 36, 36, 0.05)' : 'rgba(64, 107, 222, 0.05)',
                            borderLeft: `3px solid ${entryColor}`,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: '0.65rem',
                                  color: entryColor,
                                  fontWeight: '600',
                                  marginBottom: '0.25rem',
                                }}
                              >
                                {entry.type === 'problème' ? '⚠️ ' : 'ℹ️ '}
                                {new Date(entry.date).toLocaleDateString('fr-FR')} à{' '}
                                {new Date(entry.date).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--color-primary-dark)',
                                  lineHeight: '1.3',
                                }}
                              >
                                {entry.message}
                              </div>
                            </div>
                          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                            <button
                              onClick={() => handleEditHistoryEntry(entry)}
                              style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                color: 'rgba(40, 50, 118, 0.5)',
                                border: '1px solid rgba(40, 50, 118, 0.2)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(40, 50, 118, 0.1)';
                                e.currentTarget.style.color = 'var(--color-secondary-blue)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'rgba(40, 50, 118, 0.5)';
                              }}
                              title="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteHistoryEntry(entry.id)}
                              style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                color: 'rgba(217, 36, 36, 0.5)',
                                border: '1px solid rgba(217, 36, 36, 0.2)',
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
                                e.currentTarget.style.color = 'rgba(217, 36, 36, 0.5)';
                              }}
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
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
                onClick={handleSaveChantier}
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
                {editingChantier ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Entry Modal */}
      {isHistoryModalOpen && (
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
            zIndex: 1001,
          }}
          onClick={() => {
            setIsHistoryModalOpen(false);
            setHistoryMessage('');
            setHistoryDate('');
            setHistoryType('information');
            setEditingHistoryId(null);
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
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.1rem',
                color: 'var(--color-primary-dark)',
              }}
            >
              {editingHistoryId ? 'Modifier l\'entrée' : 'Nouvelle entrée d\'historique'}
            </h3>

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
                Date et heure *
              </label>
              <input
                type="datetime-local"
                value={historyDate ? new Date(historyDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setHistoryDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
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
                Type *
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    border: '2px solid',
                    borderColor: historyType === 'information' ? '#406BDE' : 'var(--color-neutral-beige)',
                    backgroundColor: historyType === 'information' ? 'rgba(64, 107, 222, 0.1)' : 'white',
                    borderRadius: '6px',
                    flex: 1,
                  }}
                >
                  <input
                    type="radio"
                    name="historyType"
                    value="information"
                    checked={historyType === 'information'}
                    onChange={(e) => setHistoryType(e.target.value as ChantierHistoryType)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#406BDE' }}>
                    ℹ️ Information
                  </span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    border: '2px solid',
                    borderColor: historyType === 'problème' ? '#D92424' : 'var(--color-neutral-beige)',
                    backgroundColor: historyType === 'problème' ? 'rgba(217, 36, 36, 0.1)' : 'white',
                    borderRadius: '6px',
                    flex: 1,
                  }}
                >
                  <input
                    type="radio"
                    name="historyType"
                    value="problème"
                    checked={historyType === 'problème'}
                    onChange={(e) => setHistoryType(e.target.value as ChantierHistoryType)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#D92424' }}>
                    ⚠️ Problème
                  </span>
                </label>
              </div>
            </div>

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
                Message *
              </label>
              <textarea
                value={historyMessage}
                onChange={(e) => setHistoryMessage(e.target.value)}
                rows={4}
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
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setHistoryMessage('');
                  setHistoryDate('');
                  setHistoryType('information');
                  setEditingHistoryId(null);
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
                onClick={handleAddHistoryEntry}
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
                {editingHistoryId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
