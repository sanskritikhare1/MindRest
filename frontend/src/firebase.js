import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// MindRest Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOO8XI5yRS2LXboaZgYcuvNCeJXYMOGZw",
  authDomain: "mindrest-9fca3.firebaseapp.com",
  projectId: "mindrest-9fca3",
  storageBucket: "mindrest-9fca3.firebasestorage.app",
  messagingSenderId: "743899155682",
  appId: "1:743899155682:web:510d9845ea525b2452e2bb",
  measurementId: "G-9S2JTL632E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
