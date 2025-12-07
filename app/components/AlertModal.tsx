'use client';

import { useEffect, useState } from 'react';
import { useAlert } from '../hooks/useAlert';

const ALERT_SHOWN_KEY = 'darut_alert_shown_session';

export default function AlertModal() {
  const { getActiveAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);
  const [activeAlert, setActiveAlert] = useState<ReturnType<typeof getActiveAlert>>(null);

  useEffect(() => {
    // Check if alert has been shown in this session
    const hasBeenShown = sessionStorage.getItem(ALERT_SHOWN_KEY);

    if (!hasBeenShown) {
      const alert = getActiveAlert();
      if (alert) {
        setActiveAlert(alert);
        setIsVisible(true);
        sessionStorage.setItem(ALERT_SHOWN_KEY, 'true');
      }
    }
  }, [getActiveAlert]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !activeAlert) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          border: '3px solid var(--color-accent-red)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚨</div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'var(--color-accent-red)',
              margin: '0 0 0.5rem 0',
            }}
          >
            INCIDENT MAJEUR EN COURS
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)', fontWeight: '500' }}>
            Depuis le {new Date(activeAlert.startDate).toLocaleDateString('fr-FR')} à{' '}
            {new Date(activeAlert.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: 'var(--color-primary-dark)',
            marginBottom: '1rem',
          }}
        >
          {activeAlert.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-primary-blue)',
            marginBottom: '1.5rem',
            lineHeight: '1.6',
          }}
        >
          {activeAlert.description}
        </p>

        {/* Grid Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(217, 36, 36, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(217, 36, 36, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-accent-red)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Impact
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', lineHeight: '1.5' }}>
              {activeAlert.impact}
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(64, 107, 222, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(64, 107, 222, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-secondary-blue)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Population impactée
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
              {activeAlert.affectedPopulation}
            </div>
          </div>

          {activeAlert.concernedApplications.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Applications concernées
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeAlert.concernedApplications.map((app) => (
                  <span
                    key={app}
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.35rem 0.75rem',
                      backgroundColor: 'var(--color-accent-red)',
                      color: 'var(--color-white)',
                      borderRadius: '20px',
                      fontWeight: '600',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeAlert.snowTicket && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Référence SNOW
              </div>
              {activeAlert.snowTicketUrl ? (
                <a
                  href={activeAlert.snowTicketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-secondary-blue)',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}
                >
                  {activeAlert.snowTicket}
                </a>
              ) : (
                <div style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', fontWeight: '700' }}>
                  {activeAlert.snowTicket}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Workaround */}
        {activeAlert.workaround && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Solution de contournement
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', lineHeight: '1.6' }}>
              {activeAlert.workaround}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--color-accent-red)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B81D1D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
          }}
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
}
