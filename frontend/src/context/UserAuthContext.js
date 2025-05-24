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
import Cookies from "universal-cookie";

const userAuthContext = createContext();
const cookies = new Cookies();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const token = result.user.refreshToken;
    cookies.set("auth-token", token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);

    return result;
  };

  // Restore user on page refresh or re-entry
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) {
        setUser(currentuser);
        localStorage.setItem("user", JSON.stringify(currentuser));
        cookies.set("auth-token", currentuser.refreshToken);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role,
        setUser,
        setRole,
        logIn,
        signUp,
        logOut,
        googleSignIn,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
