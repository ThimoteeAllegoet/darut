'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  onLoginClick: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const { mode, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const allMenuItems = [
    { name: 'Anomalies', path: '/anomalies', icon: '🔧', adminOnly: false },
    { name: 'Clipboard', path: '/messages', icon: '📋', adminOnly: true },
    { name: 'Événements', path: '/evenements', icon: '📅', adminOnly: false },
    { name: 'Médiathèque', path: '/mediatheque', icon: '📚', adminOnly: false },
    { name: 'MESI', path: '/mesi', icon: '🚀', adminOnly: false },
    { name: 'Recherche CVM', path: '/recherche-cvm', icon: '💬', adminOnly: true },
  ];

  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAuthenticated);

  return (
    <aside
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#0f3032',
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: '0 0 0.25rem 0',
              color: 'var(--color-white)',
            }}
          >
            DARUT
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Outils de suivi
          </p>
        </div>
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
                color: isActive ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid var(--color-secondary-blue)' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--color-white)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
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
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/images/Bloc_Marque_RF_France_Travail_RVB_Horizontal_Gris.svg"
          alt="France Travail"
          width={140}
          height={32}
          style={{
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>

      <div
        style={{
          padding: '0 1.5rem 1rem 1.5rem',
        }}
      >
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
            Mode Administration
          </button>
        )}
      </div>
    </aside>
  );
}
