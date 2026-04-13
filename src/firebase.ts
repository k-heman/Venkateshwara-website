import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoLbwAO07ewvY3SLbvCsSZAaym1SyJPyo",
  authDomain: "venkateshwara-enterprise-cd9d8.firebaseapp.com",
  projectId: "venkateshwara-enterprise-cd9d8",
  storageBucket: "venkateshwara-enterprise-cd9d8.firebasestorage.app",
  messagingSenderId: "60955470693",
  appId: "1:60955470693:web:d4ab0a7bf55ed984ee4f8c",
  measurementId: "G-YESBM7PXC1"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
