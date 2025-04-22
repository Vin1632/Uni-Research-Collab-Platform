import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import aiHealthcareImage from '../images/aihealthcarenew.jpg'; 
import blockchaineducationImage from '../images/blockchaineducation.jpg'; 
import climatechangeImage from '../images/climatechange.jpg'; 
import sustainenergyImage from '../images/sustainenergy.jpg'; 
import neurotechImage from '../images/neurotech.jpg';
import dataprivacyImage from '../images/dataprivacy.jpg';
import logo from '../images/logo.jpg'; 
import { FaFilter, FaPlusCircle, FaBars, FaEnvelope, FaBell } from "react-icons/fa";

const proposals = [
  {
    id: 1,
    title: "AI in Healthcare",
    image: aiHealthcareImage,
    summary: "Exploring machine learning techniques to improve patient diagnostics and treatment plans.",
    category: "healthcare"
  },
  {
    id: 2,
    title: "Sustainable Energy Research",
    image: sustainenergyImage,
    summary: "Innovative solutions to store and distribute renewable energy effectively.",
    category: "environment"
  },
  {
    id: 3,
    title: "Blockchain in Education",
    image: blockchaineducationImage,
    summary: "Secure certification and transparent academic records using blockchain technology.",
    category: "technology"
  },
  {
    id: 4,
    title: "Climate Change Impact",
    image: climatechangeImage,
    summary: "Studying the effects of climate change on urban infrastructure and agriculture.",
    category: "environment"
  },
  {
    id: 5,
    title: "Genomic Data Privacy",
    image: dataprivacyImage,
    summary: "Balancing data accessibility and privacy in large-scale genomic research projects.",
    category: "healthcare"
  },
  {
    id: 6,
    title: "Neurotechnology & Learning",
    image: neurotechImage,
    summary: "Using brain-computer interfaces to enhance learning and memory retention.",
    category: "technology"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const filteredProposals = selectedCategory
    ? proposals.filter((p) => p.category === selectedCategory)
    : proposals;

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMenu = () => setShowMenu(!showMenu);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-banner">
        <div className="menu-container">
          <FaBars className="menu-icon" onClick={toggleMenu} />
          {showMenu && (
            <div className="menu-dropdown">
              <div onClick={() => navigate("/profile")}>Profile</div>
              <div onClick={() => navigate("/funding")}>Funding</div>
              <div onClick={() => navigate("/milestones")}>Milestone Tracking</div>
              <div onClick={() => navigate("/logout")}>Log Out</div>
            </div>
          )}
        </div>

        <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
        <div className="dashboard-title">My Research Hub</div>

        <div className="icon-group">
          <FaEnvelope className="dashboard-icon" title="Messages" />
          <FaBell className="dashboard-icon" title="Notifications" />
        </div>
      </div>

      <div className="dashboard-top-bar">
        <div className="filter-container">
          <FaFilter className="filter-icon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="filter-dropdown">
              <div onClick={() => handleCategorySelect("technology")}>Technology</div>
              <div onClick={() => handleCategorySelect("environment")}>Environment</div>
              <div onClick={() => handleCategorySelect("healthcare")}>Healthcare</div>
              <div onClick={() => handleCategorySelect(null)}>Show All</div>
            </div>
          )}
        </div>
        <div className="add-button-container">
          <FaPlusCircle className="add-icon" onClick={() => navigate("/add-proposal")} />
        </div>
      </div>

      <div className="dashboard-container">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="proposal-card"
            onClick={() => navigate(`/proposal/${proposal.id}`)}
          >
            <img
              src={proposal.image}
              alt={proposal.title}
              className="proposal-image"
            />
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
