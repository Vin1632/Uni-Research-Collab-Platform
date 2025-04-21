import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main>
        <section className="dashboard-container">
          <DashboardCard title="Create" subtitle="Projects" />
          <DashboardCard title="Reports" />
          <DashboardCard title="Recommendational" subtitle="Projects" />
        </section>
      </main>
    </>
  );
}

export default Dashboard;
