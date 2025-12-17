// public/service-worker.js

const CACHE_NAME = 'pill-reminder-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { pillName, dosage, delay } = event.data;
    
    // Schedule notification
    setTimeout(() => {
      const dosageText = dosage ? ` (${dosage})` : "";
      self.registration.showNotification('💊 Pill Reminder!', {
        body: `Time to take ${pillName}${dosageText}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        tag: `pill-${Date.now()}`,
        silent: false
      });
    }, delay);
  }
});

// Keep service worker alive
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});