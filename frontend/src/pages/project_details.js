import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage, FaFlag } from "react-icons/fa"; 
import { get_each_project_data, flag_project } from "../services/proposal_service";
import { invite_collaboration, email_using_project_id } from "../services/invite_collab_services";
import '../styles/proposal_details.css';
import { useUserAuth } from "../context/UserAuthContext";


export default function ProjectDetails() {
  const location = useLocation();
  const project_id = location.state?.project_id;
  const user_id = location.state?.user_id;

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
            user_id={user_id}
            project_id={project_id}
          />
      </section>
    </main>
  );
}

function ProposalCard({ proposal, user_id, project_id }) {
  const [imgError, setImgError] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagDesc, setFlagDesc] = useState("");
  const [flagged, setFlagged] = useState(false);
  const { user } = useUserAuth();
  const [sendingInvite, setSendingInvite] = useState(false);
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

  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  const handleInvite = async () => {
    setSendingInvite(true);
    const recipient_email = await  email_using_project_id(project_id);
    if(recipient_email.result)
    {
      const sent = await invite_collaboration(recipient_email.result, user.email ,proposal.title);
      if(sent)
      {
        setSendingInvite(false);
      }
      alert("Invitation Sent");
    }
    else
    {
      console.error('Project ID not defined');
    }
    
  };

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
        <p><strong>Funds: R</strong> {proposal.funds}</p>
        <p><strong>Funds Spent: R</strong> {proposal.funds_spent}</p>
        <p><strong>Start Date:</strong> {proposal.start_date}</p>
        <p><strong>End Date:</strong> {proposal.end_date}</p>

        {/*Flag Button */}
        <button
        className="flag-btn"
        onClick={() => setShowFlagModal(true)}
        disabled={flagged}
        >
          <FaFlag style={{ color: flagged ? "#c0392b" : "#c0392b" }} />
          {flagged ? "Flagged" : "Flag"}
        </button>
          {/*Reason for flagging */}
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
        

        <div className="proposal-buttons">
          <button className="btn-message" onClick={() => navigate("/ChatApp")} >Message</button>
          <button className="btn-invite" onClick={handleInvite}disabled={sendingInvite}>
          {sendingInvite ? "Processing..." : "Request Invitaion"}</button>
        </div>
      </div>
    </main>
  );
}


