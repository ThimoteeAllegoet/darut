'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import AlertModal from './AlertModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <Sidebar onLoginClick={() => setIsLoginModalOpen(true)} />
      <main
        style={{
          marginLeft: '250px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-off-white-1)',
        }}
      >
        {children}
      </main>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <AlertModal />
    </>
  );
}
