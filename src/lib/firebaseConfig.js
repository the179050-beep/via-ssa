import { initFirebase } from '@/lib/firebaseService';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyApMHY0pn6ylcXkOkAqCWod4e9hEvnfcmk",
  authDomain: "sddfsdv-32ed7.firebaseapp.com",
  projectId: "sddfsdv-32ed7",
  storageBucket: "sddfsdv-32ed7.firebasestorage.app",
  messagingSenderId: "845847399478",
  appId: "1:845847399478:web:db644965b6675612b8dc97",
  measurementId: "G-CFP94QHC9S"
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
