'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import AlertModal from './AlertModal';
import FeedbackModal from './FeedbackModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isFeedbackButtonVisible, setIsFeedbackButtonVisible] = useState(true);

  useEffect(() => {
    // Check if user has hidden the feedback button
    const hiddenUntil = localStorage.getItem('feedbackButtonHidden');
    if (hiddenUntil) {
      const hiddenDate = new Date(hiddenUntil);
      const now = new Date();
      if (now < hiddenDate) {
        setIsFeedbackButtonVisible(false);
      } else {
        // Time expired, remove the localStorage item
        localStorage.removeItem('feedbackButtonHidden');
      }
    }
  }, []);

  const handleCloseFeedback = () => {
    setIsFeedbackButtonVisible(false);
    // Hide for 24 hours (like alerts)
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    localStorage.setItem('feedbackButtonHidden', tomorrow.toISOString());
  };

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
      {!isAuthenticated && isFeedbackButtonVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(64, 107, 222, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span
              className="material-symbols-outlined"
              onClick={handleCloseFeedback}
              style={{
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Masquer le bouton Feedback pour 24h"
            >
              close
            </span>
            <div
              style={{
                width: '1px',
                height: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
            <div
              onClick={() => setIsFeedbackModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                margin: '-0.25rem -0.5rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>feedback</span>
              Feedback
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <AlertModal />
    </>
  );
}
