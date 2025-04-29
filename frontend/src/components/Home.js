import React from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header'; // << Import your new header
import { IoIosAddCircleOutline, IoIosArchive } from "react-icons/io";
import { IoMdOpen } from "react-icons/io";
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="dashboard-wrapper">
      <Header /> {/* << Insert it here */}

      <section className="dashboard-container">
        {/* Your clickable cards */}
        <section
          className="proposal-card"
          onClick={() => navigate(`/add-proposal`)}
          role="button"
          tabIndex={0}
          aria-label={`Create Project`}
        >
          <IoIosAddCircleOutline size={70} />
          <article className="proposal-details">
            <h3 className="proposal-title">Create Project</h3>
            <p className="proposal-summary">Exploring machine learning techniques to improve patient diagnostics and treatment.</p>
          </article>
        </section>

        <section
          className="proposal-card"
          onClick={() => navigate(`/proposal/`)}
          role="button"
          tabIndex={0}
          aria-label={`Reports`}
        >
          <IoIosArchive size={70} />
          <article className="proposal-details">
            <h3 className="proposal-title">Reports</h3>
            <p className="proposal-summary">Innovative solutions to store and distribute renewable energy effectively</p>
          </article>
        </section>

        <section
          className="proposal-card"
          onClick={() => navigate(`/recommendations`)}
          role="button"
          tabIndex={0}
          aria-label={`Recommendations`}
        >
          <IoMdOpen size={70} />
          <article className="proposal-details">
            <h3 className="proposal-title">Recommendations</h3>
            <p className="proposal-summary">Secure certification and transparent academic records using blockchain technology.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
