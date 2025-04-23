import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";

import aiHealthcareImage from '../images/aihealthcarenew.jpg';
import blockchaineducationImage from '../images/blockchaineducation.jpg';
import climatechangeImage from '../images/climatechange.jpg';
import sustainenergyImage from '../images/sustainenergy.jpg';
import neurotechImage from '../images/neurotech.jpg';
import dataprivacyImage from '../images/dataprivacy.jpg';
import logo from '../images/logo.jpg';

import { get_project_data } from '../services/proposal_service';

export default function Dashboard() {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [proposals, setProposal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const Project = async () => {
      try {
        const project_dat = await get_project_data(2);
        console.log(project_dat[0]);
        setProposal(project_dat[0]);
      } catch (err) {
        console.error("Failed to fetch project data", err);
      } finally {
        setLoading(false);
      }
    };

    Project();
  }, []);

  const categoryToImage = {
    healthcare: aiHealthcareImage,
    environment: climatechangeImage,
    technology: blockchaineducationImage,
    neurotech: neurotechImage,
    privacy: dataprivacyImage,
    energy: sustainenergyImage
  };

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
        {loading ? (
          <p>Loading proposals...</p>
        ) : (
          proposals.map((proposal) => {
            const image =
              categoryToImage[proposal.category?.toLowerCase()] || aiHealthcareImage;

            return (
              <article
                key={proposal.project_id || proposal.id}
                className="proposal-card"
                onClick={() => navigate(`/proposal/${proposal.project_id || proposal.id}`)}
              >
                <img src={image} alt='Project visual' className="proposal-image" />
                <h3 className="proposal-title">{proposal.title}</h3>
                <p className="proposal-summary">
                  {proposal.summary || proposal.description}
                </p>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
