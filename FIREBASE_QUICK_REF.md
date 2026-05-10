# Firebase Integration - Quick Reference

## 🎯 What Was Added

### Core Firebase Services
- **firebaseService.js** - Database operations (add, read, update, delete)
- **firebaseConfig.js** - Firebase initialization
- **FirebaseDataDashboard.jsx** - Visual dashboard for all data
- **useFirebase.js** - React hooks for easy data access

### Features
✅ Store all bookings in Firestore
✅ Store all cinema reservations
✅ Store all restaurant reservations
✅ Store all hotel stays
✅ Store visitor tracking data
✅ Real-time dashboard with analytics
✅ Export data as JSON
✅ Charts and statistics
✅ Filterable data tables

---

## 🚀 Getting Started (5 Minutes)

### 1. Create Firebase Project
- Go to: https://console.firebase.google.com/
- Create new project named `via-riyadh-bookings`

### 2. Get Credentials
- Project Settings → Your apps → Web app
- Copy all config values

### 3. Add to .env.local
```bash
cp .env.example .env.local
# Fill in your Firebase credentials
```

### 4. Enable Firestore
- Firebase Console → Firestore Database → Create Database
- Select "Production mode"

### 5. Test It
```bash
npm run dev
# Visit http://localhost:5173/firebase-dashboard
# Create a test booking
# See it appear in dashboard!
```

---

## 📍 Key Files

```
src/
├── lib/
│   ├── firebaseService.js (✨ Core logic)
│   ├── firebaseConfig.js (⚙️ Setup)
│   └── firebaseHooks.js (🪝 React hooks)
├── components/
│   └── FirebaseDataDashboard.jsx (📊 Dashboard UI)
└── pages/
    └── Booking.jsx (updated to save data)

.env.example (📝 Copy to .env.local)
FIREBASE_README.md (📖 Full setup guide)
```

---

## 💡 Common Tasks

### View All Data
```
→ http://localhost:5173/firebase-dashboard
```

### Add Booking to Firebase
```javascript
import { addBooking } from '@/lib/firebaseService';

await addBooking({
  guest_name: "Ahmed",
  email: "ahmed@example.com",
  phone: "+966501234567",
  venue_name: "Restaurant",
  date: "2024-05-15",
  time: "19:00",
  guests_count: 4,
  status: "pending"
});
```

### Use Hooks in Components
```javascript
import { useFirebaseStats } from '@/hooks/useFirebase';

function MyComponent() {
  const { data, loading } = useFirebaseStats();
  return <div>{data?.summary.totalBookings}</div>;
}
```

### Export Data
- Click "Export Data (JSON)" button on dashboard
- Downloads JSON file with all bookings

---

## 🔧 Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📊 Dashboard Features

| Feature | Location | Purpose |
|---------|----------|---------|
| Summary Stats | Top cards | Total counts for all types |
| Pie Chart | Right side | Distribution visualization |
| Bar Chart | Left side | Comparison by type |
| Data Tables | Below charts | Detailed reservation info |
| Filter Tabs | Above tables | Filter by type |
| Export Button | Bottom | Download as JSON |
| Refresh | Top right | Manual data refresh |

---

## 🎯 Firestore Collections

### Auto-Created Collections
- `bookings` - All booking reservations
- `cinema_reservations` - Cinema tickets
- `dine_reservations` - Restaurant reservations
- `stay_reservations` - Hotel stays
- `visitors` - Visitor tracking

Each document has:
- `createdAt` - When created
- `updatedAt` - When last modified
- Type-specific fields

---

## ✅ Verification Checklist

- [ ] .env.local file created with credentials
- [ ] Firebase Firestore database created
- [ ] Dev server restarted
- [ ] Dashboard accessible at /firebase-dashboard
- [ ] Test booking created successfully
- [ ] Booking appears on dashboard
- [ ] Data visible in Firebase Console > Firestore

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Firebase not initialized" | Restart dev server after setting .env.local |
| No data on dashboard | Create a test booking first |
| Collections empty | Collections auto-create when data is saved |
| Can't access dashboard | Verify /firebase-dashboard route exists |
| Env variables not loading | Restart `npm run dev` |

---

## 📚 Learn More

- [Full Setup Guide](./FIREBASE_README.md)
- [Integration Details](./FIREBASE_INTEGRATION.md)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Reference](https://firebase.google.com/docs/firestore)

---

## 🎨 Using the Dashboard

### Filter Data
1. Click a filter tab (Bookings, Cinema, Dine, Stay)
2. View filtered results

### View Details
1. Click "View" button next to any row
2. See full JSON data

### Search
1. Use browser's Find function (Ctrl+F / Cmd+F)
2. Or implement custom search in dashboard

### Export Data
1. Click "Download Data (JSON)" button
2. Opens JSON download with timestamp

### Refresh Data
1. Auto-refreshes every 30 seconds
2. Or click "Refresh" button for immediate update

---

## 🔐 Production Setup

Before deploying:
1. Set production security rules in Firestore
2. Enable authentication
3. Set up data backups
4. Monitor usage and costs
5. Configure CORS if needed

See FIREBASE_README.md for production rules.

---

## 📞 Questions?

Check:
1. FIREBASE_README.md - Full setup guide
2. FIREBASE_INTEGRATION.md - Technical details
3. Firebase Console - Check your data
4. Browser console - Check for errors

---

**Version**: 1.0.0
**Last Updated**: May 2024
**Status**: Ready for Production ✅
