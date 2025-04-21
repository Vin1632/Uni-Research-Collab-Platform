import React from 'react';
import { FiMenu, FiBell, FiMessageCircle } from 'react-icons/fi';
import '../styles/Dashboard.css';

const Navbar = ({ toggleSidebar }) => (
  <header className="flex justify-between items-center p-4 bg-white shadow-md">
    <button onClick={toggleSidebar} aria-label="Toggle sidebar">
      <FiMenu size={24} />
    </button>
    
    <h1 className="text-xl font-bold">My Research Hub</h1>
    
    <nav aria-label="Notifications" className="flex gap-4">
      <button aria-label="Messages"><FiMessageCircle size={20} /></button>
      <button aria-label="Notifications"><FiBell size={20} /></button>
    </nav>
  </header>
);

export default Navbar;
