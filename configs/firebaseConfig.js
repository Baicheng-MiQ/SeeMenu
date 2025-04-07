import { initializeApp } from 'firebase/app';
import { getVertexAI } from 'firebase/vertexai';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzmZCwRYBZDAAYpB-YIPXaB_YTJBYWJ7k",
    authDomain: "seemenu-524e7.firebaseapp.com",
    projectId: "seemenu-524e7",
    storageBucket: "seemenu-524e7.firebasestorage.app",
    messagingSenderId: "229273346393",
    appId: "1:229273346393:web:6a900ff3b88f6e3ccc6c48",
    measurementId: "G-P0LC7QNGKF"
  };

const app = initializeApp(firebaseConfig);
const vertexAI = getVertexAI(app);

export { app,vertexAI };