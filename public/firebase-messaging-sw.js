importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCuaQAKF0pXrKWWrdRObhV158dNbIzQn4U",
  authDomain: "lynq-3ba2d.firebaseapp.com",
  projectId: "lynq-3ba2d",
  messagingSenderId: "667931253340",
  appId: "1:667931253340:web:f2905cb18779b90e222499"
});

const messaging = firebase.messaging();

/* 🔥 BACKGROUND HANDLER */
messaging.onBackgroundMessage(function (payload) {
  console.log("🔥 Background message:", payload);

  const title = payload.notification?.title || "New message";
  const body = payload.notification?.body || "";
  const url = payload.data?.url || "/chat";

  self.registration.showNotification(title, {
    body,
    icon: "/icon.png",
    badge: "/icon.png",
    data: { url },
  });
});

/* 🔥 CLICK HANDLER */
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/chat";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});