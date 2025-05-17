import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Dashboard.css";

import { FaImage, FaFlag } from "react-icons/fa";
import { get_project_data } from "../services/proposal_service";
import { flag_project } from "../services/proposal_service";

export default function Dashboard() {
  const navigate = useNavigate();
  const [proposals, setProposal] = useState([]);
  const [user_id, setuser_id] = useState();

  useEffect(() => {
    if (!user_id) {
      return;
    }

    const fetchProjects = async () => {
      try {
        const project_dat = await get_project_data(user_id);
        setProposal(project_dat[0]);
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
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.project_id}
            proposal={proposal}
            user_id={user_id}
            onClick={() =>
              navigate(`/project_details/`, {
                state: { project_id: proposal.project_id },
              })
            }
          />
        ))}
      </section>
    </main>
  );
}

function ProposalCard({ proposal, onClick, user_id }) {
  const [imgError, setImgError] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagDesc, setFlagDesc] = useState("");
  const [flagged, setFlagged] = useState(false);

  const handleFlag = async () => {
    if (!flagReason) return alert("Please select a reason.");
    try {
      if (!user_id) {
        alert("User ID not loaded. Please try again later.");
        return;
      }
      await flag_project(proposal.project_id, user_id, flagReason, flagDesc);
      setFlagged(true);
      setShowFlagModal(false);
    } catch (err) {
      alert("Failed to flag project.");
      console.error(err);
    }
  };

  const isImageValid =
    proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  return (
    <article className="proposal-card">
      <div onClick={onClick}>
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
      </div>

      {/* Flag Button with icon */}
      <button
        className="flag-btn"
        onClick={() => setShowFlagModal(true)}
        disabled={flagged}
      >
        <FaFlag style={{ color: flagged ? "#c0392b" : "#c0392b" }} />
        {flagged ? "Flagged" : "Flag"}
      </button>

      {/* Modal */}
      {showFlagModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Flag Project</h4>

            <label>Reason:</label>
            <select
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              required
            >
              <option value="">Select reason</option>
              <option value="Inappropriate Content">
                Inappropriate Content
              </option>
              <option value="Spam">Spam</option>
              <option value="Other">Other</option>
            </select>

            <label>Description (optional):</label>
            <textarea
              value={flagDesc}
              onChange={(e) => setFlagDesc(e.target.value)}
              rows="3"
              placeholder="Describe why you're flagging this project..."
            />

            <div className="modal-actions">
              <button onClick={handleFlag}>Submit</button>
              <button onClick={() => setShowFlagModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
