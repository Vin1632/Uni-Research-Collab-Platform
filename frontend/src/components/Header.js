import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import logo from '../images/logo.jpg';
import { useUserAuth } from "../context/UserAuthContext"; 
import {get_Users}  from "../services/login_service";
const Header = ({ onUser_IdLoaded }) => {
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

        if (onUser_IdLoaded) {
          onUser_IdLoaded(result[0].user_id);
        }

      } catch (error) {
        console.error("Failed to get User_Role", error);
      }
    };
  
    if (user?.email) {
      fetchUserRole();
    }
 
  }, [user, onUser_IdLoaded]);

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
        <li onClick={() => {
          if (Role === "admin")
          {
            navigate("/admin");
          }
          else if (Role === "researcher")
          {
            navigate("/home");
          }
          else
          {
            navigate("/reviewer-dashboard");
          }
        }}>Home</li>
          <li onClick={() => navigate("/profile")}>Profile</li>
          <li onClick={handleLogout}>Log Out</li>
        </menu>
      </nav>

      <div className="logo-title">
        <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">My Research Hub</h1>
      </div>

      <aside className="icon-group">
        <FaEnvelope className="dashboard-icon" title="Messages" onClick={() => navigate("/ChatApp")} />
        <FaBell className="dashboard-icon" title="Notifications"  />
      </aside>
    </header>
  );
};

export default Header;
