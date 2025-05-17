import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../styles/notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/notifications/notification')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to load notifications', err));
  }, []);

  return (
    <main>
      <h2>Notifications</h2>
      {notifications.map((note, idx) => (
        <section key={idx}>
          <p><strong>{note.sender_email}</strong> has invited <strong>{note.collaborator_email}</strong> to collaborate on <em>{note.project_name}</em>.</p>
        </section>
      ))}
    </main>
  );
};

export default NotificationsPage;