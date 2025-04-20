import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom"; //for navigation

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const navigate = useNavigate();

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);

      if (currentuser) {
        try {
          // Simulated fetch from backend 
          const data = {
            role: null,         // e.g., 'researcher' or 'reviewer'
            isAdmin: false,     // true if user is an admin
          };

          // Real implementation might look like this:
          /*
          const docRef = doc(firestore, "users", currentuser.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.exists() ? docSnap.data() : {};
          */

          setIsAdmin(data.isAdmin);
          setRoleSelected(!!data.role);

          if (!data.isAdmin && !data.role) {
            navigate("/choose-role");
          }
        } catch (err) {
          console.error("Role check error:", err);
          alert("There was a problem checking your role. Please try again.");
        }
      } else {
        setIsAdmin(false);
        setRoleSelected(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        isAdmin,
        roleSelected,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
