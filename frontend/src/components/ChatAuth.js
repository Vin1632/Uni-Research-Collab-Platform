import { useUserAuth } from "../context/UserAuthContext";
//import "../styles/Auth.css";
import { useEffect } from "react";

export const Auth = ({ setIsAuth }) => {
  const { user } = useUserAuth();

  useEffect(() => {
    if (user) {
      setIsAuth(true); // Authenticated already from Login.js
    }
  }, [user, setIsAuth]);

  return (
    <div className="auth">
      {user ? (
        <p>Welcome back, {user.displayName}</p>
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </div>
  );
};
