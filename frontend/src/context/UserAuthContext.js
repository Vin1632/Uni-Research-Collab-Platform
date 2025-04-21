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

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState(null); // Added role state
  const [roleSelected, setRoleSelected] = useState(false);
  const navigate = useNavigate();

  const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logOut = () => signOut(auth); // Role is not cleared on logout
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const saveRole = (selectedRole) => {
    setRole(selectedRole); // Save role in context state
    localStorage.setItem("role", selectedRole); // Persist role in localStorage
    setRoleSelected(true); // Mark role as selected
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);

      if (currentuser) {
        try {
          // Simulated role check from localStorage (replace with backend call later)
          const storedRole = localStorage.getItem("role");
          const isAdminSim = false; // Simulated admin status

          // Real logic you can use later:
          /*
          const docRef = doc(firestore, "users", currentuser.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.exists() ? docSnap.data() : {};
          const storedRole = data.role;
          const isAdminSim = data.isAdmin || false;
          */

          setIsAdmin(isAdminSim);
          setRole(storedRole);
          setRoleSelected(!!storedRole);

          if (!isAdminSim && !storedRole) {
            navigate("/choose-role");
          }
        } catch (err) {
          console.error("Role check error:", err);
          alert("There was a problem checking your role. Please try again.");
        }
      } else {
        setIsAdmin(false);
        setRole(null); // Clear role in context but not in localStorage
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
        role,
        roleSelected,
        setRole: saveRole, // Expose the saveRole function as setRole
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
