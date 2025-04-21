import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import { FiMenu, FiBell, FiMessageCircle } from 'react-icons/fi';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosArchive } from "react-icons/io";
import { IoMdOpen } from "react-icons/io";
import { MdMoreVert } from 'react-icons/md';

import logo from '../images/logo.jpg'; 



const proposals = [
  { id: 1, title: "Create Projects", category: "Create", icon: IoIosAddCircleOutline, summary: "Exploring machine learning techniques to improve patient diagnostics and treatment." },
  { id: 2, title: "Reports", category: "Reports", icon: IoIosArchive , summary: "Innovative solutions to store and distribute renewable energy effectively." },
  { id: 3, title: "Recommendation Projects", category: "Recommendations", icon: IoMdOpen, summary: "Secure certification and transparent academic records using blockchain technology." },
];




export default function Dashboard() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

 
  const filteredProposals = filterCategory === "All"
    ? proposals
    : proposals.filter((p) => p.category === filterCategory);


  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-banner">

        <section>
          <button  aria-label="Toggle sidebar" onClick={() => setShowDropdown(!showDropdown)}>
              <FiMenu size={30} />
            </button>
            {showDropdown && (
              <ul className="filter-dropdown">
                <li onClick={() => navigate('/')}>Profile</li>
                <li onClick={() => navigate('/')}>Update</li>
                <li onClick={() => navigate('/')}>Milestone Tracking</li>
                <li onClick={() => navigate('/')}>Log-Out</li>
              </ul>
            )}  
        </section>  
        <section>
          <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
          <h3> My Research Hub</h3>
        </section>
        <section >
          <nav className="filter-container" aria-label="Category filter">
          <button   aria-label="Messages"><FiMessageCircle size={30} /></button>
            <button   aria-label="Notifications"><FiBell size={30} /></button>
            <button  aria-label="More" onClick={() => setShowDropdown(!showDropdown)}>
              <MdMoreVert
                size={30}
                
                role="button"
              />
            </button>
            {showDropdown && (
              <ul className="filter-dropdown">
                <li onClick={() => setFilterCategory("All")}>All</li>
                <li onClick={() => setFilterCategory("Recommendations")}>Recommendations</li>
                <li onClick={() => setFilterCategory("Reports")}>Reports</li>
                <li onClick={() => setFilterCategory("Create")}>Create</li>
              </ul>
            )}
          </nav>
          
        </section>
      </header>

      <main className="dashboard-container">

        {filteredProposals.map((proposal) => (
          <section
            key={proposal.id}
            className="proposal-card"
            onClick={() => navigate(`/proposal/${proposal.id}`)}
            role="button"
            tabIndex={0}
            aria-label={`Open proposal: ${proposal.title}`}
          >
            <proposal.icon size={70}/>
            <article className="proposal-details">
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-summary">{proposal.summary}</p>
            </article>
          </section>
        ))}

        
      </main>
    </div>
  );
}
