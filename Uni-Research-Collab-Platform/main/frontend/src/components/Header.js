// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import logo from '../images/logo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
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

      <div className="logo-title">
        <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">My Research Hub</h1>
      </div>

      <aside className="icon-group">
        <FaEnvelope className="dashboard-icon" title="Messages" />
        <FaBell className="dashboard-icon" title="Notifications" />
      </aside>
    </header>
  );
};

export default Header;
