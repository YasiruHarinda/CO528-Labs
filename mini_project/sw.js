// sw.js — Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'DECP Notification';
  const options = {
    body: data.body || 'New update from CE Department',
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'view', title: '👀 View' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// When user clicks notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if(event.action === 'dismiss') return;

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});