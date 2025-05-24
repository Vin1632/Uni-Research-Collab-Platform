import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage, FaUser, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { get_each_project_data } from "../services/proposal_service";
import { get_my_reviews } from "../services/review_services";
import { useUserAuth } from "../context/UserAuthContext";
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/proposal_details.css';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReviewDetailsUser() {
  const location = useLocation();
  const { user } = useUserAuth();
  const project_id = location.state?.project_id;
  const [projectData, setProjectData] = useState({});
  const [myDonation, setMyDonation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        //  project details
        if (project_id) {
          const data = await get_each_project_data(project_id);
          setProjectData(data[0] || {});
        }
        // total donations
        if (user?.email && project_id) {
          const { get_Users } = await import("../services/login_service");
          const userData = await get_Users(user.email);
          const reviewer_id = userData[0]?.user_id;
          if (reviewer_id) {
            const reviews = await get_my_reviews(reviewer_id);
            // Sum donations
            const total = reviews
              .filter(r => String(r.project_id) === String(project_id))
              .reduce((sum, r) => sum + Number(r.Donated_Amt || 0), 0);
            setMyDonation(total);
          }
        }
      } catch (err) {
        setProjectData({});
        setMyDonation(0);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [user, project_id]);

  return (
    <main className="dashboard-wrapper">
      <Header />
      <section className="dashboard-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ReviewedProjectCard
            key={projectData.project_id}
            proposal={projectData}
            myDonation={myDonation}
          />
        )}
      </section>
    </main>
  );
}

function ReviewedProjectCard({ proposal, myDonation }) {
  const [imgError, setImgError] = useState(false);
  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  const today = new Date();
  const startDate = new Date(proposal.start_date);
  const endDate = new Date(proposal.end_date);

  let progress = 0;
  if (today >= endDate) {
    progress = 100;
  } else if (today > startDate) {
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    progress = Math.min((elapsed / totalDuration) * 100, 100);
  }
  const remaining = 100 - progress;

  const funds = parseFloat(proposal.funds || 0);
  const spent = parseFloat(proposal.funds_spent || 0);
  const available = funds - spent;
  const hasOverdraft = available < 0;

  const financialData = {
    labels: ['Funds Spent', hasOverdraft ? 'Overdraft' : 'Funds Available'],
    datasets: [
      {
        data: [Math.min(spent, funds), hasOverdraft ? Math.abs(available) : available],
        backgroundColor: [hasOverdraft ? '#FF4C4C' : '#FF6384', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  const data = {
    labels: ['Finished', 'Remaining'],
    datasets: [
      {
        data: [progress, remaining],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  const status = today >= endDate ? (
    <span style={{ color: "#27ae60", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
      <FaCheckCircle style={{ marginRight: 6 }} /> Finished
    </span>
  ) : (
    <span style={{ color: "#f39c12", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
      <FaHourglassHalf style={{ marginRight: 6 }} /> In Progress
    </span>
  );

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  }

  function exportToCSV() {
    const csvRows = [
      ['Title', proposal.title],
      ['Funding Source', proposal.funding_source],
      ['Funds', funds.toFixed(2)],
      ['Funds Spent', spent.toFixed(2)],
      ['Funds Available', available.toFixed(2)],
      ['Start Date', formatDate(proposal.start_date)],
      ['End Date', formatDate(proposal.end_date)],
      ['Status', status],
      ['Progress', `${progress.toFixed(1)}%`],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${proposal.title || "project"}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="proposal-main" style={{ background: "#f9fafb", border: "1px solid #e0e0e0" }}>
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => setImgError(true)}
          alt={proposal.title}
          className="proposal-data-image"
        />
      ) : (
        <section className="proposal-image fallback-icon" aria-label="No image available">
          <FaImage size={48} color="#aaa" />
        </section>
      )}

      <section className="proposal-info" style={{ marginTop: 10 }}>
        <h2 className="proposal-title" style={{ fontSize: 28, marginBottom: 8 }}>{proposal.title}</h2>
        <p className="proposal-summary" style={{ fontSize: 17, color: "#444", marginBottom: 18 }}>{proposal.requirements}</p>
        <section style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginBottom: 18 }}>
          <section style={{ minWidth: 180 }}>
            <p style={{ margin: 0, color: "#888" }}><FaUser style={{ marginRight: 6 }} /> <strong>Funding Source:</strong></p>
            <p style={{ margin: 0, fontWeight: 500 }}>{proposal.funding_source}</p>
          </section>
          <section style={{ minWidth: 180 }}>
            <p style={{ margin: 0, color: "#888" }}><FaCalendarAlt style={{ marginRight: 6 }} /> <strong>Start:</strong> {formatDate(proposal.start_date)}</p>
            <p style={{ margin: 0, color: "#888" }}><FaCalendarAlt style={{ marginRight: 6 }} /> <strong>End:</strong> {formatDate(proposal.end_date)}</p>
          </section>
        </section>
        <section style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginBottom: 18 }}>
          <section style={{ minWidth: 180 }}>
            <p style={{ margin: 0, color: "#888" }}><FaMoneyBillWave style={{ marginRight: 6 }} /> <strong>Total Funds:</strong></p>
            <p style={{ margin: 0, fontWeight: 500 }}>R {funds.toFixed(2)}</p>
          </section>
          <section style={{ minWidth: 180 }}>
            <p style={{ margin: 0, color: "#888" }}><FaMoneyBillWave style={{ marginRight: 6 }} /> <strong>Funds Spent:</strong></p>
            <p style={{ margin: 0, fontWeight: 500 }}>R {spent.toFixed(2)}</p>
          </section>
          <section style={{ minWidth: 180 }}>
            <p style={{ margin: 0, color: "#888" }}><FaMoneyBillWave style={{ marginRight: 6 }} /> <strong>Funds Available:</strong></p>
            <p style={{ margin: 0, fontWeight: 500, color: hasOverdraft ? "#c0392b" : "#27ae60" }}>
              R {available.toFixed(2)} {hasOverdraft && <span>(Overdraft)</span>}
            </p>
          </section>
        </section>
        <section style={{ marginBottom: 18 }}>
          <p style={{ margin: 0, color: "#888" }}><strong>Status:</strong> {status}</p>
          <p style={{ margin: 0, color: "#888" }}><strong>Progress:</strong> {progress.toFixed(1)}%</p>
        </section>
        <section style={{ marginBottom: 18 }}>
          <p style={{ margin: 0, color: "#888" }}><strong>Your Total Contribution:</strong></p>
          <p style={{ margin: 0, fontWeight: 600, color: "#0077cc", fontSize: 18 }}>
            R {myDonation.toFixed(2)}
          </p>
        </section>
        <section style={{ display: "flex", gap: "30px", alignItems: "center", marginTop: "30px", justifyContent: "center" }}>
          <section style={{ maxWidth: "120px" }}>
            <Pie data={data} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>Time Progress</p>
          </section>
          <section style={{ maxWidth: "120px", transform: "rotate(-5deg)" }}>
            <Doughnut data={financialData} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              {hasOverdraft ? "Overdraft Detected" : "Financial Overview"}
            </p>
          </section>
        </section>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button onClick={exportToCSV} className="export-csv-button">
            Export to CSV
          </button>
        </div>
      </section>
    </main>
  );
}