import { getApp, getApps, initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage
} from "firebase/messaging";
import api from "./services/api";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const hasFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.projectId,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
  process.env.REACT_APP_FIREBASE_VAPID_KEY
].every(Boolean);

const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

let messagingInstance = null;

const getStoredAuthToken = () =>
  typeof window === "undefined"
    ? null
    : localStorage.getItem("token");

const clearLocalPushTokenCache = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("fcmToken");
  localStorage.removeItem("savedFcmToken");
};

const buildServiceWorkerUrl = () => {
  const params = new URLSearchParams();

  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/firebase-messaging-sw.js?${params.toString()}`;
};

const getMessagingInstance = async () => {
  if (!firebaseApp) {
    return null;
  }

  const supported = await isSupported().catch(() => false);

  if (!supported) {
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }

  return messagingInstance;
};

const registerMessagingServiceWorker = async () => {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !hasFirebaseConfig
  ) {
    return null;
  }

  return navigator.serviceWorker.register(buildServiceWorkerUrl());
};

const clearPushTokenOnServer = async () => {
  if (!getStoredAuthToken()) {
    clearLocalPushTokenCache();
    return;
  }

  try {
    await api.post("/api/users/save-fcm-token", {
      fcmToken: ""
    });
  } catch (error) {
    console.error("Failed to clear stored push token:", error);
  } finally {
    clearLocalPushTokenCache();
  }
};

const requestFcmToken = async () => {
  if (
    !getStoredAuthToken() ||
    !hasFirebaseConfig ||
    typeof window === "undefined" ||
    !("Notification" in window)
  ) {
    return null;
  }

  if (Notification.permission === "denied") {
    return null;
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const messaging = await getMessagingInstance();
  const serviceWorkerRegistration =
    await registerMessagingServiceWorker();

  if (!messaging || !serviceWorkerRegistration) {
    return null;
  }

  return getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration
  });
};

export const clearStoredPushNotificationToken = async () => {
  try {
    const messaging = await getMessagingInstance();

    if (messaging) {
      await deleteToken(messaging).catch(error => {
        console.error("Failed to delete browser push token:", error);
      });
    }
  } finally {
    await clearPushTokenOnServer();
  }
};

export const initializePushNotifications = async () => {
  try {
    if (!getStoredAuthToken()) {
      clearLocalPushTokenCache();
      return null;
    }

    const fcmToken = await requestFcmToken();

    if (!fcmToken) {
      await clearPushTokenOnServer();
      return null;
    }

    localStorage.setItem("fcmToken", fcmToken);

    const savedFcmToken = localStorage.getItem("savedFcmToken");

    if (savedFcmToken === fcmToken) {
      return fcmToken;
    }

    await api.post("/api/users/save-fcm-token", { fcmToken });
    localStorage.setItem("savedFcmToken", fcmToken);

    return fcmToken;
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
    return null;
  }
};

export const subscribeToForegroundMessages = async callback => {
  const messaging = await getMessagingInstance();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, payload => {
    callback?.(payload);
  });
};
