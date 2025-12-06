'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useMediatheque } from '../hooks/useMediatheque';
import { ApplicationName } from '../types/mediatheque';

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

export default function MediathequePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getItemsByApp } = useMediatheque();

  const handleViewApp = (app: ApplicationName) => {
    router.push(`/mediatheque/${app.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '2rem',
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
          Médiathèque
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {applications.map((app) => {
          const itemCount = getItemsByApp(app).length;
          return (
            <div
              key={app}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
                border: '1px solid rgba(230, 225, 219, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 30, 60, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 30, 60, 0.08)';
              }}
              onClick={() => handleViewApp(app)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    margin: 0,
                  }}
                >
                  {app}
                </h3>
                {itemCount > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--color-secondary-blue)',
                      color: 'var(--color-white)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(40, 50, 118, 0.7)',
                }}
              >
                {itemCount === 0
                  ? 'Aucune rubrique'
                  : itemCount === 1
                  ? '1 rubrique'
                  : `${itemCount} rubriques`}
              </div>

              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-secondary-blue)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                  marginTop: 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2f4fb5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewApp(app);
                }}
              >
                Voir
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
