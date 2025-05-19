import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaImage, FaCalendarAlt } from "react-icons/fa";
import { get_active_projects } from "../services/review_services";
import '../styles/ReviewerDashboard.css';
import '../styles/Dashboard.css';

export default function Review() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setUserId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectData = await get_active_projects();
        setProjects(projectData);
      } catch (err) {
        console.error("Failed to fetch active projects", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="dashboard-wrapper">
      <Header onUser_IdLoaded={setUserId} />
      
      <section className="reviewer-dashboard-container">
        {isLoading ? (
          <p className="reviewer-loading">Loading active projects...</p>
        ) : projects.length === 0 ? (
          <p className="reviewer-no-projects">No active projects available for review.</p>
        ) : (
          projects.map(project => (
            <ProjectCard
              key={project.project_id}
              project={project}
              onClick={() => navigate(`/review/${project.project_id}`, { state: { project_id: project.project_id } })}
            />
          ))
        )}
      </section>
    </main>
  );
}

function ProjectCard({ project, onClick }) {
  const [imgError, setImgError] = useState(false);
  const isImageValid = project.link_image && project.link_image.trim() !== "" && !imgError;
  const daysRemaining = Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24));
  const endingSoon = daysRemaining <= 3;

  return (
    <article 
      className={`reviewer-card${endingSoon ? ' ending-soon' : ''}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Review project: ${project.title}`}
    >
      {isImageValid ? (
        <img
          src={project.link_image}
          onError={() => setImgError(true)}
          alt={project.title}
          className="reviewer-project-image"
        />
      ) : (
        <figure className="reviewer-project-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </figure>
      )}
      <section className="reviewer-card-details">
        <header>
          <h3 className="reviewer-card-title">{project.title}</h3>
          <p className="reviewer-card-summary">{project.description || project.requirements}</p>
        </header>
        <ul className="reviewer-project-meta" style={{listStyle: "none", padding: 0, margin: 0}}>
          <li><strong>By:</strong> {project.creator_name || "Unknown"}</li>
          <li><strong>Collaborators:</strong> {project.collaborator_count ?? 0}</li>
          {project.funding_source && (
            <li className="reviewer-project-funding-source">
              Source: {project.funding_source}
            </li>
          )}
        </ul>
        <p className={`reviewer-project-deadline${endingSoon ? ' urgent' : ''}`}>
          <FaCalendarAlt /> {daysRemaining > 0 ? 
            `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining` : 
            'Ending soon'}
        </p>
        {project.funds && (
          <p className="reviewer-project-funding">Funding: R{project.funds.toLocaleString()}</p>
        )}
        <footer>
          <button
            className="reviewer-review-btn"
            onClick={e => {
              e.stopPropagation();
              onClick();
            }}
          >
            Review
          </button>
        </footer>
      </section>
    </article>
  );
}