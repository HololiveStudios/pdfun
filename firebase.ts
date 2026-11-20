// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDULf3XSwiiFQZ7q_M9YNieDbWZNLnO7Nw",
  authDomain: "myapp-415315.firebaseapp.com",
  databaseURL: "https://myapp-415315-default-rtdb.firebaseio.com",
  projectId: "myapp-415315",
  storageBucket: "myapp-415315.appspot.com",
  messagingSenderId: "103002319588",
  appId: "1:103002319588:web:cb7896f04d8948e94e1af1",
  measurementId: "G-9G7S57EJP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);