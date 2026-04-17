import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv8WZcPZLEbztokiaQVc4n0V5a_46k2Jo",
  authDomain: "cv-davood-54a28.firebaseapp.com",
  projectId: "cv-davood-54a28",
  storageBucket: "cv-davood-54a28.firebasestorage.app",
  messagingSenderId: "229871578685",
  appId: "1:229871578685:web:43ccc938545a3efd254454",
  measurementId: "G-NF4V8XWVBS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
