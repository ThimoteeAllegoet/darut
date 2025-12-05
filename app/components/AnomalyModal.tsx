'use client';

import { useState, useEffect } from 'react';
import { Anomaly, ApplicationName, AnomalyStatus, HistoryEntry } from '../types/anomaly';
import HistoryManager from './HistoryManager';

interface AnomalyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Anomaly, 'id' | 'applicationName' | 'priority' | 'createdAt' | 'updatedAt'>) => void;
  applicationName: ApplicationName;
  anomaly?: Anomaly | null;
}

const statusOptions: AnomalyStatus[] = [
  'Nouveau',
  'En cours d\'analyse',
  'Corrigé',
  'En attente de livraison',
  'En attente de logs',
  'En attente retour utilisateur',
];

export default function AnomalyModal({
  isOpen,
  onClose,
  onSave,
  applicationName,
  anomaly,
}: AnomalyModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<AnomalyStatus>('Nouveau');

  // Dates
  const [appearanceDate, setAppearanceDate] = useState('');
  const [correctionDate, setCorrectionDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Tickets
  const [ticketSNOW, setTicketSNOW] = useState('');
  const [ticketSNOWUrl, setTicketSNOWUrl] = useState('');
  const [ticketJIRA, setTicketJIRA] = useState('');
  const [ticketJIRAUrl, setTicketJIRAUrl] = useState('');
  const [ticketMainteneur, setTicketMainteneur] = useState('');
  const [ticketMainteneurUrl, setTicketMainteneurUrl] = useState('');

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (anomaly) {
      setTitle(anomaly.title);
      setDescription(anomaly.description);
      setStatus(anomaly.status);
      setAppearanceDate(anomaly.appearanceDate || '');
      setCorrectionDate(anomaly.correctionDate || '');
      setDeliveryDate(anomaly.deliveryDate || '');
      setTicketSNOW(anomaly.ticketSNOW || '');
      setTicketSNOWUrl(anomaly.ticketSNOWUrl || '');
      setTicketJIRA(anomaly.ticketJIRA || '');
      setTicketJIRAUrl(anomaly.ticketJIRAUrl || '');
      setTicketMainteneur(anomaly.ticketMainteneur || '');
      setTicketMainteneurUrl(anomaly.ticketMainteneurUrl || '');
      setHistory(anomaly.history || []);
    } else {
      resetForm();
    }
  }, [anomaly, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Nouveau');
    setAppearanceDate('');
    setCorrectionDate('');
    setDeliveryDate('');
    setTicketSNOW('');
    setTicketSNOWUrl('');
    setTicketJIRA('');
    setTicketJIRAUrl('');
    setTicketMainteneur('');
    setTicketMainteneurUrl('');
    setHistory([]);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      appearanceDate,
      correctionDate,
      deliveryDate,
      ticketSNOW,
      ticketSNOWUrl,
      ticketJIRA,
      ticketJIRAUrl,
      ticketMainteneur,
      ticketMainteneurUrl,
      history,
    });
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid var(--color-neutral-beige)',
    borderRadius: '4px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--color-primary-dark)',
    fontWeight: '500' as const,
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
          maxWidth: '800px',
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
          {/* Informations de base */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title" style={labelStyle}>
              Titre *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={labelStyle}>
              Description détaillée *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="status" style={labelStyle}>
              Statut *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as AnomalyStatus)}
              required
              style={inputStyle}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <fieldset
            style={{
              border: '1px solid var(--color-neutral-beige)',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <legend style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
              📅 Dates
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="appearanceDate" style={labelStyle}>
                  Date d'apparition
                </label>
                <input
                  id="appearanceDate"
                  type="date"
                  value={appearanceDate}
                  onChange={(e) => setAppearanceDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="correctionDate" style={labelStyle}>
                  Date de correction
                </label>
                <input
                  id="correctionDate"
                  type="date"
                  value={correctionDate}
                  onChange={(e) => setCorrectionDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="deliveryDate" style={labelStyle}>
                  Date de livraison
                </label>
                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </fieldset>

          {/* Tickets */}
          <fieldset
            style={{
              border: '1px solid var(--color-neutral-beige)',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <legend style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
              🎫 Tickets
            </legend>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="ticketSNOW" style={labelStyle}>
                Ticket SNOW
              </label>
              <input
                id="ticketSNOW"
                type="text"
                value={ticketSNOW}
                onChange={(e) => setTicketSNOW(e.target.value)}
                placeholder="INC123456"
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input
                id="ticketSNOWUrl"
                type="url"
                value={ticketSNOWUrl}
                onChange={(e) => setTicketSNOWUrl(e.target.value)}
                placeholder="URL du ticket SNOW"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="ticketJIRA" style={labelStyle}>
                Ticket JIRA
              </label>
              <input
                id="ticketJIRA"
                type="text"
                value={ticketJIRA}
                onChange={(e) => setTicketJIRA(e.target.value)}
                placeholder="PROJ-123"
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input
                id="ticketJIRAUrl"
                type="url"
                value={ticketJIRAUrl}
                onChange={(e) => setTicketJIRAUrl(e.target.value)}
                placeholder="URL du ticket JIRA"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="ticketMainteneur" style={labelStyle}>
                Ticket Mainteneur
              </label>
              <input
                id="ticketMainteneur"
                type="text"
                value={ticketMainteneur}
                onChange={(e) => setTicketMainteneur(e.target.value)}
                placeholder="Numéro du ticket"
                style={{ ...inputStyle, marginBottom: '0.5rem' }}
              />
              <input
                id="ticketMainteneurUrl"
                type="url"
                value={ticketMainteneurUrl}
                onChange={(e) => setTicketMainteneurUrl(e.target.value)}
                placeholder="URL du ticket mainteneur"
                style={inputStyle}
              />
            </div>
          </fieldset>

          {/* Historique */}
          <fieldset
            style={{
              border: '1px solid var(--color-neutral-beige)',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <legend style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
              📝 Historique
            </legend>
            <HistoryManager history={history} onChange={setHistory} />
          </fieldset>

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
