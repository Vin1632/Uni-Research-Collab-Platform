import React, { useState } from 'react';
// import '../styles/AddProposal.css';

const AddProposals = () => {
  const [proposal, setProposal] = useState({
    title: '',
    summary: '',
    requirements: '',
    fundingNeeded: '',
    fundingSource: '',
    completionStatus: '',
    image: null,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(proposal);
  };

  const handleInviteCollaborators = () => {
    alert("Invite Collaborators clicked!");
  };

  return (
    <main>
      <header className="add-proposal-banner">
        <h1>Add Proposal</h1>
      </header>

      <section className="proposal-form">
        <h2>Enter Proposal Details</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Proposal Information</legend>

            <div>
              <label htmlFor="title">Proposal Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={proposal.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="summary">Short Summary:</label>
              <textarea
                id="summary"
                name="summary"
                value={proposal.summary}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="requirements">Research Requirements:</label>
              <textarea
                id="requirements"
                name="requirements"
                value={proposal.requirements}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="fundingNeeded">Funding Needed:</label>
              <input
                type="number"
                id="fundingNeeded"
                name="fundingNeeded"
                value={proposal.fundingNeeded}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

            <div>
              <label htmlFor="image">Upload Proposal Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>

          </fieldset>

          <div className="button-group">
            <button type="submit">Submit Proposal</button>
            <button type="button" className="invite-button" onClick={handleInviteCollaborators}>
              Invite Collaborators
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddProposals;
