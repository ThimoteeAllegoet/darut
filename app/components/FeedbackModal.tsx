'use client';

import { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // For now, just log the feedback (could be extended to send email or save to database)
    console.log('Feedback submitted:', { name, description, timestamp: new Date().toISOString() });
    alert('Votre feedback a été enregistré. Merci !');
    setName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

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
      onClick={onClose}
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
            margin: '0 0 1rem 0',
            fontSize: '1.25rem',
            color: 'var(--color-primary-dark)',
            fontWeight: '600',
          }}
        >
          Feedback
        </h2>

        <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', marginBottom: '1rem' }}>
          Partagez vos remarques, suggestions, demandes, compliments ou signalez une anomalie.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              marginBottom: '0.3rem',
              color: 'var(--color-primary-dark)',
              fontWeight: '500',
            }}
          >
            Votre identité *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom et prénom"
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              marginBottom: '0.3rem',
              color: 'var(--color-primary-dark)',
              fontWeight: '500',
            }}
          >
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre remarque, suggestion, demande..."
            rows={6}
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

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
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
            onClick={handleSubmit}
            disabled={!name.trim() || !description.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !name.trim() || !description.trim() ? '#ccc' : 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: !name.trim() || !description.trim() ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
