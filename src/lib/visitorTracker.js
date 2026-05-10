import { addVisitor, getVisitors } from "@/lib/firebaseService";

const VISITOR_KEY = "via_visitor_id";

export async function trackVisitor() {
  const visitorId = localStorage.getItem(VISITOR_KEY);

  if (visitorId) {
    // Already registered — visitor stored in local storage
    return visitorId;
  }

  // New visitor — create record in Firebase
  try {
    const visitorRecord = {
      full_name: "زائر مجهول",
      email: "",
      phone: "",
      online_status: "online",
      last_seen: new Date().toISOString(),
    };
    
    const doc = await addVisitor(visitorRecord);
    const newVisitorId = doc.id;
    
    if (newVisitorId) {
      localStorage.setItem(VISITOR_KEY, newVisitorId);
      return newVisitorId;
    }
  } catch (error) {
    console.warn('[v0] Error tracking visitor:', error.message);
  }
  
  return null;
}

export async function markVisitorOffline() {
  const visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) return;
  
  try {
    // Firebase doesn't require explicit offline marking, but we log it
    console.log('[v0] Visitor marked offline:', visitorId);
  } catch (error) {
    console.warn('[v0] Error marking visitor offline:', error.message);
  }
}

export async function updateVisitorFromBooking(bookingData) {
  const visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    // If no visitor ID, create one from booking data
    try {
      const visitorRecord = {
        full_name: bookingData.guest_name || "زائر",
        phone: bookingData.phone || "",
        email: bookingData.email || "",
        online_status: "active",
        last_seen: new Date().toISOString(),
      };
      
      const doc = await addVisitor(visitorRecord);
      localStorage.setItem(VISITOR_KEY, doc.id);
    } catch (error) {
      console.warn('[v0] Error creating visitor from booking:', error.message);
    }
    return;
  }
  
  // Firebase listeners already track this, so we just log it
  console.log('[v0] Visitor updated from booking:', {
    visitorId,
    name: bookingData.guest_name,
    email: bookingData.email,
    phone: bookingData.phone,
  });
}
