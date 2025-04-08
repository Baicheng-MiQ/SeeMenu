import { initializeApp } from 'firebase/app';
import { getVertexAI } from 'firebase/vertexai';

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "seemenu-524e7.firebaseapp.com",
    projectId: "seemenu-524e7",
    storageBucket: "seemenu-524e7.firebasestorage.app",
    messagingSenderId: "229273346393",
    appId: "1:229273346393:web:8a33d3ecef77ffa2cc6c48",
    measurementId: "G-ZY30DDS170"
  };

const app = initializeApp(firebaseConfig);
const vertexAI = getVertexAI(app);

export { app,vertexAI };