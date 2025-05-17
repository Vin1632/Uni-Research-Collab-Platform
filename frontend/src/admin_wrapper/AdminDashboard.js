import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import FlaggedProjects from "./FlaggedProjects";
import AllProjects from "./AllProjects";
import Users from "./Users";
import "../styles/Admin.css";
import logo from "../images/transparent-logo.png"; // adjust path as needed

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin</h2>
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>

        <nav>
          <ul>
            <li>
              <NavLink
                to="/admin/flagged"
                className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
              >
                Reported Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/projects"
                className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
              >
                All Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
              >
                Users
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer at the bottom left */}
        <div className="sidebar-footer">
          &copy; {new Date().getFullYear()} My Research Hub
        </div>
      </aside>

      <section className="admin-content">
        <Routes>
          <Route path="flagged" element={<FlaggedProjects />} />
          <Route path="projects" element={<AllProjects />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </section>
    </div>
  );
}
