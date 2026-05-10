import { useState, useEffect } from 'react';
import {
  getBookings,
  getCinemaReservations,
  getDineReservations,
  getStayReservations,
  getVisitors,
  getAllStats,
} from './firebaseService';

/**
 * Hook to fetch all Firebase stats
 * @returns {{ data: object, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const stats = await getAllStats();
      setData(stats);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseStats] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch: fetchStats };
};

/**
 * Hook to fetch bookings
 * @returns {{ bookings: array, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseBookings] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { bookings, loading, error, refetch: fetch };
};

/**
 * Hook to fetch cinema reservations
 * @returns {{ cinemaReservations: array, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseCinemaReservations = () => {
  const [cinemaReservations, setCinemaReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getCinemaReservations();
      setCinemaReservations(data);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseCinemaReservations] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { cinemaReservations, loading, error, refetch: fetch };
};

/**
 * Hook to fetch dine reservations
 * @returns {{ dineReservations: array, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseDineReservations = () => {
  const [dineReservations, setDineReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getDineReservations();
      setDineReservations(data);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseDineReservations] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { dineReservations, loading, error, refetch: fetch };
};

/**
 * Hook to fetch stay reservations
 * @returns {{ stayReservations: array, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseStayReservations = () => {
  const [stayReservations, setStayReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getStayReservations();
      setStayReservations(data);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseStayReservations] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { stayReservations, loading, error, refetch: fetch };
};

/**
 * Hook to fetch visitors
 * @returns {{ visitors: array, loading: boolean, error: error|null, refetch: function }}
 */
export const useFirebaseVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getVisitors();
      setVisitors(data);
      setError(null);
    } catch (err) {
      console.error('[useFirebaseVisitors] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { visitors, loading, error, refetch: fetch };
};
