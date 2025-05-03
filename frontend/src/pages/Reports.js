import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const Reports = () => {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      try {
        if (!user?.email) return;

        // Fetch the full user record by email
        const res = await fetch(`/users/user-by-email/${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);

        // Fetch that user's projects
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
    <main className="reports-page">
      <header className="reports-header">
        <h1>Reports</h1>
        <p className="subtitle">
          Gain insights, track your impact, and refine your research—explore
          detailed reports that illuminate the trajectory of your proposals.
        </p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <section className="project-list">
          {projects.map((proj) => (
            <article key={proj.project_id} className="project-card">
              <header>
                <h2>{proj.title}</h2>
              </header>
              <section className="project-details">
                <p>
                  <strong>Description:</strong> {proj.description}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(proj.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(proj.end_date).toLocaleDateString()}
                </p>
              </section>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Reports;
