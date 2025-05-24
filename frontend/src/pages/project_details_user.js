import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage } from "react-icons/fa";
import { get_each_project_data } from "../services/proposal_service";
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/proposal_details.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectDetails() {
  const location = useLocation();
  const project_id = location.state?.project_id;
  const [ProjectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchProjectdata = async () => {
      try {
        if (project_id) {
          const project_data = await get_each_project_data(project_id);
          setProjectData(project_data[0]);
        } else {
          console.log("Project_ID Doesn't Exist");
        }
      } catch (err) {
        console.error("Failed to fetch Projects", err);
      }
    };

    fetchProjectdata();
  }, [project_id]);

  return (
    <main className="dashboard-wrapper">
      <Header />
      <section className="dashboard-container">
        <ProposalCard
          key={ProjectData.project_id}
          proposal={ProjectData}
        />
      </section>
    </main>
  );
}

function ProposalCard({ proposal }) {
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

  const status = today >= endDate ? "Finished" : "In Progress";

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
    <main className="proposal-main">
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => {
            console.warn("Image failed to load:", proposal.link_image);
            setImgError(true);
          }}
          alt={proposal.title}
          className="proposal-data-image"
        />
      ) : (
        <div className="proposal-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </div>
      )}

      <div className="proposal-info">
        <h3 className="proposal-title">{proposal.title}</h3>
        <p><strong>Funding Source:</strong> {proposal.funding_source}</p>
        <p><strong>Funds: R</strong> {funds.toFixed(2)}</p>
        <p><strong>Funds Spent: R</strong> {spent.toFixed(2)}</p>
        <p><strong>Funds Available: R</strong> {available.toFixed(2)}</p>
        <p><strong>Start Date:</strong> {formatDate(proposal.start_date)}</p>
        <p><strong>End Date:</strong> {formatDate(proposal.end_date)}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Progress:</strong> {progress.toFixed(1)}%</p>

        <div style={{ display: "flex", gap: "30px", alignItems: "center", marginTop: "30px", justifyContent: "center" }}>
          <div style={{ maxWidth: "120px" }}>
            <Pie data={data} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>Time Progress</p>
          </div>

          <div style={{ maxWidth: "120px" }}>
            <Doughnut data={financialData} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              {hasOverdraft ? "Overdraft Detected" : "Financial Overview"}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button onClick={exportToCSV} className="export-csv-button">
            Export to CSV
          </button>
        </div>
      </div>
    </main>
  );
}
