# Real-Time Booking Step Tracking

## Overview
The dashboard now shows real-time updates as users progress through each booking step. Every step submission updates the visitor's current page on the dashboard instantly.

## How It Works

### Step Tracking Flow
1. **User visits Booking page**
   - `updateCurrentPage('booking-step-1')` is called
   - Dashboard shows visitor on "الحجز - الخطوة 1" (Booking Step 1)
   - Visitor marked as "online" with green indicator

2. **User fills Step 1 (تفاصيل الحجز) and clicks "المتابعة للدفع"**
   - `updateCurrentPage('booking-step-2')` is called
   - Dashboard updates instantly to "الحجز - الخطوة 2"
   - Visitor continues seeing green online status

3. **User fills Step 2 (بيانات الدفع) and clicks "تأكيد بيانات البطاقة"**
   - `updateCurrentPage('booking-step-3')` is called
   - Dashboard updates to "الحجز - الخطوة 3"
   - Shows "تأكيد الدفع" (OTP verification step)

4. **User completes OTP verification**
   - Booking submitted
   - Visitor still on "booking-step-3"
   - Can view booking details on dashboard

### Real-Time Dashboard Updates
- **Active Visitors Widget**: Shows current page for each visitor
- **Bookings Table**: "Current Page" column updates as user navigates
- **Last Activity**: Updated with each page change
- **Status Indicator**: Remains green (online) during active booking

## Testing Real-Time Step Tracking

### Setup
1. Open two browser windows/tabs side-by-side
2. Tab 1: Dashboard (`http://localhost:5173/firebase-dashboard`)
3. Tab 2: Booking (`http://localhost:5173/Booking`)

### Test: Watch Step 1 → Step 2 Transition
```
Tab 1 (Dashboard):
- Opens with Active Visitors: 0

Tab 2 (Booking):
- User visits page
- Dashboard Tab 1 updates: Active Visitors: 1, Page: "الحجز - الخطوة 1"

Tab 2 (Booking):
- User fills Step 1 (name, phone, venue, date, time)
- User clicks "المتابعة للدفع"

Tab 1 (Dashboard):
- Instantly updates: Page: "الحجز - الخطوة 2"
- Last Activity: "للتو" (just now)
- Green online indicator active
```

### Test: Watch Step 2 → Step 3 Transition
```
Tab 2 (Booking):
- User on Step 2 (Payment Details)
- Fills card info (card number, name, expiry, CVV)
- Clicks "تأكيد بيانات البطاقة"

Tab 1 (Dashboard):
- Instantly updates: Page: "الحجز - الخطوة 3"
- Status badge changes to blue (Step 3)
- Still shows as "online"
```

### Test: Complete Booking Submission
```
Tab 2 (Booking):
- On Step 3 (OTP Verification)
- Enters OTP: 1234
- Booking submitted successfully

Tab 1 (Dashboard):
- Green alert appears: "حجز جديد! البيانات تحدثت تلقائياً"
- New booking appears in table
- Visitor stays on "booking-step-3" page
```

## Page Tracking Levels

The system tracks these booking pages:

| Page | Display Name | Description |
|------|---|---|
| booking-step-1 | الحجز - الخطوة 1 | Booking Details Form |
| booking-step-2 | الحجز - الخطوة 2 | Payment Information |
| booking-step-3 | الحجز - الخطوة 3 | OTP Verification |
| cinema | السينما | Cinema Page |
| dine | المطاعم | Restaurant Page |
| stay | الإقامة | Hotel/Stay Page |
| home | الرئيسية | Home Page |
| dashboard | لوحة التحكم | Admin Dashboard |

## Dashboard Display

### Active Visitors Widget Shows:
- Visitor name
- **Current page** (e.g., "الحجز - الخطوة 2")
- Online status (green pulsing dot)
- Last activity time

### Bookings Table Shows:
- All booking columns
- **Current Page column** - Shows latest page visitor was on
- **Online Status column** - Green for online, gray for offline
- **Last Activity column** - Time since last activity

## Implementation Details

### Code Changes

**File: src/pages/Booking.jsx**
- Added import: `import { updateCurrentPage } from '@/lib/pageTracker';`
- Step 1 submit: `updateCurrentPage('booking-step-2');`
- Step 2 submit: `updateCurrentPage('booking-step-3');`
- Initial load: `updateCurrentPage('booking-step-1');`

**File: src/lib/pageTracker.js**
- Uses Firebase Realtime Database
- Updates `visitors/{visitorId}` with:
  - `current_page`: String
  - `last_activity_at`: Timestamp
  - `online_status`: "online" or "offline"

### Firebase Collection Update
```javascript
visitors: {
  VISITOR-123: {
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    phone: "+966...",
    current_page: "booking-step-2",    // Updated on step submit
    online_status: "online",           // Updated on step submit
    last_activity_at: "2026-05-10T...", // Updated on step submit
    created_at: "2026-05-10T...",
    updated_at: "2026-05-10T..."
  }
}
```

## Timing

- **Instant Updates**: Page change recorded immediately
- **Dashboard Refresh**: Real-time Firestore listener (< 1 second)
- **Last Activity**: Updated with each page change
- **Offline Timeout**: 5 minutes of inactivity

## Features

- Tracks every step transition
- Shows real-time updates on dashboard
- No page refresh needed
- Visitor can see current progress in Active Visitors widget
- Admin can monitor user flow through booking process
- All data persisted to Firebase

## Troubleshooting

**Dashboard not showing current page?**
- Refresh dashboard tab
- Check Firebase connection (green dot in header)
- Verify visitor has accepted page tracking

**Page doesn't update when switching steps?**
- Check browser console for errors
- Verify Firebase is initialized
- Check network tab for updates to Firebase

**Visitor shows offline too quickly?**
- Adjust `INACTIVITY_TIMEOUT` in `src/lib/pageTracker.js`
- Default is 5 minutes
- Heartbeat sends every 30 seconds

## Future Enhancements

- Track time spent on each step
- Show funnel analysis (how many complete each step)
- Alert when user abandons booking
- Send notifications on step completion
- Export step tracking data
