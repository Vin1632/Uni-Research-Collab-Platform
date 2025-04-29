import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import logo from '../images/logo.jpg';
import { useUserAuth } from "../context/UserAuthContext"; 
import {get_Users}  from "../services/login_service";
const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { logOut, user } = useUserAuth(); 
  const [Role, setRole] = useState("");

  const handleLogout = async () => {
    try {
      await logOut(); 
      navigate("/");  
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const result = await get_Users(user.email);
        setRole(result[0].role); 
      } catch (error) {
        console.error("Failed to get User_Role", error);
      }
    };
  
    if (user?.email) {
      fetchUserRole();
    }
 
  }, [user]);

  //Log/Use Role after the "Role" is set
  useEffect(() => {
    if (Role) {
      console.log("User--Role, ", Role);
    }
  }, [Role]);

  return (
    <header className="dashboard-banner">
      <nav className="menu-container">
        <FaBars className="menu-icon" onClick={() => setShowMenu(prev => !prev)} />
        <menu className={`menu-dropdown ${showMenu ? 'show' : ''}`}>
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/profile")}>Profile</li>
          <li onClick={() => navigate("/funding")}>Funding</li>
          <li onClick={() => navigate("/milestones")}>Milestone Tracking</li>
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
  );
};

export default Header;
