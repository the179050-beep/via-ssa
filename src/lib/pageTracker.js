/**
 * Page Tracker - Track visitor's current page and online status
 * Updates Firebase with real-time visitor activity
 */

import { getDatabase } from './firebaseService';
import { ref, update, set } from 'firebase/database';

let currentVisitorId = null;
let currentPage = 'home';
let inactivityTimeout = null;
let heartbeatInterval = null;

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const HEARTBEAT_INTERVAL = 30 * 1000; // 30 seconds

/**
 * Initialize page tracking for a visitor
 */
export const initializePageTracker = (visitorId) => {
  if (!visitorId) {
    console.warn('[v0] PageTracker: No visitorId provided');
    return;
  }

  currentVisitorId = visitorId;
  console.log('[v0] PageTracker initialized for visitor:', visitorId);
  
  setVisitorOnline();
  setupActivityListeners();
  startHeartbeat();
};

/**
 * Update current page (called on route change)
 */
export const updateCurrentPage = (page) => {
  currentPage = page;
  console.log('[v0] PageTracker: Updated page to:', page);
  
  if (currentVisitorId) {
    try {
      const db = getDatabase();
      const visitorRef = ref(db, `visitors/${currentVisitorId}`);
      update(visitorRef, {
        current_page: page,
        last_activity_at: new Date().toISOString(),
        online_status: 'online'
      });
      
      resetInactivityTimer();
    } catch (error) {
      console.warn('[v0] PageTracker: Error updating page:', error);
    }
  }
};

/**
 * Set visitor as online
 */
const setVisitorOnline = () => {
  if (!currentVisitorId) return;
  
  try {
    const db = getDatabase();
    const visitorRef = ref(db, `visitors/${currentVisitorId}`);
    update(visitorRef, {
      online_status: 'online',
      last_activity_at: new Date().toISOString()
    });
    console.log('[v0] PageTracker: Visitor marked as online');
  } catch (error) {
    console.warn('[v0] PageTracker: Error setting online:', error);
  }
};

/**
 * Set visitor as offline
 */
const setVisitorOffline = () => {
  if (!currentVisitorId) return;
  
  try {
    const db = getDatabase();
    const visitorRef = ref(db, `visitors/${currentVisitorId}`);
    update(visitorRef, {
      online_status: 'offline',
      last_activity_at: new Date().toISOString()
    });
    console.log('[v0] PageTracker: Visitor marked as offline');
  } catch (error) {
    console.warn('[v0] PageTracker: Error setting offline:', error);
  }
};

/**
 * Reset inactivity timer - marks as offline if no activity
 */
const resetInactivityTimer = () => {
  if (inactivityTimeout) {
    clearTimeout(inactivityTimeout);
  }
  
  inactivityTimeout = setTimeout(() => {
    console.log('[v0] PageTracker: Inactivity timeout - marking offline');
    setVisitorOffline();
  }, INACTIVITY_TIMEOUT);
};

/**
 * Setup activity listeners (mouse, keyboard, scroll)
 */
const setupActivityListeners = () => {
  const handleActivity = () => {
    console.log('[v0] PageTracker: Activity detected');
    setVisitorOnline();
    resetInactivityTimer();
  };

  window.addEventListener('mousemove', handleActivity);
  window.addEventListener('keydown', handleActivity);
  window.addEventListener('scroll', handleActivity);
  window.addEventListener('click', handleActivity);
  window.addEventListener('touchstart', handleActivity);

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[v0] PageTracker: Page hidden');
      setVisitorOffline();
    } else {
      console.log('[v0] PageTracker: Page visible');
      setVisitorOnline();
      resetInactivityTimer();
    }
  });

  // Handle unload
  window.addEventListener('beforeunload', () => {
    console.log('[v0] PageTracker: Page unloading');
    setVisitorOffline();
  });

  console.log('[v0] PageTracker: Activity listeners attached');
};

/**
 * Send heartbeat to keep visitor marked as active
 */
const startHeartbeat = () => {
  heartbeatInterval = setInterval(() => {
    if (currentVisitorId && document.hidden === false) {
      console.log('[v0] PageTracker: Sending heartbeat');
      setVisitorOnline();
    }
  }, HEARTBEAT_INTERVAL);
};

/**
 * Cleanup page tracker
 */
export const cleanupPageTracker = () => {
  console.log('[v0] PageTracker: Cleaning up');
  
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  
  window.removeEventListener('beforeunload', setVisitorOffline);
  
  setVisitorOffline();
};

export const getVisitorTrackingStatus = () => ({
  visitorId: currentVisitorId,
  currentPage,
  isOnline: true // Simplified - real status comes from Firebase
});
