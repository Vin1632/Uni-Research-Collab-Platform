import React from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header'; 
import { IoIosAddCircleOutline, IoIosArchive } from "react-icons/io";
import { IoMdOpen } from "react-icons/io";
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="dashboard-wrapper">
      <Header /> 

      <section className="dashboard-container">
        <section
          className="proposal-card"
          onClick={() => navigate(`/add-proposal`)}
          role="button"
          tabIndex={0}
          aria-label={`Create Project`}
        >
          <IoIosAddCircleOutline size={70} />
          <article className="proposal-details">
            <h3 className="proposal-title">Create Proposal</h3>
            <p className="proposal-summary"> Advance knowledge, challenge convention, and shape the future—submit a proposal that reflects your intellectual curiosity and scholarly ambition.</p>
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
            <p className="proposal-summary">Gain insights, track your impact, and refine your research—explore detailed reports that illuminate the trajectory of your proposal.</p>
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
            <p className="proposal-summary">Discover ongoing research, offer your expertise, and collaborate across disciplines—your contribution could be the key to advancing breakthrough ideas.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
