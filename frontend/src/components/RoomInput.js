import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/RoomInput.css";

export const RoomInput = ({ onRoomAdded }) => {
  const [newRoomName, setNewRoomName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRoomName.trim() === "") return;
    
    try {
      // Instead of creating a room document, we'll just send a welcome message
      await addDoc(collection(db, "messages"), {
        text: `Room "${newRoomName}" created!`,
        createdAt: serverTimestamp(),
        user: "System",
        room: newRoomName
      });
      
      setNewRoomName("");
      if (onRoomAdded) onRoomAdded();
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="room-input-form">
      <input
        type="text"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        placeholder="Create new room..."
        className="room-input"
      />
      <button type="submit" className="room-add-button">
        +
      </button>
    </form>
  );
};