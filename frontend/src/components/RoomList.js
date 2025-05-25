// RoomList.js
import React from "react";
import "../styles/RoomList.css";

export const RoomList = ({ rooms, currentRoom, setCurrentRoom }) => {
  return (
    <div className="room-list">
      {rooms.map((room) => (
        <div 
          key={room.id} 
          className={`room-item ${currentRoom === room.name ? 'active' : ''}`}
          onClick={() => setCurrentRoom(room.name)}
        >
          <span className="room-name">{room.name}</span>
        </div>
      ))}
    </div>
  );
};