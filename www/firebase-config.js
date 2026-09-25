// GANTI dengan config dari Firebase Console → Project Settings → General → Your apps → Web
// Buat project gratis di https://console.firebase.google.com → Create project → Firestore Database → Create (start in test mode)
// Lalu copy config di sini, push lagi ke GitHub, PWA live akan langsung online sync
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
// Koleksi Firestore yang dipakai: budgets/{syncCode}  (1 dokumen = 1 keluarga)
// Aturan Firestore (test mode, 30 hari): allow read, write: if true;  → setelah itu ganti ke: allow read, write: if request.auth != null; atau pakai syncCode sebagai password
