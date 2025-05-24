import React, { useEffect, useState } from "react";
import '../styles/notifications.css';
import '../styles/Dashboard.css';
import Header from "../components/Header";
import { useUserAuth } from "../context/UserAuthContext";
import { get_Users } from "../services/login_service";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  const { user } = useUserAuth();

  useEffect(() => {
    const loadingNotifications = async () => {
      const userEmail = user?.email;
      if (!userEmail) return;

      try {
        const users = await get_Users(userEmail);
        if (!users?.length) {
          console.warn("No users found for email:", userEmail);
          return;
        }

        const userId = users[0]?.user_id;
        if (!userId) {
          console.error("User ID not found in fetched user data");
          return;
        }

        const response = await fetch(`/notifications/notification?userId=${userId}`);
        if (!response.ok) {
          console.error("Failed to fetch notifications, status:", response.status);
          return;
        }

        const notificationsData = await response.json();
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadingNotifications();
  }, [user]);

  const toggleDetails = async (projectId) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      if (!projectDetails[projectId]) {
        try {
          const res = await fetch(`/notifications/projects/${projectId}`);
          const data = await res.json();
          setProjectDetails((prev) => ({ ...prev, [projectId]: data }));
        } catch (err) {
          console.error("Failed to fetch project details:", err);
        }
      }
      setExpandedProjectId(projectId);
    }
  };

  const handleInvitationResponse = async (notificationId, projectId, action) => {
    const userEmail = user?.email;
    const users = await get_Users(userEmail);
    if (!users?.length) {
      console.warn("No users found for email:", userEmail);
      return;
    }

    const userId = users[0]?.user_id;
    if (!userId) {
      console.error("User ID not found in fetched user data");
      return;
    }

    try {
      const res = await fetch(`/notifications/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectId,
          action,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.notification_id === notificationId
              ? { ...n, invitation: action }
              : n
          )
        );
      } else {
        console.error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error responding to invitation:", err);
    }
  };

  return (
    <main className="dashboard-wrapper">
      <Header />
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((note) => (
            <li key={note.notification_id} className="notification-item">
              <p>
                <strong>{note.sender_email}</strong> has invited{" "}
                <strong>{note.collaborator_email}</strong> to collaborate on{" "}
                <em>{note.project_title}</em>.
              </p>

              <button onClick={() => toggleDetails(note.project_id)}>
                {expandedProjectId === note.project_id ? "Hide Details" : "View Details"}
              </button>

              {expandedProjectId === note.project_id && projectDetails[note.project_id] && (
                <div className="project-details">
                  <p><strong>Title:</strong> {projectDetails[note.project_id].title}</p>
                  <p><strong>Description:</strong> {projectDetails[note.project_id].description}</p>
                  <p><strong>Start Date:</strong> {projectDetails[note.project_id].start_date}</p>
                  <p><strong>End Date:</strong> {projectDetails[note.project_id].end_date}</p>
                  <p><strong>Created At:</strong> {new Date(projectDetails[note.project_id].created_at).toLocaleString()}</p>
                  {projectDetails[note.project_id].link_image && (
                    <img
                      src={projectDetails[note.project_id].link_image}
                      alt="Project visual"
                      style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
                    />
                  )}
                </div>
              )}

              {note.invitation?.toLowerCase?.() === 'no_res' ? (
                <div className="invitation-actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleInvitationResponse(note.notification_id, note.project_id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleInvitationResponse(note.notification_id, note.project_id, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <p><strong>Status:</strong> {note.invitation}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default NotificationsPage;
