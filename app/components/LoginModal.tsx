'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Identifiants incorrects');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: 'var(--color-primary-dark)',
            textAlign: 'center',
          }}
        >
          Mode Écriture
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Identifiant
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-secondary-blue)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-neutral-beige)';
              }}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-secondary-blue)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-neutral-beige)';
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-light-red)',
                color: 'var(--color-accent-red)',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--color-neutral-beige)',
                color: 'var(--color-primary-dark)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d0cbc5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-beige)';
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--color-secondary-blue)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
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
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
