import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app = null;
let db = null;

// Firebase 초기화 (환경 변수가 있을 때만)
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase credentials are not set. View count feature will not work.');
}

export { db };
