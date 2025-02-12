import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { COLLECTIONS } from './firestore-init';

const firebaseConfig = {
  apiKey: "AIzaSyD8WvIBfoorkJ9gwfYx0EvE4pri4X1Axcw",
  authDomain: "personal-finance-ai-tracker.firebaseapp.com",
  projectId: "personal-finance-ai-tracker",
  storageBucket: "personal-finance-ai-tracker.appspot.com",
  messagingSenderId: "325530367689",
  appId: "1:325530367689:web:10e5400c2136d6d4e73f18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Initialize Auth
const auth = getAuth(app);

// Use Auth Emulator in development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, db, auth, COLLECTIONS };
