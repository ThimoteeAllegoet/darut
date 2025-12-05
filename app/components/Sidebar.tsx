'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onLoginClick: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const { mode, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Anomalies', path: '/anomalies', icon: '⚠️' },
  ];

  return (
    <aside
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: 'var(--color-primary-dark)',
        color: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-primary-blue)',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0,
            color: 'var(--color-white)',
          }}
        >
          DARUT
        </h1>
        <p
          style={{
            fontSize: '0.75rem',
            margin: '0.25rem 0 0 0',
            color: 'var(--color-light-blue)',
          }}
        >
          Outils de suivi
        </p>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive ? 'var(--color-white)' : 'var(--color-light-blue)',
                backgroundColor: isActive ? 'var(--color-primary-blue)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid var(--color-secondary-blue)' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(40, 50, 118, 0.5)';
                  e.currentTarget.style.color = 'var(--color-white)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-light-blue)';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--color-primary-blue)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--color-light-blue)' }}>Mode:</span>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: isAuthenticated ? 'var(--color-secondary-yellow)' : 'var(--color-white)',
            }}
          >
            {isAuthenticated ? 'Écriture' : 'Lecture'}
          </span>
        </div>
        {isAuthenticated ? (
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'var(--color-accent-red)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a01a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-red)';
            }}
          >
            Se déconnecter
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
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
            Mode Écriture
          </button>
        )}
      </div>
    </aside>
  );
}
