import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Initialize Firebase (you'll need to add your config)
let app;
let db;

export const initFirebase = (firebaseConfig) => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initFirebase first.');
  }
  return db;
};

// ═══════════════════════════════════════════════════════════════
// BOOKING SERVICE
// ═══════════════════════════════════════════════════════════════

export const addBooking = async (bookingData) => {
  try {
    const db = getDatabase();
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...bookingData };
  } catch (error) {
    console.error('[Firebase] Error adding booking:', error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const db = getDatabase();
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Firebase] Error fetching bookings:', error);
    return [];
  }
};

export const updateBooking = async (id, updates) => {
  try {
    const db = getDatabase();
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date() });
    return true;
  } catch (error) {
    console.error('[Firebase] Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const db = getDatabase();
    await deleteDoc(doc(db, 'bookings', id));
    return true;
  } catch (error) {
    console.error('[Firebase] Error deleting booking:', error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// CINEMA RESERVATION SERVICE
// ═══════════════════════════════════════════════════════════════

export const addCinemaReservation = async (reservationData) => {
  try {
    const db = getDatabase();
    const docRef = await addDoc(collection(db, 'cinema_reservations'), {
      ...reservationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...reservationData };
  } catch (error) {
    console.error('[Firebase] Error adding cinema reservation:', error);
    throw error;
  }
};

export const getCinemaReservations = async () => {
  try {
    const db = getDatabase();
    const q = query(collection(db, 'cinema_reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Firebase] Error fetching cinema reservations:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// DINE RESERVATION SERVICE
// ═══════════════════════════════════════════════════════════════

export const addDineReservation = async (reservationData) => {
  try {
    const db = getDatabase();
    const docRef = await addDoc(collection(db, 'dine_reservations'), {
      ...reservationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...reservationData };
  } catch (error) {
    console.error('[Firebase] Error adding dine reservation:', error);
    throw error;
  }
};

export const getDineReservations = async () => {
  try {
    const db = getDatabase();
    const q = query(collection(db, 'dine_reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Firebase] Error fetching dine reservations:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// STAY RESERVATION SERVICE
// ═══════════════════════════════════════════════════════════════

export const addStayReservation = async (reservationData) => {
  try {
    const db = getDatabase();
    const docRef = await addDoc(collection(db, 'stay_reservations'), {
      ...reservationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...reservationData };
  } catch (error) {
    console.error('[Firebase] Error adding stay reservation:', error);
    throw error;
  }
};

export const getStayReservations = async () => {
  try {
    const db = getDatabase();
    const q = query(collection(db, 'stay_reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Firebase] Error fetching stay reservations:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// VISITOR TRACKING SERVICE
// ═══════════════════════════════════════════════════════════════

export const addVisitor = async (visitorData) => {
  try {
    const db = getDatabase();
    const docRef = await addDoc(collection(db, 'visitors'), {
      ...visitorData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...visitorData };
  } catch (error) {
    console.error('[Firebase] Error adding visitor:', error);
    throw error;
  }
};

export const getVisitors = async () => {
  try {
    const db = getDatabase();
    const q = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Firebase] Error fetching visitors:', error);
    return [];
  }
};

export const updateVisitor = async (id, updates) => {
  try {
    const db = getDatabase();
    const docRef = doc(db, 'visitors', id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date() });
    return true;
  } catch (error) {
    console.error('[Firebase] Error updating visitor:', error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// BULK STATS SERVICE
// ═══════════════════════════════════════════════════════════════

export const getAllStats = async () => {
  try {
    const [bookings, cinemaReservations, dineReservations, stayReservations, visitors] = await Promise.all([
      getBookings(),
      getCinemaReservations(),
      getDineReservations(),
      getStayReservations(),
      getVisitors(),
    ]);

    return {
      bookings,
      cinemaReservations,
      dineReservations,
      stayReservations,
      visitors,
      summary: {
        totalBookings: bookings.length,
        totalCinemaReservations: cinemaReservations.length,
        totalDineReservations: dineReservations.length,
        totalStayReservations: stayReservations.length,
        totalVisitors: visitors.length,
      },
    };
  } catch (error) {
    console.error('[Firebase] Error fetching all stats:', error);
    return { summary: { totalBookings: 0, totalCinemaReservations: 0, totalDineReservations: 0, totalStayReservations: 0, totalVisitors: 0 } };
  }
};
