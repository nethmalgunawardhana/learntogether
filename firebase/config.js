import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// NOTE: Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your_api_key_here',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your_auth_domain_here',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id_here',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your_storage_bucket_here',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_messaging_sender_id_here',
  appId: process.env.FIREBASE_APP_ID || 'your_app_id_here',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
