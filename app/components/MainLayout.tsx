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
          <button
            onClick={handleCloseFeedback}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#D92424',
              color: 'var(--color-white)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '700',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              zIndex: 101,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b01e1e';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D92424';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Masquer le bouton Feedback pour 24h"
          >
            ×
          </button>
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            style={{
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
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <AlertModal />
    </>
  );
}
