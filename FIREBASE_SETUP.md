# Firebase Integration Guide for Via Riyadh

This guide will help you set up Firebase to store and display all booking and reservation data.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter a project name (e.g., "Via-Riyadh-Bookings")
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Get Firebase Configuration

1. In the Firebase Console, click the settings icon (⚙️) in the top left
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Web" to add a web app (if not already added)
5. Copy the Firebase configuration object

Your config should look like:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef...",
  measurementId: "G-ABC123..."
}
```

## Step 3: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a region closest to your users
5. Click "Enable"

## Step 4: Create Firestore Collections

Create the following collections in Firestore:

### Collections to Create:
- `bookings` - For all booking data
- `cinema_reservations` - For cinema bookings
- `dine_reservations` - For restaurant reservations
- `stay_reservations` - For hotel stay bookings
- `visitors` - For visitor tracking

You don't need to add any documents yet - they'll be created automatically when data is submitted.

## Step 5: Set Up Security Rules (Optional but Recommended)

In Firestore, go to "Rules" tab and update with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users or if in development
    match /{document=**} {
      allow read, write: if true; // Development mode - change for production
    }
  }
}
```

For production, implement proper authentication rules.

## Step 6: Configure Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.example`)
2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 7: Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to a booking page (Booking, Cinema, Dine, or Stay)
3. Complete a test booking
4. Go to `/firebase-dashboard` to view all stored data
5. Check your Firebase Console > Firestore to see the stored data

## Firebase Data Dashboard

The app includes a comprehensive Firebase dashboard at `/firebase-dashboard` that displays:

- **Summary Stats**: Total bookings, cinema reservations, dine reservations, stay reservations, and visitors
- **Charts**: Pie chart and bar chart showing distribution of reservations
- **Data Tables**: Filterable tables for each reservation type
- **Data Export**: Download all data as JSON
- **Auto-refresh**: Data refreshes every 30 seconds

### Dashboard Features:

- Filter by reservation type (All, Bookings, Cinema, Dine, Stay)
- View detailed information for each reservation
- Search and filter functionality
- Export data for analysis
- Real-time statistics

## Firebase Collections Schema

### bookings
```
{
  guest_name: string
  email: string
  phone: string
  venue_name: string
  date: string (YYYY-MM-DD)
  time: string
  guests_count: number
  notes: string
  type: string (restaurant, hotel, cinema)
  status: string (pending, confirmed, cancelled)
  bookingId: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### cinema_reservations
```
{
  movieName: string
  date: string
  time: string
  seats: number
  guestName: string
  guestEmail: string
  guestPhone: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### dine_reservations
```
{
  restaurantName: string
  date: string
  time: string
  guests: number
  guestName: string
  guestPhone: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### stay_reservations
```
{
  hotelName: string
  checkIn: string
  checkOut: string
  rooms: number
  guestName: string
  guestEmail: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### visitors
```
{
  name: string
  email: string
  phone: string
  source: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Troubleshooting

### Firebase not initialized error
- Check that all environment variables are set correctly in `.env.local`
- Ensure the `.env.local` file is in the project root
- Restart your dev server after adding env variables

### No data showing in dashboard
- Make sure you've completed a booking to create data
- Check Firebase Console > Firestore to see if collections are created
- Verify security rules allow read/write access

### CORS errors
- Firebase data should work cross-origin by default
- Check browser console for specific error messages

## Integration Files

The Firebase integration consists of:

- **`src/lib/firebaseService.js`** - Core service for database operations
- **`src/lib/firebaseConfig.js`** - Firebase initialization
- **`src/components/FirebaseDataDashboard.jsx`** - Dashboard UI
- **`.env.example`** - Environment variable template

## Next Steps

1. Set up Firebase following steps 1-6 above
2. Configure environment variables in `.env.local`
3. Test by creating a booking
4. Access `/firebase-dashboard` to view all data
5. Monitor and manage bookings through the dashboard

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
For Firestore specific help: https://firebase.google.com/docs/firestore
