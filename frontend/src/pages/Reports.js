import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import "../styles/Dashboard.css";
import "../styles/Reports.css";

const Reports = () => {
  const { user } = useUserAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      try {
        if (!user?.email) return;

        const res = await fetch(`/users/user-by-email/${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        const projectRes = await fetch(`/projects/user-projects/${data.user_id}`);
        if (!projectRes.ok) throw new Error("Failed to fetch user projects");
        const projectData = await projectRes.json();
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to load reports:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndProjects();
  }, [user?.email]);

  const exportToCSV = () => {
    if (projects.length === 0) return;

    const csvRows = [];
    const headers = ["Project Title", "Description", "Start Date", "End Date", "Funds Allocated", "Funds Spent"];
    csvRows.push(headers.join(","));

    projects.forEach((proj) => {
      const row = [
        proj.title,
        proj.description,
        new Date(proj.start_date).toLocaleDateString(),
        new Date(proj.end_date).toLocaleDateString(),
        proj.funds !== null ? `R${proj.funds}` : "N/A",
        proj.funds_spent !== null ? `R${proj.funds_spent}` : "N/A",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "project_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="dashboard-wrapper">
      <header className="dashboard-banner" role="banner">
        <h1 className="dashboard-title" aria-label="Reports Page">Reports</h1>
        <nav>
          <ul>
            <li>
              <button onClick={exportToCSV} className="export-button" aria-label="Export Reports">
                Export to CSV
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {loading ? (
        <section role="status" aria-live="polite" className="reports-loading">
          <p>Loading...</p>
        </section>
      ) : error ? (
        <section role="alert" className="reports-error">
          <p>Error: {error}</p>
        </section>
      ) : projects.length === 0 ? (
        <section role="region" aria-label="No Proposals Found" className="reports-empty">
          <p>No proposals found. Start by creating a new project proposal!</p>
          <a href="/create-proposal" className="create-proposal-link">Create Proposal</a>
        </section>
      ) : (
        <section className="dashboard-container" role="region" aria-label="Project Proposals">
          {projects.map((proj) => {
            const fundsValid = proj.funds !== null && proj.funds !== undefined;
            const spentValid = proj.funds_spent !== null && proj.funds_spent !== undefined;
            const percentage = fundsValid && spentValid ? Math.round((proj.funds_spent / proj.funds) * 100) : 0;

            return (
              <article key={proj.project_id} className="proposal-card">
                <header>
                  <h2>{proj.title}</h2>
                </header>
                <p><strong>Description:</strong> {proj.description}</p>
                <p><strong>Start:</strong> {new Date(proj.start_date).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(proj.end_date).toLocaleDateString()}</p>
                <p><strong>Funds Allocated:</strong> {fundsValid ? `R${proj.funds}` : "N/A"}</p>
                <p><strong>Funds Spent:</strong> {spentValid ? `R${proj.funds_spent}` : "N/A"}</p>

                <progress id={`progressBar-${proj.project_id}`} value={percentage} max="100"></progress>
                <p id={`progressText-${proj.project_id}`}>{percentage}%</p>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Reports;
