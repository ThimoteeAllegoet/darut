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
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(64, 107, 222, 0.4)',
            borderRadius: '50px',
            overflow: 'hidden',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleCloseFeedback}
            style={{
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '0',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2f4fb5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
            }}
            title="Masquer le bouton Feedback pour 24h"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
              close
            </span>
          </button>

          {/* Feedback button */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            style={{
              backgroundColor: 'var(--color-secondary-blue)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '0',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s',
              height: '44px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2f4fb5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>feedback</span>
            Feedback
          </button>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <AlertModal />
    </>
  );
}
