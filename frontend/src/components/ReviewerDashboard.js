import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { FaSearch, FaClipboardCheck, FaLightbulb } from "react-icons/fa";
import '../styles/ReviewerDashboard.css';

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const [setUserId] = useState(null);

  return (
    <main className="reviewer-dashboard-wrapper">
      <Header onUser_IdLoaded={setUserId} />

      <section className="reviewer-dashboard-container">
        <section
          className="reviewer-card"
          onClick={() => navigate(`/review`)}
          role="button"
          tabIndex={0}
          aria-label={`Review Projects`}
        >
          <FaSearch size={70} />
          <article className="reviewer-card-details">
            <h3 className="reviewer-card-title">Review Projects</h3>
            <p className="reviewer-card-summary">
              Explore available research projects, evaluate proposals, and provide your expert feedback to help advance academic research.
            </p>
          </article>
        </section>

        <section
          className="reviewer-card"
          onClick={() => navigate(`/my-reviews`)}
          role="button"
          tabIndex={0}
          aria-label={`My Reviews`}
        >
          <FaClipboardCheck size={70} />
          <article className="reviewer-card-details">
            <h3 className="reviewer-card-title">My Reviews</h3>
            <p className="reviewer-card-summary">
              Access projects you've previously reviewed, track your contributions, and follow up on research developments.
            </p>
          </article>
        </section>

        <section
          className="reviewer-card"
          onClick={() => navigate(`/recommendations`)}
          role="button"
          tabIndex={0}
          aria-label={`Recommendations`}
        >
          <FaLightbulb size={70} />
          <article className="reviewer-card-details">
            <h3 className="reviewer-card-title">Recommendations</h3>
            <p className="reviewer-card-summary">
              Discover projects matching your expertise and interests, curated to help you find the most relevant research opportunities.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}