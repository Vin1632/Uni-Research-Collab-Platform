import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage } from "react-icons/fa"; 
import { get_each_project_data } from "../services/proposal_service";
import '../styles/proposal_details.css';

export default function ProjectDetails() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [ProjectData, setProjectData] = useState([]);
  useEffect(() => {
    const fetchProjectdata = async () => {
      try {
        if (project_id) { 
          const project_data = await get_each_project_data(project_id);
          setProjectData(project_data[0]);
          
        }
        else{
          console.log("Project_ID Doesnt Exist for the project");
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
    <main className="proposal-main">
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => {
            console.warn("Image failed to load:", proposal.link_image);
            setImgError(true);
          }}
          alt={proposal.title}
          className="proposal-data-image"
        />
      ) : (
        <div className="proposal-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </div>
      )}

      <div className="proposal-info">
        <h3 className="proposal-title">{proposal.title}</h3>
        <p className="proposal-summary">{proposal.requirements}</p>
        <p><strong>Funding Source:</strong> {proposal.funding_source}</p>
        <p><strong>Funds:</strong> {proposal.funds}</p>
        <p><strong>Funds Spent:</strong> {proposal.funds_spent}</p>
        <p><strong>Start Date:</strong> {proposal.start_date}</p>
        <p><strong>End Date:</strong> {proposal.end_date}</p>
        <div className="proposal-buttons">
          <button className="btn-message">Message</button>
          <button className="btn-invite">Invite</button>
        </div>
      </div>
    </main>
  );
}


