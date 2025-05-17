import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaImage } from "react-icons/fa";
import { get_each_project_data } from "../services/proposal_service";
import '../styles/review_details.css';
import { useUserAuth } from "../context/UserAuthContext";
import { donate_to_project } from "../services/review_services";
import { get_Users } from "../services/login_service";

export default function ReviewDetails() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [projectData, setProjectData] = useState([]);
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (project_id) {
          const data = await get_each_project_data(project_id);
          setProjectData(data[0]);
        } else {
          console.log("Project_ID Doesn't Exist");
        }
      } catch (err) {
        console.error("Failed to fetch Projects", err);
      }
    };

    fetchProjectData();
  }, [project_id]);

  return (
    <main className="review-details-wrapper">
      <Header />
      <section className="review-details-container">
        <ReviewProposalCard
          key={projectData.project_id}
          proposal={projectData}
        />
      </section>
    </main>
  );
}

function ReviewProposalCard({ proposal }) {
  const { user } = useUserAuth();
  const [imgError, setImgError] = useState(false);
  const [showDonateField, setShowDonateField] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [showDonateConfirm, setShowDonateConfirm] = useState(false);
  const [setDonateLoading] = useState(false);

  const isImageValid = proposal.link_image && proposal.link_image.trim() !== "" && !imgError;

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  }

  function handleDonateClick(e) {
    e.stopPropagation();
    setShowDonateField((prev) => !prev);
    setShowDonateConfirm(false);
    setDonateAmount('');
  }

  function handleDonateAmountChange(e) {
    setDonateAmount(e.target.value.replace(/[^0-9]/g, ''));
  }

  function handleDonateSubmit(e) {
    e.preventDefault();
    if (donateAmount && Number(donateAmount) > 0) {
      setShowDonateConfirm(true);
    }
  }

  async function handleConfirmDonate() {
    setDonateLoading(true);
    try {
      const email = user?.email;
      if (!email) throw new Error("User not logged in");

      const result = await get_Users(email);
      const reviewer_id = result[0]?.user_id;
      if (!reviewer_id) throw new Error("User ID not found");

      const project_id = proposal.project_id;
      const donated_amt = Number(donateAmount);

      const donateResult = await donate_to_project({ reviewer_id, project_id, donated_amt });
      alert(donateResult.message || `Thank you for donating R${donateAmount}!`);
    } catch (error) {
      alert(error.message || "Failed to process donation. Please try again.");
    } finally {
      setDonateLoading(false);
      setShowDonateField(false);
      setShowDonateConfirm(false);
      setDonateAmount('');
    }
  }

  function handleCancelDonate() {
    setShowDonateConfirm(false);
  }

  return (
    <main className="review-proposal-main">
      {isImageValid ? (
        <img
          src={proposal.link_image}
          onError={() => {
            console.warn("Image failed to load:", proposal.link_image);
            setImgError(true);
          }}
          alt={proposal.title}
          className="review-proposal-image"
        />
      ) : (
        <section className="review-proposal-image fallback-icon">
          <FaImage size={48} color="#aaa" />
        </section>
      )}

      <section className="review-proposal-info">
        <h3 className="review-proposal-title">{proposal.title}</h3>
        <p className="review-proposal-summary">{proposal.requirements}</p>
        <p><strong>Funding Source:</strong> {proposal.funding_source}</p>
        <p><strong>Funds: R</strong> {proposal.funds}</p>
        <p><strong>Funds Spent: R</strong> {proposal.funds_spent}</p>
        <p><strong>Start Date:</strong> {formatDate(proposal.start_date)}</p>
        <p><strong>End Date:</strong> {formatDate(proposal.end_date)}</p>
        <section className="review-proposal-buttons">
          <button className="review-btn-message">Message</button>
          <button className="review-btn-request-invite">Request Invite</button>
          <button
            className="review-btn-donate"
            onClick={handleDonateClick}
            aria-expanded={showDonateField}
          >
            Donate
          </button>
        </section>

        {showDonateField && (
          <form className="donate-form-section" onSubmit={handleDonateSubmit}>
            <label htmlFor="donate-amount" className="donate-label">
              Enter amount (R):
            </label>
            <input
              id="donate-amount"
              className="donate-input"
              type="number"
              min="1"
              value={donateAmount}
              onChange={handleDonateAmountChange}
              required
            />
            <button type="submit" className="donate-submit-btn">
              Donate
            </button>
          </form>
        )}

        {showDonateConfirm && (
          <section className="donate-modal-overlay" role="alertdialog" aria-modal="true">
            <section className="donate-confirm-popup">
              <p>
                Are you sure you want to donate <strong>R{donateAmount}</strong> to this project?
              </p>
              <section className="donate-confirm-buttons">
                <button className="donate-confirm-btn" onClick={handleConfirmDonate} type="button">
                  Yes, Donate
                </button>
                <button className="donate-cancel-btn" onClick={handleCancelDonate} type="button">
                  Cancel
                </button>
              </section>
            </section>
          </section>
        )}
      </section>
    </main>
  );
}