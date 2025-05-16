import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage } from "react-icons/fa";
import { get_each_project_data } from "../services/proposal_service";
import '../styles/review_details.css';

export default function ReviewDetails() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [projectData, setProjectData] = useState([]);
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (project_id) {
          const data = await get_each_project_data(project_id);
          setProjectData(data[0]);
        } else {
          console.log("Project_ID Doesn't Exist");
        }
      } catch (err) {
        console.error("Failed to fetch Projects", err);
      }
    };

    fetchProjectData();
  }, [project_id]);

  return (
    <main className="review-details-wrapper">
      <Header />
      <section className="review-details-container">
        <ReviewProposalCard
          key={projectData.project_id}
          proposal={projectData}
        />
      </section>
    </main>
  );
}

function ReviewProposalCard({ proposal }) {
  const [imgError, setImgError] = useState(false);

  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  }

  return (
    <main className="review-proposal-main">
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => {
            console.warn("Image failed to load:", proposal.link_image);
            setImgError(true);
          }}
          alt={proposal.title}
          className="review-proposal-image"
        />
      ) : (
        <div className="review-proposal-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </div>
      )}

      <div className="review-proposal-info">
        <h3 className="review-proposal-title">{proposal.title}</h3>
        <p className="review-proposal-summary">{proposal.requirements}</p>
        <p><strong>Funding Source:</strong> {proposal.funding_source}</p>
        <p><strong>Funds: R</strong> {proposal.funds}</p>
        <p><strong>Funds Spent: R</strong> {proposal.funds_spent}</p>
        <p><strong>Start Date:</strong> {formatDate(proposal.start_date)}</p>
        <p><strong>End Date:</strong> {formatDate(proposal.end_date)}</p>
        <div className="review-proposal-buttons">
          <button className="review-btn-message">Message</button>
          <button className="review-btn-request-invite">Request Invite</button>
          <button className="review-btn-donate">Donate</button>
        </div>
      </div>
    </main>
  );
}