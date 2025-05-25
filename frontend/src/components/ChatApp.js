import React, { useState, useEffect } from "react";
import { ChatLayout } from "./ChatLayout";
import { Auth } from "./ChatAuth";
import { AppWrapper } from "./AppWrapper";
import Cookies from "universal-cookie";
import "../styles/ChatApp.css";

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth}>
      <ChatLayout />
    </AppWrapper>
  );
}

export default ChatApp;
