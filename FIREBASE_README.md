# Firebase Integration for Via Riyadh

This document provides a complete step-by-step guide to set up Firebase for storing and managing all booking and reservation data for the Via Riyadh application.

## 📋 Quick Start

1. **Create Firebase Project** → 2. **Get Credentials** → 3. **Add to .env.local** → 4. **Test Dashboard**

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"** (or use existing project)
3. Enter project name: `via-riyadh-bookings`
4. Choose region
5. Accept terms and click **"Create project"**
6. Wait for setup to complete (usually 1-2 minutes)

### Step 2: Get Firebase Configuration

1. In Firebase Console, click settings icon ⚙️ → **"Project Settings"**
2. Go to **"Your apps"** section
3. If no app exists, click **"Web"** icon to add web app
4. Copy the Firebase config (it should include apiKey, authDomain, projectId, etc.)

Example configuration:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "via-riyadh.firebaseapp.com",
  projectId: "via-riyadh",
  storageBucket: "via-riyadh.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc...",
  measurementId: "G-ABC123"
}
```

### Step 3: Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create Database"**
3. Select **"Start in production mode"**
4. Choose region closest to your users
5. Click **"Enable"**

### Step 4: Create Collections

Firestore collections are created automatically when data is saved. The app will create:
- `bookings`
- `cinema_reservations`
- `dine_reservations`
- `stay_reservations`
- `visitors`

### Step 5: Configure Environment Variables

1. In your project root, create or update `.env.local`:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=via-riyadh.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=via-riyadh
VITE_FIREBASE_STORAGE_BUCKET=via-riyadh.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc...
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

3. **Restart** your development server to load new environment variables

### Step 6: Test the Setup

1. Start your dev server:
```bash
npm run dev
```

2. Open browser and navigate to booking pages:
   - http://localhost:5173/Booking
   - http://localhost:5173/Cinema
   - http://localhost:5173/Dine
   - http://localhost:5173/Stay

3. Complete a test booking and proceed to payment

4. Open Firebase Dashboard:
   - http://localhost:5173/firebase-dashboard

5. You should see your test booking in the dashboard!

6. Verify in Firebase Console:
   - Go to Firestore Database
   - You should see `bookings` collection with your test data

---

## 📊 Using the Firebase Dashboard

Access the dashboard at: **`http://localhost:5173/firebase-dashboard`**

### Dashboard Features:

**Summary Cards**
- Total bookings, cinema reservations, dine reservations, stay reservations, and visitors
- Real-time count updates

**Charts**
- Pie chart showing distribution of reservation types
- Bar chart showing total count by type

**Data Tables**
- Filter by reservation type (All, Bookings, Cinema, Dine, Stay)
- View detailed information for each reservation
- Click "view details" to expand full record

**Export Data**
- Download all data as JSON for analysis
- Timestamped files for organization

**Auto-refresh**
- Dashboard updates every 30 seconds
- Manual refresh button available

---

## 🔧 Integration Files

| File | Purpose |
|------|---------|
| `src/lib/firebaseService.js` | Core Firebase operations (CRUD) |
| `src/lib/firebaseConfig.js` | Firebase initialization |
| `src/components/FirebaseDataDashboard.jsx` | Dashboard UI component |
| `src/hooks/useFirebase.js` | React hooks for Firebase data |
| `src/pages/Booking.jsx` | Updated to save to Firebase |
| `.env.example` | Environment variable template |

---

## 📝 Data Schema

### bookings Collection
```json
{
  "guest_name": "Ahmed Mohammed",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "venue_name": "Restaurant Name",
  "date": "2024-05-15",
  "time": "19:00 PM",
  "guests_count": 4,
  "notes": "Window seat preferred",
  "type": "restaurant",
  "status": "pending",
  "bookingId": "BOOKING-1715756400000",
  "createdAt": "2024-05-15T10:00:00Z",
  "updatedAt": "2024-05-15T10:00:00Z"
}
```

### cinema_reservations Collection
```json
{
  "movieName": "Mortal Kombat 2",
  "date": "2024-05-16",
  "time": "20:30",
  "seats": 2,
  "guestName": "Sarah Ahmed",
  "guestEmail": "sarah@example.com",
  "guestPhone": "+966501234567",
  "createdAt": "2024-05-15T10:05:00Z",
  "updatedAt": "2024-05-15T10:05:00Z"
}
```

Similarly for `dine_reservations`, `stay_reservations`, and `visitors`.

---

## 🪝 Using React Hooks

The app includes custom React hooks to fetch Firebase data:

```jsx
import { useFirebaseStats, useFirebaseBookings } from '@/hooks/useFirebase';

function MyComponent() {
  const { data, loading, error, refetch } = useFirebaseStats();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <p>Total Bookings: {data.summary.totalBookings}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

Available hooks:
- `useFirebaseStats()` - All data and statistics
- `useFirebaseBookings()` - Bookings only
- `useFirebaseCinemaReservations()` - Cinema reservations
- `useFirebaseDineReservations()` - Restaurant reservations
- `useFirebaseStayReservations()` - Hotel reservations
- `useFirebaseVisitors()` - Visitor data

---

## 🔐 Security Rules (Production)

For production, update Firestore security rules:

1. Go to Firestore Database → **"Rules"**
2. Replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication for reads/writes
    match /{collection=**}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For now, development mode allows all access.

---

## 🧪 Testing Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Environment variables set in `.env.local`
- [ ] Dev server restarted
- [ ] Can access `/firebase-dashboard`
- [ ] Can create a test booking
- [ ] Test booking appears in dashboard
- [ ] Test booking visible in Firebase Console > Firestore
- [ ] Can filter data by type
- [ ] Can export data as JSON

---

## 🐛 Troubleshooting

### Firebase not initialized
**Error**: `"Firebase not initialized. Call initFirebase first."`

**Solution**:
- Verify all environment variables are set in `.env.local`
- Restart dev server after adding env vars
- Check console for missing env variables

### Collections not appearing
**Error**: Collections empty in Firestore Console

**Solution**:
- Create a test booking first (collections auto-create)
- Check console for save errors
- Verify Firestore security rules allow writes

### Dashboard shows no data
**Error**: Dashboard loads but shows no data

**Solution**:
- Create a test booking
- Check if booking completed successfully (should see success message)
- Refresh dashboard (30-second auto-refresh or manual refresh button)
- Check browser console for errors

### CORS/Access errors
**Error**: "Access denied" or CORS errors

**Solution**:
- Verify Firestore security rules (see above)
- Check Firebase project ID matches env variable
- Ensure API key is correct

---

## 📞 Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Firebase Console**: https://console.firebase.google.com/
- **React Firebase**: https://react-firebase-js.com/

---

## 🎯 Next Steps

1. ✅ Complete setup following steps above
2. ✅ Create test booking to verify integration
3. ✅ Customize dashboard as needed
4. ✅ Set up production security rules
5. ✅ Monitor Firestore usage in Firebase Console
6. ✅ Set up data backups if needed

---

## 📈 Monitoring & Analytics

Monitor your Firebase usage:
1. Firebase Console → **"Usage"**
2. Check read/write operations
3. Monitor storage usage
4. Set up billing alerts if needed

---

**Last Updated**: May 2024
**Status**: Production Ready ✅
