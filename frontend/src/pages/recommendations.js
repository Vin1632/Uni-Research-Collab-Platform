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
import {FaBars, FaEnvelope, FaBell } from "react-icons/fa";

const proposals = [
  { id: 1, title: "AI in Healthcare", image: aiHealthcareImage, summary: "Exploring machine learning techniques to improve patient diagnostics and treatment plans.", category: "healthcare" },
  { id: 2, title: "Sustainable Energy Research", image: sustainenergyImage, summary: "Innovative solutions to store and distribute renewable energy effectively.", category: "environment" },
  { id: 3, title: "Blockchain in Education", image: blockchaineducationImage, summary: "Secure certification and transparent academic records using blockchain technology.", category: "technology" },
  { id: 4, title: "Climate Change Impact", image: climatechangeImage, summary: "Studying the effects of climate change on urban infrastructure and agriculture.", category: "environment" },
  { id: 5, title: "Genomic Data Privacy", image: dataprivacyImage, summary: "Balancing data accessibility and privacy in large-scale genomic research projects.", category: "healthcare" },
  { id: 6, title: "Neurotechnology & Learning", image: neurotechImage, summary: "Using brain-computer interfaces to enhance learning and memory retention.", category: "technology" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);


  return (
    <main className="dashboard-wrapper">
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

      <section className="dashboard-container">
        {proposals.map(proposal => (
          <article
            key={proposal.id}
            className="proposal-card"
            onClick={() => navigate(`/proposal/${proposal.id}`)}
          >
            <img src={proposal.image} alt={proposal.title} className="proposal-image" />
            <h3 className="proposal-title">{proposal.title}</h3>
            <p className="proposal-summary">{proposal.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
