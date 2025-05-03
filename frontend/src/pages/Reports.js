// src/pages/Reports.js
import React, { useEffect, useState, useContext } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { get_project_data } from '../services/proposal_service';

const Reports = () => {
  const { user } = useUserAuth(); // Get the user from context
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await get_project_data(user.id); // reuse your existing API call
        setProjects(data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-4">
      <header>
        <h1 className="text-2xl font-bold mb-4">Your Proposals</h1>
      </header>
      {projects.length === 0 ? (
        <section>
          <p>No proposals found.</p>
        </section>
      ) : (
        <section>
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.project_id} className="p-4 border rounded shadow-sm" role="article">
                <header>
                  <h2 className="font-semibold">{project.title}</h2>
                </header>
                <p>{project.description}</p>
                <footer>
                  <small className="text-gray-500">
                    {project.start_date} — {project.end_date}
                  </small>
                </footer>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default Reports;
