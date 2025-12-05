'use client';

import { useState, useEffect } from 'react';
import { Anomaly, ApplicationName } from '../types/anomaly';

interface AnomalyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    incidentReferences: string;
    correctionDate: string;
  }) => void;
  applicationName: ApplicationName;
  anomaly?: Anomaly | null;
}

export default function AnomalyModal({
  isOpen,
  onClose,
  onSave,
  applicationName,
  anomaly,
}: AnomalyModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentReferences, setIncidentReferences] = useState('');
  const [correctionDate, setCorrectionDate] = useState('');

  useEffect(() => {
    if (anomaly) {
      setTitle(anomaly.title);
      setDescription(anomaly.description);
      setIncidentReferences(anomaly.incidentReferences);
      setCorrectionDate(anomaly.correctionDate);
    } else {
      setTitle('');
      setDescription('');
      setIncidentReferences('');
      setCorrectionDate('');
    }
  }, [anomaly, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      incidentReferences,
      correctionDate,
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIncidentReferences('');
    setCorrectionDate('');
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
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: 'var(--color-primary-dark)',
          }}
        >
          {anomaly ? 'Modifier l\'anomalie' : 'Nouvelle anomalie'} - {applicationName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Titre *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Description détaillée *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-secondary-blue)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-neutral-beige)';
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="incidentReferences"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Numéro d'incident
            </label>
            <input
              id="incidentReferences"
              type="text"
              value={incidentReferences}
              onChange={(e) => setIncidentReferences(e.target.value)}
              placeholder="Ex: INC12345"
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="correctionDate"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '500',
              }}
            >
              Date de correction
            </label>
            <input
              id="correctionDate"
              type="date"
              value={correctionDate}
              onChange={(e) => setCorrectionDate(e.target.value)}
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

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.75rem 1.5rem',
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
                padding: '0.75rem 1.5rem',
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
              {anomaly ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
