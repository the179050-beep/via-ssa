/**
 * Real-time Booking Notification System
 * Simple event emitter for booking updates across the app
 */

const subscribers = new Map();
const eventTypes = {
  BOOKING_CREATED: 'booking:created',
  BOOKING_UPDATED: 'booking:updated',
  CINEMA_CREATED: 'cinema:created',
  DINE_CREATED: 'dine:created',
  STAY_CREATED: 'stay:created'
};

export const bookingNotifications = {
  subscribe: (eventType, callback) => {
    if (!subscribers.has(eventType)) {
      subscribers.set(eventType, []);
    }
    subscribers.get(eventType).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = subscribers.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  },
  
  emit: (eventType, data) => {
    console.log(`[v0] Emitting event: ${eventType}`, data);
    if (subscribers.has(eventType)) {
      subscribers.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[v0] Error in event callback for ${eventType}:`, error);
        }
      });
    }
  },
  
  unsubscribeAll: () => {
    subscribers.clear();
  }
};

export const BOOKING_EVENTS = eventTypes;
