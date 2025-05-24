import React, { useState, useEffect } from "react";
import { Chat } from "./Chat.js";
import { Auth } from "./ChatAuth.js";
import { AppWrapper } from "./AppWrapper.js";
import Cookies from "universal-cookie";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "../styles/ChatApp.css";

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(false);
  const [room, setRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Extract unique room names
      const uniqueRooms = Array.from(
        new Set(msgs.map((msg) => msg.room))
      ).map((roomName) => ({
        id: roomName,
        room: roomName,
      }));

      setAvailableRooms(uniqueRooms);
    });

    return () => unsubscribe();
  }, [messagesRef]);

  if (!isAuth) {
    return (
      <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="room">
          <label>Select a chat room:</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">-- Select Room --</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.room}>
                {room.room}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (room !== "") setIsInChat(true);
            }}
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
