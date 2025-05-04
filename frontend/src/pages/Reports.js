import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import "../styles/Dashboard.css"; // Reuse Dashboard.css for consistent styling

const Reports = () => {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      try {
        if (!user?.email) return;

        const res = await fetch(`/users/user-by-email/${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);

        const projectRes = await fetch(`/projects/user-projects/${data.user_id}`);
        if (!projectRes.ok) throw new Error("Failed to fetch user projects");
        const projectData = await projectRes.json();
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndProjects();
  }, [user?.email]);

  return (
    <main className="dashboard-wrapper">
      <header className="dashboard-banner">
        <h1 className="dashboard-title">Reports</h1>
      </header>

      {loading ? (
        <p className="reports-loading">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="reports-empty">No proposals found.</p>
      ) : (
        <section className="dashboard-container">
          {projects.map((proj) => {
            const fundsValid = proj.funds !== null && proj.funds !== undefined;
            const spentValid = proj.funds_spent !== null && proj.funds_spent !== undefined;

            return (
              <section key={proj.project_id} className="proposal-card">
                <header>
                  <h2 className="proposal-title">{proj.title}</h2>
                </header>
                <section className="proposal-details">
                  <p><strong>Description:</strong> {proj.description}</p>
                  <p><strong>Start:</strong> {new Date(proj.start_date).toLocaleDateString()}</p>
                  <p><strong>End:</strong> {new Date(proj.end_date).toLocaleDateString()}</p>
                  <p><strong>Funds Allocated:</strong> {fundsValid ? `R${proj.funds}` : 'N/A'}</p>
                  <p><strong>Funds Spent:</strong> {spentValid ? `R${proj.funds_spent}` : 'N/A'}</p>

                  {fundsValid && spentValid && proj.funds > 0 && (
                    <meter
                      value={proj.funds_spent}
                      max={proj.funds}
                      className="project-card-meter"
                    >
                      {Math.round((proj.funds_spent / proj.funds) * 100)}%
                    </meter>
                  )}
                </section>
              </section>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Reports;
