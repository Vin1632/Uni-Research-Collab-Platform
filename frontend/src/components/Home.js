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
import { FaFilter, FaPlusCircle, FaBars, FaEnvelope, FaBell } from "react-icons/fa";

const proposals = [
  {
    id: 1,
    title: "AI in Healthcare",
    image: aiHealthcareImage,
    summary: "Exploring machine learning techniques to improve patient diagnostics and treatment plans.",
    category: "healthcare"
  },
  {
    id: 2,
    title: "Sustainable Energy Research",
    image: sustainenergyImage,
    summary: "Innovative solutions to store and distribute renewable energy effectively.",
    category: "environment"
  },
  {
    id: 3,
    title: "Blockchain in Education",
    image: blockchaineducationImage,
    summary: "Secure certification and transparent academic records using blockchain technology.",
    category: "technology"
  },
  {
    id: 4,
    title: "Climate Change Impact",
    image: climatechangeImage,
    summary: "Studying the effects of climate change on urban infrastructure and agriculture.",
    category: "environment"
  },
  {
    id: 5,
    title: "Genomic Data Privacy",
    image: dataprivacyImage,
    summary: "Balancing data accessibility and privacy in large-scale genomic research projects.",
    category: "healthcare"
  },
  {
    id: 6,
    title: "Neurotechnology & Learning",
    image: neurotechImage,
    summary: "Using brain-computer interfaces to enhance learning and memory retention.",
    category: "technology"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const filteredProposals = selectedCategory
    ? proposals.filter((p) => p.category === selectedCategory)
    : proposals;

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMenu = () => setShowMenu(!showMenu);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-banner">
        <div className="menu-container">
          <FaBars className="menu-icon" onClick={toggleMenu} />
          {showMenu && (
            <div className="menu-dropdown">
              <div onClick={() => navigate("/profile")}>Profile</div>
              <div onClick={() => navigate("/funding")}>Funding</div>
              <div onClick={() => navigate("/milestones")}>Milestone Tracking</div>
              <div onClick={() => navigate("/logout")}>Log Out</div>
            </div>
          )}
        </div>

        <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
        <div className="dashboard-title">My Research Hub</div>

        <div className="icon-group">
          <FaEnvelope className="dashboard-icon" title="Messages" />
          <FaBell className="dashboard-icon" title="Notifications" />
        </div>
      </div>

      <div className="dashboard-top-bar">
        <div className="filter-container">
          <FaFilter className="filter-icon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="filter-dropdown">
              <div onClick={() => handleCategorySelect("technology")}>Technology</div>
              <div onClick={() => handleCategorySelect("environment")}>Environment</div>
              <div onClick={() => handleCategorySelect("healthcare")}>Healthcare</div>
              <div onClick={() => handleCategorySelect(null)}>Show All</div>
            </div>
          )}
        </div>
        <div className="add-button-container">
          <FaPlusCircle className="add-icon" onClick={() => navigate("/add-proposal")} />
        </div>
      </div>

      <div className="dashboard-container">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="proposal-card"
            onClick={() => navigate(`/proposal/${proposal.id}`)}
          >
            <img
              src={proposal.image}
              alt={proposal.title}
              className="proposal-image"
            />
            <div className="proposal-details">
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-summary">{proposal.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import '../styles/Dashboard.css';
// import { FiMenu, FiBell, FiMessageCircle } from 'react-icons/fi';
// import { IoIosAddCircleOutline } from "react-icons/io";
// import { IoIosArchive } from "react-icons/io";
// import { IoMdOpen } from "react-icons/io";
// import { MdMoreVert } from 'react-icons/md';

// import logo from '../images/logo.jpg'; 



// const proposals = [
//   { id: 1, title: "Create Projects", category: "Create", icon: IoIosAddCircleOutline, summary: "Exploring machine learning techniques to improve patient diagnostics and treatment." },
//   { id: 2, title: "Reports", category: "Reports", icon: IoIosArchive , summary: "Innovative solutions to store and distribute renewable energy effectively." },
//   { id: 3, title: "Recommendation Projects", category: "Recommendations", icon: IoMdOpen, summary: "Secure certification and transparent academic records using blockchain technology." },
// ];




// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [showDropdown, setShowDropdown] = useState(false);

 
//   const filteredProposals = filterCategory === "All"
//     ? proposals
//     : proposals.filter((p) => p.category === filterCategory);


//   return (
//     <div className="dashboard-wrapper">
//       <header className="dashboard-banner">

//         <section>
//           <button  aria-label="Toggle sidebar" onClick={() => setShowDropdown(!showDropdown)}>
//               <FiMenu size={30} />
//             </button>
//             {showDropdown && (
//               <ul className="filter-dropdown">
//                 <li onClick={() => navigate('/')}>Profile</li>
//                 <li onClick={() => navigate('/')}>Update</li>
//                 <li onClick={() => navigate('/')}>Milestone Tracking</li>
//                 <li onClick={() => navigate('/')}>Log-Out</li>
//               </ul>
//             )}  
//         </section>  
//         <section>
//           <img src={logo} alt="RE:HUB Logo" className="dashboard-logo" />
//           <h3> My Research Hub</h3>
//         </section>
//         <section >
//           <nav className="filter-container" aria-label="Category filter">
//           <button   aria-label="Messages"><FiMessageCircle size={30} /></button>
//             <button   aria-label="Notifications"><FiBell size={30} /></button>
//             <button  aria-label="More" onClick={() => setShowDropdown(!showDropdown)}>
//               <MdMoreVert
//                 size={30}
//                 role="button"
//               />
//             </button>
//             {showDropdown && (
//               <ul className="filter-dropdown">
//                 <li onClick={() => setFilterCategory("All")}>All</li>
//                 <li onClick={() => setFilterCategory("Recommendations")}>Recommendations</li>
//                 <li onClick={() => setFilterCategory("Reports")}>Reports</li>
//                 <li onClick={() => setFilterCategory("Create")}>Create</li>
//               </ul>
//             )}
//           </nav>
          
//         </section>
//       </header>

//       <main className="dashboard-container">

//       <section
            
//             className="proposal-card"
//             onClick={() => navigate(`/add-proposal`)}
//             role="button"
//             tabIndex={0}
//             aria-label={`Create Project`}
//           >
//             <IoIosAddCircleOutline size={70}/>
//             <article className="proposal-details">
//               <h3 className="proposal-title">Create Project</h3>
//               <p className="proposal-summary">Exploring machine learning techniques to improve patient diagnostics and treatment.</p>
//             </article>
//           </section>

//           <section
            
//             className="proposal-card"
//             onClick={() => navigate(`/proposal/`)}
//             role="button"
//             tabIndex={0}
//             aria-label={`Reportrs`}
//           >
//             <IoIosArchive size={70}/>
//             <article className="proposal-details">
//               <h3 className="proposal-title">Reports</h3>
//               <p className="proposal-summary">Innovative solutions to store and distribute renewable energy effectively</p>
//             </article>
//           </section>


//           <section
            
//             className="proposal-card"
//             onClick={() => navigate(`/proposal/`)}
//             role="button"
//             tabIndex={0}
//             aria-label={`Reccommendations`}
//           >
//             <IoMdOpen size={70}/>
//             <article className="proposal-details">
//               <h3 className="proposal-title">Reccommendation</h3>
//               <p className="proposal-summary">Secure certification and transparent academic records using blockchain technology.</p>
//             </article>
//           </section>
        
//       </main>
//     </div>
//   );
// }
