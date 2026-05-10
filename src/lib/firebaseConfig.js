import { initFirebase } from '@/lib/firebaseService';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase config
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value && value !== 'your_*');

if (isFirebaseConfigured) {
  try {
    initFirebase(firebaseConfig);
    console.log('[Firebase] Firebase initialized successfully');
  } catch (error) {
    console.error('[Firebase] Failed to initialize Firebase:', error);
  }
} else {
  console.warn('[Firebase] Firebase configuration incomplete. Please set environment variables in .env file');
}

export { firebaseConfig, isFirebaseConfigured };
