const firebaseConfig = {
    apiKey: "AIzaSyC7iJJZiM4LWuDJTYju37XvRMPOruzXPF4",
    authDomain: "devsurgeportal-7bfb1.firebaseapp.com",
    projectId: "devsurgeportal-7bfb1",
    storageBucket: "devsurgeportal-7bfb1.firebasestorage.app",
    messagingSenderId: "841977178152",
    appId: "1:841977178152:web:f90805349f0785fcf9ad1d"
};

// Initialize Firebase
// Note: We use try-catch to avoid crashing if the SDK isn't loaded yet or config is invalid
let auth;
let db;

try {
    const app = firebase.initializeApp(firebaseConfig);
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}
