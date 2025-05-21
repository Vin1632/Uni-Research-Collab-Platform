// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // authentication 
import { getStorage } from "firebase/storage"; //Storing files inside firebase
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCVsaQBbAuCKrwENI-8KX18YK6sv_AspAk",
  authDomain: "test-1be72.firebaseapp.com",
  databaseURL: "https://test-1be72-default-rtdb.firebaseio.com",
  projectId: "test-1be72",
  storageBucket: "test-1be72.appspot.com",
  messagingSenderId: "658818933119",
  appId: "1:658818933119:web:ead7049c2f4a3226adba4a"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
export const db = getFirestore(app);

export {storage,app, auth};