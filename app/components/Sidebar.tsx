'use client';

import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../hooks/useAlert';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  onLoginClick: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const { mode, isAuthenticated, logout } = useAuth();
  const { getActiveAlert } = useAlert();
  const pathname = usePathname();
  const activeAlert = getActiveAlert();

  const allMenuItems = [
    { name: 'Anomalies', path: '/anomalies', icon: 'build_circle', adminOnly: false },
    { name: 'Événements', path: '/evenements', icon: 'calendar_month', adminOnly: false },
    { name: 'Chantier', path: '/chantier', icon: 'front_loader', adminOnly: true },
    { name: 'Clipboard', path: '/messages', icon: 'note_alt', adminOnly: true },
    { name: 'Médiathèque', path: '/mediatheque', icon: 'book_2', adminOnly: false },
    { name: 'MESI', path: '/mesi', icon: 'rocket_launch', adminOnly: false },
    { name: 'Recherche CVM', path: '/recherche-cvm', icon: 'forum', adminOnly: true },
    { name: 'Alerte', path: '/alerte', icon: 'report', adminOnly: true, hasIndicator: true },
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
          const showIndicator = item.hasIndicator && activeAlert;
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
                position: 'relative',
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
              <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>
                {item.icon}
              </span>
              {item.name}
              {showIndicator && (
                <span
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--color-accent-red)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px var(--color-accent-red)',
                  }}
                />
              )}
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
              backgroundColor: '#19434b',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0f2a30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#19434b';
            }}
          >
            Mode Administration
          </button>
        )}
      </div>
    </aside>
  );
}
