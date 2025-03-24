import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDusEpnwP4LGGya7RmMIIznVcp9egtjuco",
  authDomain: "pandit-now-56568.firebaseapp.com",
  projectId: "pandit-now-56568",
  storageBucket: "pandit-now-56568.firebasestorage.app",
  messagingSenderId: "555315445513",
  appId: "1:555315445513:web:c17929fc77002ddd3fddd8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collection references
export const collections = {
  users: 'users',
  pandits: 'pandits',
  bookings: 'bookings',
  reviews: 'reviews',
  messages: 'messages'
} as const;