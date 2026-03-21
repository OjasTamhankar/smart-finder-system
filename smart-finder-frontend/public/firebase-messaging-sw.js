importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js"
);

const searchParams = new URL(self.location.href).searchParams;
const firebaseConfig = {
  apiKey: searchParams.get("apiKey"),
  authDomain: searchParams.get("authDomain"),
  projectId: searchParams.get("projectId"),
  storageBucket: searchParams.get("storageBucket"),
  messagingSenderId: searchParams.get("messagingSenderId"),
  appId: searchParams.get("appId")
};

const hasFirebaseConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

if (hasFirebaseConfig) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(payload => {
    const title =
      payload.notification?.title || "Smart Finder Notification";
    const body =
      payload.notification?.body || "You have a new update.";
    const link = payload.data?.link || "/";

    self.registration.showNotification(title, {
      body,
      icon: "/logo192.png",
      data: {
        link
      }
    });
  });
}

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const destination = new URL(
    event.notification.data?.link || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then(clientList => {
        for (const client of clientList) {
          if ("focus" in client && client.url === destination) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(destination);
        }

        return null;
      })
  );
});
