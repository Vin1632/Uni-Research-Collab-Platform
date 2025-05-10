import React, { useState } from 'react';
import '../styles/AddProposal.css';
import { useUserAuth } from "../context/UserAuthContext";
import { proposal_service, insert_projectData, get_image_url } from "../services/proposal_service";
import { get_Users } from '../services/login_service';
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jpg';
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";

const AddProposals = () => {
  const navigate = useNavigate();
  const {logOut,  user } = useUserAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  //logging Out
  const handleLogout = async () => {
    try {
      await logOut(); 
      navigate("/");  
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };




  const [proposal, setProposal] = useState({
    title: '',
    summary: '',
    requirements: '',
    fundingNeeded: '',
    fundingSource: '',
    completionStatus: '',
    image: null,
    start_date : '',
    end_date : ''
  });

  const fundingSources = ['Government Grant', 'Private Sector', 'University Fund', 'Crowdfunding'];

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

  //Wgen submit button clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      //When proposal successfuly inserted then projectData follows
      if (result_1[0].project_id) {
        alert("Submitted Successfully!");
        navigate('/home');
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
        
      }
    } catch (error) {
      console.error("Proposal submission failed:", error);
    } finally {
      setLoading(false); 
    }
  };
  

  const handleInviteCollaborators = () => {
    alert("Invite Collaborators clicked!");
    //setShowInviteModal(true);
  };

  // const sendInvite = async () => {
  //   try {
  //     const response = await fetch('/api/send-invite', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         toEmail: recipientEmail,
  //         fromUser: senderEmail,
  //         projectTitle: proposal.title
  //       }),
  //     });
  
  //     const result = await response.json();
  //     if (response.ok) {
  //       alert('Invitation sent!');
  //     } else {
  //       alert('Failed to send invite: ' + result.message);
  //     }
  
  //     setShowInviteModal(false);
  //     setRecipientEmail('');
  //     setSenderEmail(user?.email || '');
  //   } catch (error) {
  //     console.error('Error sending invite:', error);
  //     alert('Something went wrong.');
  //   }
  // };
  

  return (
    <>
      <header className="dashboard-banner">
        <nav className="menu-container">
          <FaBars className="menu-icon" onClick={() => setShowMenu(prev => !prev)} />
          <menu className={`menu-dropdown ${showMenu ? 'show' : ''}`}>
            <li onClick={() => navigate("/home")}>Home</li>
            <li onClick={() => navigate("/profile")}>Profile</li>
            <li onClick={handleLogout}>Log Out</li>
          </menu>
        </nav>

        <div className="logo-title">
          <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
          <h1 className="dashboard-title">My Research Hub</h1>
        </div>

        <aside className="icon-group">
          <FaEnvelope className="dashboard-icon" title="Messages" />
          <FaBell className="dashboard-icon" title="Notifications" />
        </aside>
      </header>

      <section className="proposal-form">
        <h1>Enter Proposal Details</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="title">Proposal Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={proposal.title}
              onChange={handleInputChange}
              required
            />
          </fieldset>

          <fieldset>
            <label htmlFor="summary">Short Summary:</label>
            <textarea
              id="summary"
              name="summary"
              value={proposal.summary}
              onChange={handleInputChange}
              required
              maxLength={350}
            />
          </fieldset>

          <fieldset>
            <label htmlFor="requirements">Research Requirements:</label>
            <textarea
              id="requirements"
              name="requirements"
              value={proposal.requirements}
              onChange={handleInputChange}
              required
            />
          </fieldset>

          <fieldset>
            <label htmlFor="fundingNeeded">Funding Needed:</label>
            <input
              type="number"
              id="fundingNeeded"
              name="fundingNeeded"
              value={proposal.fundingNeeded}
              onChange={handleInputChange}
              required
              min="0"
            />
          </fieldset>

          <fieldset>
            <label htmlFor="fundingSource">Funding Source:</label>
            <select
              id="fundingSource"
              name="fundingSource"
              value={proposal.fundingSource}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Funding Source</option>
              {fundingSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <label htmlFor="completionStatus">Project Completion Status (%):</label>
            <input
              type="number"
              id="completionStatus"
              name="completionStatus"
              value={proposal.completionStatus}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
            />
          </fieldset>

          <fieldset>
            <legend>Project Timeline</legend>

            <label htmlFor="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={proposal.start_date}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="end_date">End Date:</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={proposal.end_date}
              onChange={handleInputChange}
              required
            />
          </fieldset>


          <fieldset>
            <label htmlFor="image">Upload Proposal Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </fieldset>
          {loading && (
              <div className="loading-overlay">
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle
                    className="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                  />
                </svg>
              </div>
            )}


          <section className="button-group">
            <button type="submit">Submit Proposal</button>
            <button type="button" className="invite-button" onClick={handleInviteCollaborators}>
              Invite Collaborators
            </button>
          </section>
        </form>
      </section>
      
      


    </>
  );
};

export default AddProposals;
