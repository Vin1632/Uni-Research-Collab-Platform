import React, { useCallback, useState, useEffect } from 'react';
import '../styles/AddProposal.css';
import { useUserAuth } from "../context/UserAuthContext";
import { proposal_service, insert_projectData, get_image_url } from "../services/proposal_service";
import { get_Users } from '../services/login_service';
import { useNavigate } from "react-router-dom";
// import logo from '../images/logo.jpg';
// import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import { invite_collaboration } from '../services/invite_collab_services';
import Header from '../components/Header';

const AddProposals = () => {
  const navigate = useNavigate();
  const {  user } = useUserAuth();
  // const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false); 
  const [sendingInvite, setSendingInvite] = useState(false);

  const [proposal, setProposal] = useState({
    title: '',
    summary: '',
    requirements: '',
    fundingNeeded: '',
    fundingSource: '',
    completionStatus: '',
    image: null,
    start_date: '',
    end_date: ''
  });

  const fundingSources = ['Government Grant', 'Private Sector', 'University Fund', 'Crowdfunding'];

  // const handleLogout = async () => {
  //   try {
  //     await logOut();
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const validateForm = useCallback(() => {
    const errors = {};
    if (!proposal.title?.trim()) errors.title = "Title is required";
    if (!proposal.summary?.trim()) errors.summary = "Summary is required";
    if (proposal.summary?.length > 350) errors.summary = "Summary exceeds 350 characters";
    if (!proposal.requirements?.trim()) errors.requirements = "Requirements are required";
    if (!proposal.fundingNeeded || proposal.fundingNeeded < 0) errors.fundingNeeded = "Enter valid funding amount";
    if (!proposal.fundingSource) errors.fundingSource = "Select a funding source";
    if (
      proposal.completionStatus == null ||
      proposal.completionStatus < 0 ||
      proposal.completionStatus > 100
    ) {
      errors.completionStatus = "Completion must be between 0 and 100";
    }
    if (!proposal.start_date) errors.start_date = "Start date is required";
    if (!proposal.end_date) {
      errors.end_date = "End date is required";
    } else if (proposal.start_date && new Date(proposal.end_date) < new Date(proposal.start_date)) {
      errors.end_date = "End date must be after start date";
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [proposal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    setProposal((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please correct the errors in the form.");
      return;
    }
    setShowInviteModal(true);
    setPendingSubmit(true);
  };

  const completeSubmission = async () => {
    setLoading(true);
    try {
      const email = user?.email;
      const result = await get_Users(email);
      const user_id = result[0].user_id;
      const image_link = await get_image_url(proposal.image);

      const result_1 = await proposal_service(
        user_id,
        proposal.title,
        proposal.summary,
        image_link,
        proposal.start_date,
        proposal.end_date
      );

      if (result_1[0].project_id) {
        alert("Submitted Successfully!");
        await insert_projectData(
          result_1[0].project_id,
          proposal.title,
          proposal.requirements,
          image_link,
          proposal.fundingNeeded,
          proposal.fundingSource,
          proposal.start_date,
          proposal.end_date
        );
        navigate('/home');
      }
    } catch (error) {
      console.error("Proposal submission failed:", error);
    } finally {
      setLoading(false);
      setPendingSubmit(false);
    }
  };

  const sendInvite = async () => {
    setSendingInvite(true);
    try {
      await invite_collaboration(recipientEmail, senderEmail, proposal.title);
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Something went wrong.');
    } finally {
      setSendingInvite(false);
      setShowInviteModal(false);
      setRecipientEmail('');
      setSenderEmail(user?.email || '');
  
      if (pendingSubmit) {
        completeSubmission();
      }
    }
  };
  

  const cancelInvite = () => {
    setShowInviteModal(false);
    setRecipientEmail('');
    setSenderEmail(user?.email || '');

    if (pendingSubmit) {
      completeSubmission();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="dashboard-wrapper">
      <Header />
      <section className="proposal-form">
        <h1>Enter Proposal Details</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="title">Proposal Title:</label>
            <input type="text" id="title" name="title" value={proposal.title} onChange={handleInputChange} required />
            {formErrors.title && <span className="error">{formErrors.title}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="summary">Short Summary:</label>
            <textarea id="summary" name="summary" value={proposal.summary} onChange={handleInputChange} required maxLength={350} />
            {formErrors.summary && <span className="error">{formErrors.summary}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="requirements">Research Requirements:</label>
            <textarea id="requirements" name="requirements" value={proposal.requirements} onChange={handleInputChange} required />
            {formErrors.requirements && <span className="error">{formErrors.requirements}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="fundingNeeded">Funding Needed:</label>
            <input type="number" id="fundingNeeded" name="fundingNeeded" value={proposal.fundingNeeded} onChange={handleInputChange} required min="0" />
            {formErrors.fundingNeeded && <span className="error">{formErrors.fundingNeeded}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="fundingSource">Funding Source:</label>
            <select id="fundingSource" name="fundingSource" value={proposal.fundingSource} onChange={handleInputChange} required>
              <option value="">Select a Funding Source</option>
              {fundingSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            {formErrors.fundingSource && <span className="error">{formErrors.fundingSource}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="completionStatus">Project Completion Status (%):</label>
            <input type="number" id="completionStatus" name="completionStatus" value={proposal.completionStatus} onChange={handleInputChange} required min="0" max="100" />
            {formErrors.completionStatus && <span className="error">{formErrors.completionStatus}</span>}
          </fieldset>

          <fieldset>
            <legend>Project Timeline</legend>
            <label htmlFor="start_date">Start Date:</label>
            <input type="date" id="start_date" name="start_date" value={proposal.start_date} onChange={handleInputChange} required min={today} />
            {formErrors.start_date && <span className="error">{formErrors.start_date}</span>}

            <label htmlFor="end_date">End Date:</label>
            <input type="date" id="end_date" name="end_date" value={proposal.end_date} onChange={handleInputChange} required min={today} />
            {formErrors.end_date && <span className="error">{formErrors.end_date}</span>}
          </fieldset>

          <fieldset>
            <label htmlFor="image">Upload Proposal Image:</label>
            <input type="file" id="image" name="image" onChange={handleImageUpload} accept="image/*" />
          </fieldset>

          {loading && (
            <div className="loading-overlay">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
              </svg>
            </div>
          )}

          <section className="button-group">
            <button  className="submit-propodal-button"type="submit" disabled={!isFormValid}>Submit Proposal</button>
          </section>
        </form>
      </section>

      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Invite a Collaborator</h2>
            <input type="email" placeholder="Your email address" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
            <input type="email" placeholder="Collaborator's email address" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required />
            <div className="modal-buttons">
              <button onClick={sendInvite} disabled={sendingInvite}>
                {sendingInvite ? "Processing..." : "Send Invitation"}
              </button>
              <button onClick={cancelInvite} disabled={sendingInvite}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddProposals;
