import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import { FiFilter } from 'react-icons/fi';

import aiHealthcareImage from '../images/aihealthcarenew.jpg'; 
import blockchaineducationImage from '../images/blockchaineducation.jpg'; 
import climatechangeImage from '../images/climatechange.jpg'; 
import sustainenergyImage from '../images/sustainenergy.jpg'; 
import neurotechImage from '../images/neurotech.jpg';
import dataprivacyImage from '../images/dataprivacy.jpg';

const proposals = [
  { id: 1, title: "AI in Healthcare", category: "Healthcare", image: aiHealthcareImage, summary: "Exploring machine learning techniques to improve patient diagnostics and treatment plans." },
  { id: 2, title: "Sustainable Energy Research", category: "Environment", image: sustainenergyImage, summary: "Innovative solutions to store and distribute renewable energy effectively." },
  { id: 3, title: "Blockchain in Education", category: "Technology", image: blockchaineducationImage, summary: "Secure certification and transparent academic records using blockchain technology." },
  { id: 4, title: "Climate Change Impact", category: "Environment", image: climatechangeImage, summary: "Studying the effects of climate change on urban infrastructure and agriculture." },
  { id: 5, title: "Genomic Data Privacy", category: "Healthcare", image: dataprivacyImage, summary: "Balancing data accessibility and privacy in large-scale genomic research projects." },
  { id: 6, title: "Neurotechnology & Learning", category: "Technology", image: neurotechImage, summary: "Using brain-computer interfaces to enhance learning and memory retention." }
];

export default function Home() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredProposals = filterCategory === "All"
    ? proposals
    : proposals.filter((p) => p.category === filterCategory);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-banner">
        Dashboard
        <div className="filter-container">
          <FiFilter className="filter-icon" onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className="filter-dropdown">
              <div onClick={() => setFilterCategory("All")}>All</div>
              <div onClick={() => setFilterCategory("Technology")}>Technology</div>
              <div onClick={() => setFilterCategory("Environment")}>Environment</div>
              <div onClick={() => setFilterCategory("Healthcare")}>Healthcare</div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="proposal-card"
            onClick={() => navigate(`/proposal/${proposal.id}`)}
          >
            <img src={proposal.image} alt={proposal.title} className="proposal-image" />
            <div className="proposal-details">
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-summary">{proposal.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

