import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCKRY3LJvuNX-XheDdGFZyL6mLkFVcK9CI",
    authDomain: "flappybird-d04ec.firebaseapp.com",
    databaseURL: "https://flappybird-d04ec-default-rtdb.firebaseio.com",
    projectId: "flappybird-d04ec",
    storageBucket: "flappybird-d04ec.firebasestorage.app",
    messagingSenderId: "777810991133",
    appId: "1:777810991133:web:3d538b2eec82d0b9080ef4",
    measurementId: "G-B0FCHYD6S7"
  };
  const app = initializeApp(firebaseConfig);
  export const database = getDatabase(app);