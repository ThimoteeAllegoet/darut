'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMESI } from '../hooks/useMESI';
import { ApplicationName, MESIItem } from '../types/mesi';

const applications: ApplicationName[] = [
  'Bandeau',
  'CVM',
  'AGENDA',
  'Weplan',
  'GEM',
  'Visio',
  'Scanner',
  'eBorne',
  'Trace de contact',
];

export default function MESIPage() {
  const { isAuthenticated } = useAuth();
  const { items, addItem, updateItem, deleteItem, getItemsByApp } = useMESI();

  const [selectedApp, setSelectedApp] = useState<ApplicationName>('Bandeau');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MESIItem | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const currentItems = getItemsByApp(selectedApp);

  const handleAddItem = () => {
    setEditingItem(null);
    setTitle('');
    setUrl('');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MESIItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setUrl(item.url);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    if (editingItem) {
      updateItem(editingItem.id, { title, url });
    } else {
      addItem(selectedApp, { title, url });
    }

    setIsModalOpen(false);
    setTitle('');
    setUrl('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette rubrique ?')) {
      deleteItem(id);
    }
  };

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

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          {applications.map((app) => {
            const isSelected = selectedApp === app;
            const appItemsCount = getItemsByApp(app).length;
            return (
              <button
                key={app}
                onClick={() => setSelectedApp(app)}
                style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'transparent',
                  color: isSelected ? 'var(--color-primary-dark)' : 'rgba(40, 50, 118, 0.7)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '700' : '600',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: isSelected ? 'underline' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = 'var(--color-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = isSelected ? 'underline' : 'none';
                  e.currentTarget.style.color = isSelected ? 'var(--color-primary-dark)' : 'rgba(40, 50, 118, 0.7)';
                }}
              >
                {app}
                {appItemsCount > 0 && (
                  <span
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--color-secondary-yellow)'
                        : 'var(--color-secondary-blue)',
                      color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-white)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                    }}
                  >
                    {appItemsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

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
        {currentItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--color-primary-blue)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
              Aucune rubrique pour {selectedApp}
            </p>
            {isAuthenticated && (
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Cliquez sur "Nouvelle rubrique" pour en ajouter une
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid rgba(230, 225, 219, 0.5)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--color-primary-dark)',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-secondary-blue)',
                      textDecoration: 'underline',
                      wordBreak: 'break-all',
                    }}
                  >
                    {item.url}
                  </a>
                </div>
                {isAuthenticated && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => handleEditItem(item)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        color: 'var(--color-secondary-blue)',
                        border: '1px solid var(--color-secondary-blue)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        color: 'var(--color-accent-red)',
                        border: '1px solid var(--color-accent-red)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
          onClick={() => setIsModalOpen(false)}
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
                margin: '0 0 1.25rem 0',
                fontSize: '1.25rem',
                color: 'var(--color-primary-dark)',
              }}
            >
              {editingItem ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
            </h2>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                  }}
                >
                  Titre *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(176, 191, 240, 0.5)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary-dark)',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                  }}
                >
                  URL *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(176, 191, 240, 0.5)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary-blue)',
                    border: '1px solid rgba(176, 191, 240, 0.5)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-secondary-blue)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
