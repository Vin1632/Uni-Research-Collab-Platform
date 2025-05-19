import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaEnvelope,
  FaBell,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import logo from "../images/transparent-logo.png";
import { useUserAuth } from "../context/UserAuthContext";
import { get_Users } from "../services/login_service";
import "../styles/Header.css";

const Header = ({ onUser_IdLoaded }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    if (Role) {
      console.log("User--Role, ", Role);
    }
  }, [Role]);

  return (
    <>
      <header className="header-banner">
        <FaBars
          className="header-menu-icon"
          onClick={() => setSidebarOpen(true)}
        />
        <div className="header-logo-title">
          <img src={logo} alt="RE:HUB Logo" className="header-logo" />
          <h1 className="header-title">My Research Hub</h1>
        </div>
        <aside className="header-icon-group">
          <FaEnvelope className="header-dashboard-icon" title="Messages" />
          <FaBell className="header-dashboard-icon" title="Notifications" onClick={() => navigate("/notificationspage")} />
        </aside>
      </header>

      <aside className={`header-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="header-sidebar-header">
          <FaTimes
            className="header-close-icon"
            onClick={() => setSidebarOpen(false)}
          />
          <h2>Menu</h2>
        </div>
        <ul className="header-sidebar-menu">
          <li
            onClick={() => {
              if(Role === 'admin')
              {
                navigate("/admin");
                setSidebarOpen(false);

              }
              else if (Role === 'researcher')
              {
                navigate("/home");
                setSidebarOpen(false);
              }
              else if(Role === 'reviewer')
              {
                navigate("/reviewer-dashboard");
                setSidebarOpen(false);
              }
            }}
          >
            <FaHome className="menu-item-icon" /> Home
          </li>
          <li
            onClick={() => {
              navigate("/profile");
              setSidebarOpen(false);
            }}
          >
            <FaUser className="menu-item-icon" /> Profile
          </li>
          <li
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          >
            <FaSignOutAlt className="menu-item-icon" /> Log Out
          </li>
        </ul>
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
    </>
  );
};

export default Header;
