# Firebase Integration - Setup Checklist

Use this checklist to verify your Firebase integration is complete.

---

## ✅ Phase 1: Prerequisites

- [ ] Node.js installed (v16+)
- [ ] npm installed
- [ ] Project running locally (`npm run dev`)
- [ ] Can access http://localhost:5173

---

## ✅ Phase 2: Firebase Project Setup

- [ ] Firebase account created at https://firebase.google.com
- [ ] Firebase project created (`via-riyadh-bookings`)
- [ ] Firebase project loaded successfully
- [ ] Web app added to Firebase project
- [ ] Firebase credentials copied (apiKey, projectId, etc.)

---

## ✅ Phase 3: Firestore Setup

- [ ] Firestore Database created
- [ ] Selected "Production mode"
- [ ] Selected appropriate region
- [ ] Database is active and accessible

---

## ✅ Phase 4: Environment Variables

- [ ] `.env.local` file created (copied from `.env.example`)
- [ ] `VITE_FIREBASE_API_KEY` added
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` added
- [ ] `VITE_FIREBASE_PROJECT_ID` added
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` added
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` added
- [ ] `VITE_FIREBASE_APP_ID` added
- [ ] `VITE_FIREBASE_MEASUREMENT_ID` added (optional)
- [ ] `.env.local` saved
- [ ] Dev server restarted

---

## ✅ Phase 5: Code Integration

- [ ] `src/lib/firebaseService.js` exists
- [ ] `src/lib/firebaseConfig.js` exists
- [ ] `src/components/FirebaseDataDashboard.jsx` exists
- [ ] `src/hooks/useFirebase.js` exists
- [ ] `src/App.jsx` updated with Firebase import
- [ ] `src/App.jsx` has `/firebase-dashboard` route
- [ ] `src/pages/Booking.jsx` updated to save to Firebase
- [ ] No build errors (`npm run build` succeeds)

---

## ✅ Phase 6: Testing

- [ ] Can access `/firebase-dashboard`
- [ ] Dashboard loads without errors
- [ ] Statistics cards show 0 values initially
- [ ] Charts render without errors
- [ ] Filter tabs are clickable
- [ ] Export button is visible

---

## ✅ Phase 7: Functional Testing

- [ ] Create a test booking
- [ ] Successfully complete payment (OTP: 1234)
- [ ] See success message
- [ ] Refresh dashboard
- [ ] See booking appear in statistics
- [ ] Booking visible in data table
- [ ] Can expand booking details
- [ ] Can click "View" to see full details

---

## ✅ Phase 8: Data Verification

- [ ] Check Firebase Console → Firestore
- [ ] `bookings` collection exists
- [ ] Test booking document visible
- [ ] All fields correctly saved:
  - [ ] guest_name
  - [ ] email
  - [ ] phone
  - [ ] venue_name
  - [ ] date
  - [ ] time
  - [ ] guests_count
  - [ ] type
  - [ ] status
  - [ ] createdAt
  - [ ] updatedAt

---

## ✅ Phase 9: Feature Testing

- [ ] Dashboard auto-refreshes (watch for 30-second updates)
- [ ] Filter by type (All, Bookings, Cinema, Dine, Stay)
- [ ] Search functionality works
- [ ] Export to JSON works
- [ ] Downloaded JSON file opens correctly
- [ ] Data is readable in JSON
- [ ] Manual refresh button works

---

## ✅ Phase 10: Documentation

- [ ] Read INDEX.md
- [ ] Read FIREBASE_QUICK_REF.md
- [ ] Have FIREBASE_README.md available
- [ ] Have FIREBASE_SETUP.md available
- [ ] Understand the integration architecture
- [ ] Know where to find troubleshooting help

---

## ✅ Phase 11: Additional Collections (Optional)

If you want to test all collection types:

- [ ] Create cinema reservation
- [ ] Create dine reservation
- [ ] Create stay reservation
- [ ] Verify all appear on dashboard
- [ ] Check Firebase Console for all collections

---

## ✅ Phase 12: Production Readiness

- [ ] Firestore security rules reviewed
- [ ] Understand data access restrictions
- [ ] Know how to update rules in Firebase Console
- [ ] Understand billing and quotas
- [ ] Have monitoring strategy

---

## 🚨 Common Issues (Troubleshooting)

### Dashboard Shows Empty
- [ ] Check if you created a booking
- [ ] Refresh dashboard manually
- [ ] Check browser console for errors
- [ ] Verify Firebase credentials are correct

### Cannot Access Dashboard
- [ ] Check URL: http://localhost:5173/firebase-dashboard
- [ ] Check dev server is running
- [ ] Check App.jsx has the route
- [ ] Restart dev server

### No Data Saved
- [ ] Check if booking form submitted successfully
- [ ] Check OTP is "1234"
- [ ] See success message after payment
- [ ] Check .env.local has all variables
- [ ] Check browser console for errors

### Firebase Not Initialized
- [ ] Check .env.local exists
- [ ] Check all env variables are filled
- [ ] Restart dev server
- [ ] Check browser console for specific error

---

## 📝 Notes

Use this section to note any issues or special configurations:

```
Issues Encountered:
[Write any issues you encountered during setup]

Customizations:
[Note any customizations you made]

Special Notes:
[Any other relevant information]
```

---

## 🎯 Next Steps After Verification

1. **Monitor Usage**
   - Check Firebase Console for read/write operations
   - Monitor storage usage
   - Set billing alerts

2. **Production Setup**
   - Update Firestore security rules
   - Set up authentication
   - Configure backups

3. **Enhancement**
   - Add more booking types
   - Create admin interface
   - Add user authentication
   - Implement real-time updates

4. **Optimization**
   - Monitor performance
   - Optimize queries
   - Set up indexes as needed
   - Monitor costs

---

## ✅ Completion Sign-Off

- [ ] All phases 1-12 completed
- [ ] No outstanding issues
- [ ] Dashboard fully functional
- [ ] Data successfully stored and retrieved
- [ ] Documentation reviewed
- [ ] Ready for testing/production

**Date Completed**: ___________

**Completed By**: ___________

**Notes**: ___________

---

## 📞 Support Resources

If any step fails:
1. Check FIREBASE_README.md troubleshooting section
2. Check Firebase Console for errors
3. Check browser developer console
4. Verify Firebase project is active
5. Ensure Firestore database exists

---

## 🎉 Congratulations!

If you've checked all boxes, your Firebase integration is complete and working!

Next: Create real bookings and manage them through the dashboard.

For questions, refer to the documentation files in the project root.
