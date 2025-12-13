'use client';

import { useState, useEffect } from 'react';
import { Anomaly, ApplicationName, AnomalyStatus, HistoryEntry, SupportEntity } from '../types/anomaly';
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
  const [status, setStatus] = useState<AnomalyStatus[]>([]);
  const [supportEntity, setSupportEntity] = useState<SupportEntity | undefined>(undefined);

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

  // Workaround
  const [hasWorkaround, setHasWorkaround] = useState(false);
  const [workaroundText, setWorkaroundText] = useState('');
  const [workaroundUrl, setWorkaroundUrl] = useState('');

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (anomaly) {
      setTitle(anomaly.title);
      setDescription(anomaly.description);
      setStatus(anomaly.status || []);
      setSupportEntity(anomaly.supportEntity);
      setAppearanceDate(anomaly.appearanceDate || '');
      setCorrectionDate(anomaly.correctionDate || '');
      setDeliveryDate(anomaly.deliveryDate || '');
      setTicketSNOW(anomaly.ticketSNOW || '');
      setTicketSNOWUrl(anomaly.ticketSNOWUrl || '');
      setTicketJIRA(anomaly.ticketJIRA || '');
      setTicketJIRAUrl(anomaly.ticketJIRAUrl || '');
      setTicketMainteneur(anomaly.ticketMainteneur || '');
      setTicketMainteneurUrl(anomaly.ticketMainteneurUrl || '');
      setHasWorkaround(anomaly.hasWorkaround || false);
      setWorkaroundText(anomaly.workaroundText || '');
      setWorkaroundUrl(anomaly.workaroundUrl || '');
      setHistory(anomaly.history || []);
    } else {
      resetForm();
    }
  }, [anomaly, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus([]);
    setSupportEntity(undefined);
    setAppearanceDate('');
    setCorrectionDate('');
    setDeliveryDate('');
    setTicketSNOW('');
    setTicketSNOWUrl('');
    setTicketJIRA('');
    setTicketJIRAUrl('');
    setTicketMainteneur('');
    setTicketMainteneurUrl('');
    setHasWorkaround(false);
    setWorkaroundText('');
    setWorkaroundUrl('');
    setHistory([]);
    setShowHistory(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      supportEntity,
      appearanceDate,
      correctionDate,
      deliveryDate,
      ticketSNOW,
      ticketSNOWUrl,
      ticketJIRA,
      ticketJIRAUrl,
      ticketMainteneur,
      ticketMainteneurUrl,
      hasWorkaround,
      workaroundText,
      workaroundUrl,
      history,
    });
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleStatus = (s: AnomalyStatus) => {
    setStatus((prev) =>
      prev.includes(s) ? prev.filter((st) => st !== s) : [...prev, s]
    );
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '2px solid var(--color-neutral-beige)',
    borderRadius: '4px',
    fontSize: '0.85rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.25rem',
    fontSize: '0.8rem',
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
          padding: '1.5rem',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.25rem',
            color: 'var(--color-primary-dark)',
          }}
        >
          {anomaly ? 'Modifier' : 'Nouvelle anomalie'} - {applicationName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.75rem' }}>
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

          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="description" style={labelStyle}>
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={labelStyle}>Statuts</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: status.includes(s)
                      ? 'var(--color-secondary-blue)'
                      : 'var(--color-light-blue)',
                    color: status.includes(s) ? 'var(--color-white)' : 'var(--color-primary-dark)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Support entity (for Bandeau only) */}
          {applicationName === 'Bandeau' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Responsabilité</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSupportEntity('France Travail')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: supportEntity === 'France Travail'
                      ? 'var(--color-secondary-blue)'
                      : 'var(--color-light-blue)',
                    color: supportEntity === 'France Travail' ? 'var(--color-white)' : 'var(--color-primary-dark)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  France Travail
                </button>
                <button
                  type="button"
                  onClick={() => setSupportEntity('ODIGO')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: supportEntity === 'ODIGO'
                      ? 'var(--color-secondary-blue)'
                      : 'var(--color-light-blue)',
                    color: supportEntity === 'ODIGO' ? 'var(--color-white)' : 'var(--color-primary-dark)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  ODIGO
                </button>
              </div>
            </div>
          )}

          {/* Dates en ligne */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label htmlFor="appearanceDate" style={labelStyle}>
                📅 Apparition
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
                📅 Correction
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
                📅 Livraison
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

          {/* Tickets compacts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <label htmlFor="ticketSNOW" style={labelStyle}>
                🎫 SNOW
              </label>
              <input
                id="ticketSNOW"
                type="text"
                value={ticketSNOW}
                onChange={(e) => setTicketSNOW(e.target.value)}
                placeholder="INC123"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ticketSNOWUrl" style={labelStyle}>
                URL
              </label>
              <input
                id="ticketSNOWUrl"
                type="url"
                value={ticketSNOWUrl}
                onChange={(e) => setTicketSNOWUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="ticketJIRA" style={labelStyle}>
                🎫 JIRA
              </label>
              <input
                id="ticketJIRA"
                type="text"
                value={ticketJIRA}
                onChange={(e) => setTicketJIRA(e.target.value)}
                placeholder="PROJ-123"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ticketJIRAUrl" style={labelStyle}>
                URL
              </label>
              <input
                id="ticketJIRAUrl"
                type="url"
                value={ticketJIRAUrl}
                onChange={(e) => setTicketJIRAUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="ticketMainteneur" style={labelStyle}>
                🎫 Mainteneur
              </label>
              <input
                id="ticketMainteneur"
                type="text"
                value={ticketMainteneur}
                onChange={(e) => setTicketMainteneur(e.target.value)}
                placeholder="MT-456"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="ticketMainteneurUrl" style={labelStyle}>
                URL
              </label>
              <input
                id="ticketMainteneurUrl"
                type="url"
                value={ticketMainteneurUrl}
                onChange={(e) => setTicketMainteneurUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          </div>

          {/* Workaround section */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                id="hasWorkaround"
                type="checkbox"
                checked={hasWorkaround}
                onChange={(e) => setHasWorkaround(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '0.5rem',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="hasWorkaround"
                style={{
                  ...labelStyle,
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                Possède une solution de contournement
              </label>
            </div>

            {hasWorkaround && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '4px', backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="workaroundText" style={labelStyle}>
                    Description de la solution
                  </label>
                  <textarea
                    id="workaroundText"
                    value={workaroundText}
                    onChange={(e) => setWorkaroundText(e.target.value)}
                    rows={2}
                    placeholder="Décrivez la solution de contournement..."
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label htmlFor="workaroundUrl" style={labelStyle}>
                    Lien vers la solution
                  </label>
                  <input
                    id="workaroundUrl"
                    type="url"
                    value={workaroundUrl}
                    onChange={(e) => setWorkaroundUrl(e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Historique collapsable */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'var(--color-light-beige)',
                color: 'var(--color-primary-dark)',
                border: '1px solid var(--color-neutral-beige)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>📝 Historique ({history.length})</span>
              <span>{showHistory ? '▼' : '▶'}</span>
            </button>
            {showHistory && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', border: '1px solid var(--color-neutral-beige)', borderRadius: '4px' }}>
                <HistoryManager history={history} onChange={setHistory} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
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
              type="submit"
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
              {anomaly ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
