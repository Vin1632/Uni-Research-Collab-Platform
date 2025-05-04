import React from "react";

const ProjectCard = ({ project }) => {
  const fundsValid = project.funds !== null && project.funds !== undefined;
  const spentValid = project.funds_spent !== null && project.funds_spent !== undefined;

  return (
    <article className="proposal-card">
      <header>
        <h2 className="proposal-title">{project.title}</h2>
      </header>
      <section className="proposal-details">
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Start:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
        <p><strong>Funds Allocated:</strong> {fundsValid ? `R${project.funds}` : 'N/A'}</p>
        <p><strong>Funds Spent:</strong> {spentValid ? `R${project.funds_spent}` : 'N/A'}</p>

        {fundsValid && spentValid && project.funds > 0 && (
          <meter
            value={project.funds_spent}
            max={project.funds}
            className="project-card-meter"
            aria-label={`Funds spent: ${Math.round((project.funds_spent / project.funds) * 100)}%`}
          >
            {Math.round((project.funds_spent / project.funds) * 100)}%
          </meter>
        )}
      </section>
    </article>
  );
};

export default ProjectCard;