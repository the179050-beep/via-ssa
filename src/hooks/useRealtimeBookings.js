/**
 * Real-Time Bookings Hooks
 * Subscribe to Firestore changes and emit events
 */

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { bookingNotifications, BOOKING_EVENTS } from '@/lib/bookingNotifications';
import { getDatabase } from '@/lib/firebaseService';

export const useRealtimeBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    try {
      console.log('[v0] Setting up Firestore listener for bookings');
      setLoading(true);
      
      const db = getDatabase();
      const q = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('[v0] Firestore snapshot received, docs:', snapshot.docs.length);
          setConnected(true);
          
          const newBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setBookings(newBookings);
          setLoading(false);
          setError(null);
          
          // Emit event for new bookings
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              console.log('[v0] New booking detected:', change.doc.data());
              bookingNotifications.emit(BOOKING_EVENTS.BOOKING_CREATED, {
                id: change.doc.id,
                ...change.doc.data()
              });
            }
          });
        },
        (err) => {
          console.error('[v0] Firestore error:', err);
          setError(err.message);
          setConnected(false);
          setLoading(false);
        }
      );

      return () => {
        console.log('[v0] Cleaning up Firestore listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('[v0] Error setting up listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error, connected };
};

export const useRealtimeCinema = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const db = getDatabase();
      const q = query(
        collection(db, 'cinema_reservations'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { reservations, loading, error };
};

export const useRealtimeDine = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const db = getDatabase();
      const q = query(
        collection(db, 'dine_reservations'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { reservations, loading, error };
};

export const useRealtimeStay = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const db = getDatabase();
      const q = query(
        collection(db, 'stay_reservations'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { reservations, loading, error };
};
