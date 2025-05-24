import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import "../styles/AppWrapper.css";

const cookies = new Cookies();

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat, isInChat }) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
   
      <div className="app-container">{children}</div>
      
  );
};