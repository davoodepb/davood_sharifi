import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported as messagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyClBw569jLYXKWL6lr5hYl-3ppCT7_PzJg",
  authDomain: "n8n-prudencio.firebaseapp.com",
  databaseURL: "https://n8n-prudencio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "n8n-prudencio",
  storageBucket: "n8n-prudencio.firebasestorage.app",
  messagingSenderId: "397008230620",
  appId: "1:397008230620:web:a17568b43bca763719bc19",
  measurementId: "G-EJEFSVQHLD",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

export const firebaseAnalyticsPromise = analyticsSupported().then((supported) =>
  supported ? getAnalytics(firebaseApp) : null,
);

export const firebaseMessagingPromise = messagingSupported().then((supported) =>
  supported ? getMessaging(firebaseApp) : null,
);
