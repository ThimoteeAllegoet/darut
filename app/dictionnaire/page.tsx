'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDictionary } from '../hooks/useDictionary';
import { DictionaryTerm, ApplicationName } from '../types/dictionary';

const applications: ApplicationName[] = [
  'Général',
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

export default function DictionnairePage() {
  const { isAuthenticated } = useAuth();
  const { terms, addTerm, updateTerm, deleteTerm, searchTerms } = useDictionary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationName | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<DictionaryTerm | null>(null);

  // Form state
  const [formTerm, setFormTerm] = useState('');
  const [formDefinition, setFormDefinition] = useState('');
  const [formApplications, setFormApplications] = useState<ApplicationName[]>([]);
  const [formDocumentUrl, setFormDocumentUrl] = useState('');
  const [formDocumentName, setFormDocumentName] = useState('');

  const filteredTerms = searchTerms(searchQuery, selectedApp);

  const handleOpenModal = (term?: DictionaryTerm) => {
    if (term) {
      setEditingTerm(term);
      setFormTerm(term.term);
      setFormDefinition(term.definition);
      setFormApplications(term.applications);
      setFormDocumentUrl(term.documentUrl || '');
      setFormDocumentName(term.documentName || '');
    } else {
      setEditingTerm(null);
      setFormTerm('');
      setFormDefinition('');
      setFormApplications([]);
      setFormDocumentUrl('');
      setFormDocumentName('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTerm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTerm || !formDefinition || formApplications.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const termData = {
      term: formTerm,
      definition: formDefinition,
      applications: formApplications,
      documentUrl: formDocumentUrl || undefined,
      documentName: formDocumentName || undefined,
    };

    if (editingTerm) {
      updateTerm(editingTerm.id, termData);
    } else {
      addTerm(termData);
    }

    handleCloseModal();
  };

  const toggleApplication = (app: ApplicationName) => {
    if (formApplications.includes(app)) {
      setFormApplications(formApplications.filter((a) => a !== app));
    } else {
      setFormApplications([...formApplications, app]);
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
          Dictionnaire
        </h1>
        {isAuthenticated && (
          <button
            onClick={() => handleOpenModal()}
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
            + Nouveau terme
          </button>
        )}
      </div>

      {/* Search and filter */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="Rechercher un terme ou une définition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(230, 225, 219, 0.5)',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: '0 1 280px' }}>
            <select
              value={selectedApp || ''}
              onChange={(e) => setSelectedApp(e.target.value as ApplicationName || undefined)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(230, 225, 219, 0.5)',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'var(--color-white)',
                cursor: 'pointer',
              }}
            >
              <option value="">Toutes les applications</option>
              {applications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Terms list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTerms.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--color-primary-blue)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: 'rgba(40, 50, 118, 0.5)' }}
            >
              search_off
            </span>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
              {searchQuery || selectedApp ? 'Aucun terme trouvé' : 'Aucun terme dans le dictionnaire'}
            </p>
            {isAuthenticated && !searchQuery && !selectedApp && (
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Cliquez sur "Nouveau terme" pour en ajouter un
              </p>
            )}
          </div>
        ) : (
          filteredTerms.map((term) => (
            <div
              key={term.id}
              style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: 'var(--color-primary-dark)',
                    margin: 0,
                  }}
                >
                  {term.term}
                </h3>
                {isAuthenticated && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenModal(term)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        backgroundColor: 'var(--color-secondary-blue)',
                        color: 'var(--color-white)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce terme ?')) {
                          deleteTerm(term.id);
                        }
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        backgroundColor: 'var(--color-accent-red)',
                        color: 'var(--color-white)',
                        border: 'none',
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

              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-primary-blue)',
                  lineHeight: '1.6',
                  marginBottom: '0.75rem',
                }}
              >
                {term.definition}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: term.documentUrl ? '0.75rem' : '0' }}>
                {term.applications.map((app) => (
                  <span
                    key={app}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.65rem',
                      backgroundColor: 'var(--color-light-blue)',
                      color: 'var(--color-secondary-blue)',
                      borderRadius: '4px',
                      fontWeight: '600',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>

              {term.documentUrl && (
                <a
                  href={term.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    backgroundColor: 'var(--color-primary-dark)',
                    color: 'var(--color-white)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a2350';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                    description
                  </span>
                  {term.documentName || 'Voir le document'}
                </a>
              )}
            </div>
          ))
        )}
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '100%',
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
              {editingTerm ? 'Modifier le terme' : 'Nouveau terme'}
            </h2>

            <form onSubmit={handleSubmit}>
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
                  Terme *
                </label>
                <input
                  type="text"
                  value={formTerm}
                  onChange={(e) => setFormTerm(e.target.value)}
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
                  Définition *
                </label>
                <textarea
                  value={formDefinition}
                  onChange={(e) => setFormDefinition(e.target.value)}
                  required
                  rows={4}
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
                  Applications concernées *
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {applications.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleApplication(app)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: formApplications.includes(app) ? '2px solid var(--color-secondary-blue)' : '1px solid rgba(230, 225, 219, 0.5)',
                        borderRadius: '4px',
                        backgroundColor: formApplications.includes(app) ? 'var(--color-light-blue)' : 'var(--color-white)',
                        color: formApplications.includes(app) ? 'var(--color-secondary-blue)' : 'var(--color-primary-blue)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
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
                  Nom du document (optionnel)
                </label>
                <input
                  type="text"
                  value={formDocumentName}
                  onChange={(e) => setFormDocumentName(e.target.value)}
                  placeholder="Ex: Guide utilisateur CVM"
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
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.5rem',
                  }}
                >
                  URL du document (optionnel)
                </label>
                <input
                  type="url"
                  value={formDocumentUrl}
                  onChange={(e) => setFormDocumentUrl(e.target.value)}
                  placeholder="https://..."
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

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  {editingTerm ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
