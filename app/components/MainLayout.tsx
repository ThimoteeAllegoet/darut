'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import AlertModal from './AlertModal';
import FeedbackModal from './FeedbackModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <Sidebar onLoginClick={() => setIsLoginModalOpen(true)} />
      <main
        style={{
          marginLeft: '250px',
          minHeight: '100vh',
          backgroundColor: '#f4f6f8',
        }}
      >
        {children}
      </main>

      {/* Feedback button - only visible in read mode */}
      {!isAuthenticated && (
        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'var(--color-secondary-blue)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '50px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(64, 107, 222, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 100,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2f4fb5';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>feedback</span>
          Feedback
        </button>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <AlertModal />
    </>
  );
}
