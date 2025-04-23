import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

import logo from '../images/logo.jpg';
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosArchive } from "react-icons/io";
import { IoMdOpen } from "react-icons/io";


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
            onClick={() => navigate(`/recommedations`)}
            role="button"
            tabIndex={0}
            aria-label={`Reccommendations`}
            >
            <IoMdOpen size={70}/>
            <article className="proposal-details">
              <h3 className="proposal-title">Reccommendations</h3>
              <p className="proposal-summary">Secure certification and transparent academic records using blockchain technology.</p>
            </article>
            </section>
      </section>
    </main>
  );
}
