import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Import AsyncStorage pour activer la persistance automatique
import '@react-native-async-storage/async-storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjIlDL6xDBNxE5XvN0cX598srDJIvDZmw",
  authDomain: "app-recette-311d8.firebaseapp.com",
  projectId: "app-recette-311d8",
  storageBucket: "app-recette-311d8.firebasestorage.app",
  messagingSenderId: "1078584930593",
  appId: "1:1078584930593:web:4177c87c3d6ae4116e4e60",
  measurementId: "G-W7CXCT88Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;