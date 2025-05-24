// src/components/ChatLayout.js
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { RoomList } from './RoomList';
import { RoomInput } from './RoomInput';
import { Chat } from './Chat';
import '../styles/ChatLayout.css';

export const ChatLayout = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueRooms = new Set();
      snapshot.forEach((doc) => {
        const message = doc.data();
        if (message.room) {
          uniqueRooms.add(message.room);
        }
      });
      setRooms(Array.from(uniqueRooms).map(roomName => ({
        id: roomName,
        name: roomName
      })));
    });
    return () => unsubscribe();
  }, []);

  const handleRoomSelect = (roomName) => {
    setCurrentRoom(roomName);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToRooms = () => {
    setShowChat(false);
  };

  return (
    <div className="chat-layout">
      <div className={`sidebar ${isMobile && showChat ? 'mobile-hidden' : ''}`}>
        <RoomInput onRoomAdded={() => setCurrentRoom(null)} />
        <RoomList 
          rooms={rooms} 
          currentRoom={currentRoom} 
          setCurrentRoom={handleRoomSelect} 
        />
      </div>
      <div className={`main-content ${isMobile && !showChat ? 'mobile-hidden' : ''}`}>
        {isMobile && (
          <button onClick={handleBackToRooms} className="back-button">
            ← Back to rooms
          </button>
        )}
        <Chat room={currentRoom} />
      </div>
    </div>
  );
};