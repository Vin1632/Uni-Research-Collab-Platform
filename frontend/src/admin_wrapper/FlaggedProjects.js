// src/admin_wrapper/FlaggedProjects.js
import React, { useEffect, useState } from "react";
import { get_flagged_projects, delete_flag, get_each_project_data, delete_project } from "../services/admin_service";

function ProjectDetails({ projectId, onClose, onDeleted }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await get_each_project_data(projectId);
        setProject(data);
      } catch (e) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  async function handleDeleteProject() {
    if (!window.confirm("Are you sure you want to delete this project? This action is irreversible.")) return;

    try {
      setDeleting(true);
      await delete_project(projectId);
      onDeleted();
    } catch (e) {
      alert(e.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!project) return null;

  return (
    <div className="project-details-modal" style={{
      position: "fixed",
      top: "10%",
      left: "50%",
      transform: "translateX(-50%)",
      background: "white",
      padding: "1rem",
      border: "1px solid #ccc",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
      maxWidth: "600px",
      maxHeight: "80vh",
      overflowY: "auto"
    }}>
      <h2>{project.title}</h2>
      <p><strong>Description:</strong> {project.description}</p>
      {/* Add other project details here as needed */}
      <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>
      <p><strong>Author:</strong> {project.author_name || "N/A"}</p>

      <button onClick={handleDeleteProject} disabled={deleting} style={{ marginRight: "1rem" }}>
        {deleting ? "Deleting Project..." : "Delete Project"}
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default function FlaggedProjects() {
  const [flaggedProjects, setFlaggedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    async function fetchFlagged() {
      try {
        const data = await get_flagged_projects();
        setFlaggedProjects(data);
      } catch (err) {
        setError(err.message || "Failed to fetch flagged projects");
      } finally {
        setLoading(false);
      }
    }

    fetchFlagged();
  }, []);

  async function handleDeleteFlag(flag_id) {
    if (!window.confirm("Are you sure you want to unflag/delete this entry?")) return;

    try {
      setDeletingId(flag_id);
      await delete_flag(flag_id);
      setFlaggedProjects((prev) => prev.filter((f) => f.flag_id !== flag_id));
    } catch (err) {
      alert(err.message || "Failed to delete flag");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteProject() {
    // After deleting project, remove any flags for it from the list
    setFlaggedProjects((prev) => prev.filter(f => f.project_id !== selectedProjectId));
    setSelectedProjectId(null);
  }

  if (loading) return <p>Loading flagged projects...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (flaggedProjects.length === 0) return <p>No flagged projects found.</p>;

  return (
    <div className="flagged-projects-list">
      {flaggedProjects.map(({ flag_id, project_id, reason, description, flagged_at, title }) => (
        <div key={flag_id} className="flagged-project-card" style={{border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem"}}>
          <h3>{title}</h3>
          <p><strong>Reason:</strong> {reason}</p>
          {description && <p><strong>Description:</strong> {description}</p>}
          <p><small>Flagged at: {new Date(flagged_at).toLocaleString()}</small></p>
          <button onClick={() => setSelectedProjectId(project_id)} style={{ marginRight: "0.5rem" }}>
            View Details
          </button>
          <button
            onClick={() => handleDeleteFlag(flag_id)}
            disabled={deletingId === flag_id}
            className="flag-delete-button"
          >
            {deletingId === flag_id ? "Deleting..." : "Unflag"}
          </button>
        </div>
      ))}

      {selectedProjectId && (
        <ProjectDetails
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
          onDeleted={handleDeleteProject}
        />
      )}
    </div>
  );
}
