import React, { useState } from 'react';
import '../styles/AddProposal.css';
import { useUserAuth } from "../context/UserAuthContext";
import { proposal_service, get_project_id, insert_projectData } from "../services/proposal_service";
import { get_Users } from '../services/login_service';
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jpg';
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";

const AddProposals = () => {
  const navigate = useNavigate();
  const [proposal, setProposal] = useState({
    title: '',
    summary: '',
    requirements: '',
    fundingNeeded: '',
    fundingSource: '',
    completionStatus: '',
    image: null,
  });
  const {user } = useUserAuth();
  const [showMenu, setShowMenu] = useState(false);
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


  const handleSubmit = async (e) =>  {
    e.preventDefault();
    /*  image link_image are NUll*/
    const email = user?.email;
    const result = await get_Users(email);
    const user_id = result[0].user_id;
    const result_1 =  await proposal_service(user_id, proposal.title, proposal.summary, '');
    
    if(result_1[0].affectedRows === 1)
    {
      navigate('/home');

      /* Insert the project data 
        First get the project_id using user_id, of the newly created project then insert it into the database
        */
      const projectID = await get_project_id(user_id);
      console.log("projectID", projectID[0][0].project_id);
      /* HARDCODED: the project_id 2 
          link_image is empty
      
      */

      //insert into project data
      await insert_projectData(2, proposal.title , proposal.requirements, '', proposal.fundingNeeded, proposal.fundingSource)
      
    }
    console.log(proposal);
  };

  const handleInviteCollaborators = () => {
    alert("Invite Collaborators clicked!");
  };

  return (
    <>
      <header className="dashboard-banner">
        <nav className="menu-container">
          <FaBars className="menu-icon" onClick={() => setShowMenu(prev => !prev)} />
          <menu className={`menu-dropdown ${showMenu ? 'show' : ''}`}>
          <li onClick={() => navigate("/home")}>Home</li>
            <li onClick={() => navigate("/profile")}>Profile</li>
            <li onClick={() => navigate("/funding")}>Funding</li>
            <li onClick={() => navigate("/milestones")}>Milestone Tracking</li>
            <li onClick={() => navigate("/logout")}>Log Out</li>
          </menu>
        </nav>

        <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">My Research Hub</h1>

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
            <label htmlFor="image">Upload Proposal Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </fieldset>

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
