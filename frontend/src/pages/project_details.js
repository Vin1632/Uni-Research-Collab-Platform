import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import '../styles/Dashboard.css';
import { FaImage } from "react-icons/fa"; 

import { get_each_project_data } from "../services/proposal_service";
export default function ProjectDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  //use the location to get the variable passed
  const project_id = location.state?.project_id;

  const [ProjectData, setProjectData] = useState([]);
  useEffect(() => {
    const fetchProjectdata = async () => {
      try {
        if (project_id) { // Only fetch if project_id is available
          const project_data = await get_each_project_data(project_id);
          console.log("data --> Projects--",project_data[0].link_image)
          setProjectData(project_data[0]);

        }
      } catch (err) {
        console.error("Failed to fetch Projects", err);
      }
    };

    fetchProjectdata();
  }, [project_id]); 

  return (
    <main className="dashboard-wrapper">
      <Header /> 
      
      <section className="dashboard-container">
        <ProposalCard
            key={ProjectData.project_id}
            proposal={ProjectData}
           // onClick={() => navigate(`/proposal/${proposal.project_id}`, {state : {project_id : proposal.project_id}})}
          />
      </section>
    </main>
  );
}

function ProposalCard({ proposal }) {
  const [imgError, setImgError] = useState(false);

  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  return (
    <article className="proposal-card">
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
      <p className="proposal-summary">{proposal.requirements}</p>
      <p >{proposal.funding_source}</p>
      <p >{proposal.funds}</p>
      <p >{proposal.funds_spent}</p>
      <p>{proposal.start_start}</p>
      <p >{proposal.end_start}</p>
      <button> message</button>
      <button> invite </button>
    </article>
  );
}

