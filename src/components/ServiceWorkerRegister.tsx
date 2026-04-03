'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
    // Allow service worker in dev for testing if needed, but usually we exclude it.
    // The issue description suggested a simple registration.
    if ('serviceWorker' in navigator && window.location.hostname === 'localhost') {
        navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return null;
}
