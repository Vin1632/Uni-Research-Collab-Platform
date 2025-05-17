import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { get_each_project_data, delete_project } from "../services/admin_service";

export default function ProjectDetails({ projectId, onClose, onDeleted }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await get_each_project_data(projectId);
        setProject(data);
      } catch {
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

  const isImageValid =
    project.link_image && project.link_image.trim() !== "" && !imgError;

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
      {isImageValid ? (
        <img
          src={project.link_image}
          alt={project.title}
          style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "1rem" }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eee",
          marginBottom: "1rem"
        }}>
          <FaImage size={64} color="#aaa" />
        </div>
      )}

      <h2>{project.title}</h2>
      <p><strong>Description:</strong> {project.description}</p>

      {project.author_name && <p><strong>Author:</strong> {project.author_name}</p>}
      {project.created_at && <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>}
      {project.updated_at && <p><strong>Updated At:</strong> {new Date(project.updated_at).toLocaleString()}</p>}

      <button onClick={handleDeleteProject} disabled={deleting} style={{ marginRight: "1rem" }}>
        {deleting ? "Deleting Project..." : "Delete Project"}
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
