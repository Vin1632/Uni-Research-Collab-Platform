import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { get_my_reviews } from "../services/review_services";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

export default function MyReviews() {
  const { user } = useUserAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const email = user?.email;
        if (!email) return;
        const { get_Users } = await import("../services/login_service");
        const userData = await get_Users(email);
        const reviewer_id = userData[0]?.user_id;
        if (!reviewer_id) return;
        const data = await get_my_reviews(reviewer_id);

        // Remove duplicates by project_id
        const unique = [];
        const seen = new Set();
        for (const proj of data) {
          if (!seen.has(proj.project_id)) {
            unique.push(proj);
            seen.add(proj.project_id);
          }
        }
        setReviews(unique);
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [user]);

  function handleCardClick(project_id) {
    navigate("/review-details-user", { state: { project_id } });
  }

  return (
    <main className="dashboard-wrapper">
      <Header />
      <section className="reviewer-dashboard-container">
        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p>You haven't reviewed any projects yet.</p>
        ) : (
          reviews.map((proj) => (
            <section
              key={proj.project_id}
              className="reviewer-card"
              tabIndex={0}
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(proj.project_id)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleCardClick(proj.project_id);
              }}
              aria-label={`View details for ${proj.title}`}
            >
              {proj.link_image ? (
                <img
                  src={proj.link_image}
                  alt={proj.title}
                  className="reviewer-project-image"
                  style={{ maxHeight: 180, width: "100%", objectFit: "cover", borderRadius: 8 }}
                />
              ) : (
                <section className="fallback-icon" aria-label="No image available" />
              )}
              <article className="reviewer-card-details">
                <h3 className="reviewer-card-title">{proj.title}</h3>
                <p className="reviewer-card-summary">{proj.description}</p>
              </article>
            </section>
          ))
        )}
      </section>
    </main>
  );
}