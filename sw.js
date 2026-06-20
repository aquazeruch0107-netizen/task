self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '📋 タスク管理';
  const options = {
    body: data.body || '期限が近いタスクがあります',
    icon: '/icon-512.png',
    badge: '/icon-512.png',
    tag: 'task-reminder',
    renotify: true,
    actions: [
      { action: 'open', title: 'アプリを開く' },
      { action: 'dismiss', title: '閉じる' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

