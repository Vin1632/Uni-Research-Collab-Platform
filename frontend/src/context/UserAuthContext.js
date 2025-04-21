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
import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { firestore } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const navigate = useNavigate();

  const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logOut = () => signOut(auth);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);

      if (currentuser) {
        try {
          // 🔽 Simulated role check from localStorage (replace with backend call later)
          const role = localStorage.getItem("role");
          const isAdminSim = false; // Simulated admin status

          // 🔽 Real Firestore logic you can use later:
          /*
          const docRef = doc(firestore, "users", currentuser.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.exists() ? docSnap.data() : {};
          const role = data.role;
          const isAdminSim = data.isAdmin || false;
          */

          setIsAdmin(isAdminSim);
          setRoleSelected(!!role);

          if (!isAdminSim && !role) {
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
