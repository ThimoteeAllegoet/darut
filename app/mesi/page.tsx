'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMESI } from '../hooks/useMESI';
import { MESIItem } from '../types/mesi';

export default function MESIPage() {
  const { isAuthenticated } = useAuth();
  const { items, addItem, updateItem, deleteItem } = useMESI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MESIItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MESIItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setUrl(item.url);
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!title.trim() || !url.trim()) return;

    const itemData = {
      title: title.trim(),
      url: url.trim(),
    };

    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      addItem(itemData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette rubrique ?')) {
      deleteItem(id);
    }
  };

  const handleViewItem = (itemUrl: string) => {
    window.open(itemUrl, '_blank', 'noopener,noreferrer');
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setEditingItem(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

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
          MESI
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleAddItem}
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
            + Nouvelle rubrique
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'rgba(40, 50, 118, 0.5)',
            fontSize: '0.95rem',
          }}
        >
          Aucune rubrique disponible.
          {isAuthenticated && ' Cliquez sur "Nouvelle rubrique" pour en ajouter une.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
                border: '1px solid rgba(230, 225, 219, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-primary-dark)',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {item.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  onClick={() => handleViewItem(item.url)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-secondary-blue)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
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
                  Voir
                </button>

                {isAuthenticated && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditItem(item)}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#6B7280',
                        color: 'var(--color-white)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#4B5563';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#6B7280';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#6B7280',
                        color: 'var(--color-white)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#4B5563';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#6B7280';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
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
              maxWidth: '500px',
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
              {editingItem ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
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
                  Titre de la rubrique *
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
                  placeholder="Ex: Tutoriels vidéo"
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
                  URL *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  onClick={handleSaveItem}
                  disabled={!title.trim() || !url.trim()}
                  style={{
                    flex: 1,
                    padding: '0.6rem 1rem',
                    backgroundColor: title.trim() && url.trim() ? 'var(--color-secondary-blue)' : '#9CA3AF',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: title.trim() && url.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (title.trim() && url.trim()) {
                      e.currentTarget.style.backgroundColor = '#2f4fb5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (title.trim() && url.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
                    }
                  }}
                >
                  {editingItem ? 'Enregistrer' : 'Ajouter'}
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
