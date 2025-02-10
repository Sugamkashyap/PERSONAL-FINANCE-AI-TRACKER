import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8WvIBfoorkJ9gwfYx0EvE4pri4X1Axcw",
  authDomain: "personal-finance-ai-tracker.firebaseapp.com",
  projectId: "personal-finance-ai-tracker",
  storageBucket: "personal-finance-ai-tracker.firebasestorage.app",
  messagingSenderId: "325530367689",
  appId: "1:325530367689:web:10e5400c2136d6d4e73f18",
  measurementId: "G-VPH30SB2Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Only initialize analytics if window is available (browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
