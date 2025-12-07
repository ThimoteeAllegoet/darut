'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAlert } from '../hooks/useAlert';

const ALERT_SHOWN_KEY = 'darut_alert_shown_session';

export default function AlertModal() {
  const { getActiveAlert } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
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

        // Redirect to homepage if not already there
        if (pathname !== '/') {
          router.push('/');
        }
      }
    }
  }, [getActiveAlert, router, pathname]);

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
          borderRadius: '8px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '550px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          border: '2px solid var(--color-accent-red)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid var(--color-accent-red)', paddingBottom: '0.75rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--color-accent-red)' }}>emergency</span>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: 'var(--color-accent-red)',
                margin: '0',
              }}
            >
              INCIDENT MAJEUR
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-blue)', fontWeight: '500', marginTop: '0.15rem' }}>
              Depuis le {new Date(activeAlert.startDate).toLocaleDateString('fr-FR')} à{' '}
              {new Date(activeAlert.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            marginBottom: '0.75rem',
            lineHeight: '1.3',
          }}
        >
          {activeAlert.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-primary-blue)',
            marginBottom: '1rem',
            lineHeight: '1.5',
          }}
        >
          {activeAlert.description}
        </p>

        {/* Applications concernées - PROMINENT */}
        {activeAlert.concernedApplications.length > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-accent-red)',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚠️ Applications concernées
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {activeAlert.concernedApplications.map((app) => (
                <span
                  key={app}
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: 'white',
                    color: 'var(--color-accent-red)',
                    borderRadius: '6px',
                    fontWeight: '700',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grid Info - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(217, 36, 36, 0.08)',
              borderRadius: '6px',
              border: '1px solid rgba(217, 36, 36, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-accent-red)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Impact
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', lineHeight: '1.4', fontWeight: '500' }}>
              {activeAlert.impact}
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(64, 107, 222, 0.08)',
              borderRadius: '6px',
              border: '1px solid rgba(64, 107, 222, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-secondary-blue)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Population impactée
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', fontWeight: '500' }}>
              {activeAlert.affectedPopulation}
            </div>
          </div>
        </div>

        {/* SNOW Ticket */}
        {activeAlert.snowTicket && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
              Référence SNOW
            </div>
            {activeAlert.snowTicketUrl ? (
              <a
                href={activeAlert.snowTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-secondary-blue)',
                  textDecoration: 'none',
                  fontWeight: '700',
                }}
              >
                {activeAlert.snowTicket}
              </a>
            ) : (
              <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', fontWeight: '700' }}>
                {activeAlert.snowTicket}
              </div>
            )}
          </div>
        )}

        {/* Workaround */}
        {activeAlert.workaround && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              borderRadius: '6px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#15803d', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              ✓ Solution de contournement
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', lineHeight: '1.5' }}>
              {activeAlert.workaround}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            width: '100%',
            padding: '0.65rem',
            backgroundColor: 'var(--color-accent-red)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '700',
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
