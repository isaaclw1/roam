// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Import additional Firebase services as needed
import { getFirestore } from "firebase/firestore"; // Firestore (Database)
import { getAuth } from "firebase/auth"; // Authentication
import { getStorage } from "firebase/storage"; // Add Storage import

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZEaBJHZ4EdPMnPFRb66moLqgHLaXAyQ8",
    authDomain: "roam-d4e81.firebaseapp.com",
    projectId: "roam-d4e81",
    storageBucket: "roam-d4e81.appspot.com",
    messagingSenderId: "149962926864",
    appId: "1:149962926864:web:76e4db13686e4af220d395",
    measurementId: "G-RJQC9QZPBC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize additional Firebase services
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Firebase Authentication
const storage = getStorage(app); // Initialize Firebase Storage

// Export initialized services
export { app, analytics, db, auth, storage };