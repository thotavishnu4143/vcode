// client/src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgUwJQBY7WFMCCsrjqLAS84Fl879CAd18",
    authDomain: "vcode-1234.firebaseapp.com",
    projectId: "vcode-1234",
    storageBucket: "vcode-1234.appspot.com",
    messagingSenderId: "975914981944",
    appId: "1:975914981944:web:86ddfe971eba79e9e4e4cd",
    measurementId: "G-ETHH0S1K5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export app, db, and storage as default exports
export default app; // Default export
export { db, storage }; // Named exports
