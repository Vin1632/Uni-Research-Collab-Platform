import React, { useEffect, useState } from "react";
import '../styles/notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedIdx, setExpandedIdx] = useState(null); 
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");  // get logged-in user's ID

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    fetch(`/notifications/notification?userId=${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to load notifications', err));
  }, []);

  const toggleDetails = async (idx, projectId) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null); // Collapse if clicked again
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
      setExpandedIdx(idx);
    }
  };

    const handleInvitationResponse = async (projectId, action) => {
    const userId = localStorage.getItem("userId");
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
            n.project_id === projectId
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
  <main>
  <h2>  Your Invitations</h2>
  {notifications.length === 0 ? (
    <p>No notifications found.</p>
  ) : (
    <ul className="notification-list">
      {notifications.map((note, idx) => (
        <li key={idx} className="notification-item">
          <p>
            <strong>{note.sender_email}</strong> has invited{" "}
            <strong>{note.collaborator_email}</strong> to collaborate on{" "}
            <em>{note.project_title}</em>.
          </p>

          <button onClick={() => toggleDetails(idx, note.project_id)}>
                {expandedIdx === idx ? "Hide Details" : "View Details"}
              </button>

          {expandedIdx === idx && projectDetails[note.project_id] && (
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
                    onClick={() => handleInvitationResponse(note.project_id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleInvitationResponse(note.project_id, 'declined')}
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