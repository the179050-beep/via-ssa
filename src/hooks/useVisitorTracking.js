/**
 * useVisitorTracking Hook
 * Real-time tracking of all visitors and their current pages
 */

import { useEffect, useState } from 'react';
import { getDatabase } from '@/lib/firebaseService';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

export const useVisitorTracking = () => {
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('[v0] useVisitorTracking: Setting up listeners');
      setLoading(true);
      
      const db = getDatabase();
      
      // Listen to all visitors
      const visitorsRef = ref(db, 'visitors');
      const unsubscribe = onValue(
        visitorsRef,
        (snapshot) => {
          console.log('[v0] useVisitorTracking: Visitors snapshot received');
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            const visitors = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            
            setAllVisitors(visitors);
            
            // Filter active (online) visitors
            const active = visitors.filter(v => v.online_status === 'online')
              .sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at));
            
            setActiveVisitors(active);
            setError(null);
          } else {
            setAllVisitors([]);
            setActiveVisitors([]);
          }
          
          setLoading(false);
        },
        (err) => {
          console.error('[v0] useVisitorTracking: Error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('[v0] useVisitorTracking: Cleanup');
        unsubscribe();
      };
    } catch (err) {
      console.error('[v0] useVisitorTracking: Setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { activeVisitors, allVisitors, loading, error };
};

/**
 * Get formatted page name for display
 */
export const getPageDisplayName = (page) => {
  const pageNames = {
    'home': 'الرئيسية',
    'booking': 'الحجز',
    'booking-step-1': 'الحجز - الخطوة 1',
    'booking-step-2': 'الحجز - الخطوة 2',
    'booking-step-3': 'الحجز - الخطوة 3',
    'cinema': 'السينما',
    'dine': 'المطاعم',
    'stay': 'الإقامة',
    'dashboard': 'لوحة التحكم',
    'firebase-dashboard': 'لوحة بيانات Firebase'
  };
  
  return pageNames[page?.toLowerCase()] || page || 'غير معروف';
};

/**
 * Format time ago
 */
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'الآن';
  
  const now = new Date();
  const then = new Date(timestamp);
  const secondsAgo = Math.floor((now - then) / 1000);
  
  if (secondsAgo < 60) return 'للتو';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} دقيقة`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} ساعة`;
  return `${Math.floor(secondsAgo / 86400)} يوم`;
};
