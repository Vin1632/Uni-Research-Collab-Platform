// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // authentication 
import { getStorage } from "firebase/storage"; //Storing files inside firebase

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

require('dotenv').config();
// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDwJ8KhcJu4RoNI9X1NB1-JvBTvrPSDL4A",
//   authDomain: "uni-research-collab.firebaseapp.com",
//   projectId: "uni-research-collab",
//   storageBucket: "uni-research-collab.firebasestorage.app",
//   messagingSenderId: "342563407789",
//   appId: "1:342563407789:web:1f2e8400332ed09a104324"
// };

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId:process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const auth = getAuth(app);

export {storage,app, auth};