'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function RechercheCVMPage() {
  const { isAuthenticated } = useAuth();
  const [searchInputConv, setSearchInputConv] = useState('');
  const [searchInputVisu, setSearchInputVisu] = useState('');
  const [searchInputEptica, setSearchInputEptica] = useState('');

  const openUrlConv = () => {
    if (searchInputConv.trim()) {
      window.open(
        `https://pn128.prod01.k8s.pole-emploi.intra/ihm-mapconversation/externe?action=visuConvGCI&idConversation=${searchInputConv.trim()}`
      );
    }
  };

  const openUrlVisu = () => {
    if (searchInputVisu.trim()) {
      window.open(
        `https://pn128.prod01.k8s.pole-emploi.intra/ihm-mapconversation/?action=visuConvEmployeurDune&idConversation=${searchInputVisu.trim()}`
      );
    }
  };

  const openUrlEptica = () => {
    if (searchInputEptica.trim()) {
      window.open(
        `https://pn128.prod01.k8s.pole-emploi.intra/ihm-mapconversation/?action=historiqueEptica&idEptica=${searchInputEptica.trim()}`
      );
    }
  };

  const handleKeyPress = (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--color-primary-blue)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
            Accès restreint
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Vous devez être en mode administration pour accéder à la recherche CVM
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '1.25rem',
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
          Recherche de conversation
        </h1>
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(15px)',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
          border: '1px solid rgba(230, 225, 219, 0.3)',
          maxWidth: '600px',
        }}
      >
        {/* CVM Usager */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="searchInputConv"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-primary-dark)',
            }}
          >
            CVM Usager
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="searchInputConv"
              type="text"
              value={searchInputConv}
              onChange={(e) => setSearchInputConv(e.target.value)}
              onKeyPress={handleKeyPress(openUrlConv)}
              placeholder="Saisir un ID de conversation"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              onClick={openUrlConv}
              style={{
                padding: '0.75rem 1.5rem',
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
              Ouvrir
            </button>
          </div>
        </div>

        {/* CVM Employeur */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="searchInputVisu"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-primary-dark)',
            }}
          >
            CVM Employeur
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="searchInputVisu"
              type="text"
              value={searchInputVisu}
              onChange={(e) => setSearchInputVisu(e.target.value)}
              onKeyPress={handleKeyPress(openUrlVisu)}
              placeholder="Saisir un ID de conversation"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              onClick={openUrlVisu}
              style={{
                padding: '0.75rem 1.5rem',
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
              Ouvrir
            </button>
          </div>
        </div>

        {/* Archive EPTICA */}
        <div>
          <label
            htmlFor="searchInputEptica"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-primary-dark)',
            }}
          >
            Archive EPTICA
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="searchInputEptica"
              type="text"
              value={searchInputEptica}
              onChange={(e) => setSearchInputEptica(e.target.value)}
              onKeyPress={handleKeyPress(openUrlEptica)}
              placeholder="Saisir un ID EPTICA"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              onClick={openUrlEptica}
              style={{
                padding: '0.75rem 1.5rem',
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
              Ouvrir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
