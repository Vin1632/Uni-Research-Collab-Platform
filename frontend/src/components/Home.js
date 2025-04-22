import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
// import aiHealthcareImage from '../images/aihealthcarenew.jpg';
// import blockchaineducationImage from '../images/blockchaineducation.jpg';
// import climatechangeImage from '../images/climatechange.jpg';
// import sustainenergyImage from '../images/sustainenergy.jpg';
// import neurotechImage from '../images/neurotech.jpg';
// import dataprivacyImage from '../images/dataprivacy.jpg';
import logo from '../images/logo.jpg';
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosArchive } from "react-icons/io";
import { IoMdOpen } from "react-icons/io";

// const proposals = [
//   { id: 1, title: "AI in Healthcare", image: aiHealthcareImage, summary: "Exploring machine learning techniques to improve patient diagnostics and treatment plans.", category: "healthcare" },
//   { id: 2, title: "Sustainable Energy Research", image: sustainenergyImage, summary: "Innovative solutions to store and distribute renewable energy effectively.", category: "environment" },
//   { id: 3, title: "Blockchain in Education", image: blockchaineducationImage, summary: "Secure certification and transparent academic records using blockchain technology.", category: "technology" },
//   { id: 4, title: "Climate Change Impact", image: climatechangeImage, summary: "Studying the effects of climate change on urban infrastructure and agriculture.", category: "environment" },
//   { id: 5, title: "Genomic Data Privacy", image: dataprivacyImage, summary: "Balancing data accessibility and privacy in large-scale genomic research projects.", category: "healthcare" },
//   { id: 6, title: "Neurotechnology & Learning", image: neurotechImage, summary: "Using brain-computer interfaces to enhance learning and memory retention.", category: "technology" }
// ];

export default function Dashboard() {
  const navigate = useNavigate();
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // const filteredProposals = selectedCategory
  //   ? proposals.filter(p => p.category === selectedCategory)
  //   : proposals;

  return (
    <main className="dashboard-wrapper">
      <header className="dashboard-banner">
        <nav className="menu-container">
          <FaBars className="menu-icon" onClick={() => setShowMenu(prev => !prev)} />
          <menu className={`menu-dropdown ${showMenu ? 'show' : ''}`}>
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
        <section
            className="proposal-card"
            onClick={() => navigate(`/add-proposal`)}
            role="button"
            tabIndex={0}
            aria-label={`Create Project`}
            >
            <IoIosAddCircleOutline size={70}/>
            <article className="proposal-details">
              <h3 className="proposal-title">Create Project</h3>
              <p className="proposal-summary">Exploring machine learning techniques to improve patient diagnostics and treatment.</p>
            </article>
            </section>

            <section

            className="proposal-card"
            onClick={() => navigate(`/proposal/`)}
            role="button"
            tabIndex={0}
            aria-label={`Reportrs`}
            >
            <IoIosArchive size={70}/>
            <article className="proposal-details">
              <h3 className="proposal-title">Reports</h3>
              <p className="proposal-summary">Innovative solutions to store and distribute renewable energy effectively</p>
            </article>
            </section>


            <section

            className="proposal-card"
            onClick={() => navigate(`/proposal/`)}
            role="button"
            tabIndex={0}
            aria-label={`Reccommendations`}
            >
            <IoMdOpen size={70}/>
            <article className="proposal-details">
              <h3 className="proposal-title">Reccommendation</h3>
              <p className="proposal-summary">Secure certification and transparent academic records using blockchain technology.</p>
            </article>
            </section>
      </section>
    </main>
  );
}
