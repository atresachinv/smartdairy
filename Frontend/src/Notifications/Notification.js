import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAQJP1Njxwm6Ztj1KjZwJqAyV9MV_hojq8",
  authDomain: "smartdairy-flash-notifi.firebaseapp.com",
  projectId: "smartdairy-flash-notifi",
  storageBucket: "smartdairy-flash-notifi.appspot.com",
  messagingSenderId: "558719173258",
  appId: "1:558719173258:web:b14ac07f75d83ac1d9a373",
};
const vapidKey = import.meta.env.REACT_APP_VAPID_KEY;

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize messaging
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      console.log("FCM token retrieved:", token);
      return token;
    } else if (permission === "denied") {
      console.error("User declined notification permissions.");
      throw new Error("Notification permissions denied.");
    } else {
      console.warn("Notification permission request dismissed.");
      throw new Error("Notification permission request dismissed.");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

