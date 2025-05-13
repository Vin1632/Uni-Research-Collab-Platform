import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../styles/Dashboard.css';

import { FaImage } from "react-icons/fa"; 
import { get_project_data } from "../services/milestone_tracking_service";

export default function Milestones() {
  const navigate = useNavigate();
  const [proposals, setProposal] = useState([]);
  const [user_id, setuser_id] = useState(); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user_id) { 
          const project_dat = await get_project_data(user_id); 
          setProposal(project_dat[0]);
        }
      } catch (err) {
        console.error("Failed to fetch Projects", err);
      }
    };

    fetchProjects();
  }, [user_id]); 

  return (
    <main className="dashboard-wrapper">
      <Header onUser_IdLoaded={setuser_id} /> 
      
      <section className="dashboard-container">
        {proposals.map(proposal => (
          <ProposalCard
            key={proposal.project_id}
            proposal={proposal}
            onClick={() => navigate(`/project_details_user`, {state : {project_id : proposal.project_id}})}
          />
        ))}
      </section>
    </main>
  );
}

function ProposalCard({ proposal, onClick }) {
  const [imgError, setImgError] = useState(false);

  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  return (
    <article className="proposal-card" onClick={onClick}>
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => {
            console.warn("Image failed to load:", proposal.link_image);
            setImgError(true);
          }}
          alt={proposal.title}
          className="proposal-image"
        />
      ) : (
        <div className="proposal-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </div>
      )}
      <h3 className="proposal-title">{proposal.title}</h3>
      <p className="proposal-summary">{proposal.description}</p>
    </article>
  );
}

