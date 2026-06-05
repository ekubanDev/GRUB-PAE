/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAEWbll-mv0hD9jBZR51wqfVpxxYIilVz8',
  authDomain: 'grub-pae.firebaseapp.com',
  projectId: 'grub-pae',
  storageBucket: 'grub-pae.firebasestorage.app',
  messagingSenderId: '367067097306',
  appId: '1:367067097306:web:cdb4efc41c792b85499de3',
  measurementId: 'G-K8WV720K8C',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background Notification Received:', payload);

  const { title, body, redirectUrl } = payload.data;

  if (!title || !body) {
    console.error('🚨 Missing notification payload:', payload);
    return;
  }

  const notificationOptions = {
    body,
    icon: 'https://e7.pngegg.com/pngimages/875/651/png-clipart-background-brush-texture-brush-black.png',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'rider-updated',
    data: { redirectUrl },
    actions: [{ action: 'open', title: 'View Details' }],
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(() => {
      // Otherwise, open a new window/tab
      return clients.openWindow(redirectUrl);
    })
  );
});
