import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwtF0gGhJi5yuG2xX0WEZBAlC6myYWZmo",
    authDomain: "openedu-8e6bb.firebaseapp.com",
    projectId: "openedu-8e6bb",
    storageBucket: "openedu-8e6bb.firebasestorage.app",
    messagingSenderId: "722705888660",
    appId: "1:722705888660:web:c49e8b11f42b0b71ba0b81",
    measurementId: "G-ZCD8R5Y7B3"
  };

  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const googleProvider = new GoogleAuthProvider();
  export default app;
  
