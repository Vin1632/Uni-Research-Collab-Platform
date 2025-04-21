import React from 'react';
import '../styles/Dashboard.css';

const Sidebar = ({ isOpen, onClose }) => (
  <aside
    className={`fixed top-0 left-0 w-64 h-full bg-gray-100 p-4 shadow-lg transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    aria-label="Sidebar"
  >
    <nav>
      <ul>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#funding">Funding</a></li>
        <li><a href="#milestone">Milestone Tracking</a></li>
        <li><a href="#logout" className="text-red-500">Log Out</a></li>
      </ul>
    </nav>
    <button onClick={onClose} className="mt-6 text-sm text-gray-500">Close</button>
  </aside>
);

export default Sidebar;
