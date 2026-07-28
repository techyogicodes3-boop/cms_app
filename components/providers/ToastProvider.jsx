'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFF8ED',
          color: '#3A211E',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px #3A211E',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#C9963A',
            secondary: '#FFF8ED',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#3A211E',
            secondary: '#FFF8ED',
          },
        },
      }}
    />
  );
}
