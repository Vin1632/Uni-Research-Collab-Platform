import React, { useState } from "react";
import "../styles/ReviewerSignUp.css";
import { useNavigate } from "react-router-dom";
import { login_service } from "../services/login_service";
import { useUserAuth } from "../context/UserAuthContext";

const ResearchInterests = ({ interests, onAdd, onRemove, error, inputValue, onInputChange }) => (
  <section className="input-row full-width">
    <label>
      Research Interests
      <section className="input-row">
        <input
          type="text"
          name="interestInput"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Add an interest"
          aria-label="Add a research interest"
        />
        <button
          className="add-btn"
          onClick={(e) => {
            e.preventDefault();
            onAdd();
          }}
          aria-label="Add interest"
        >
          Add
        </button>
      </section>

      <section className="badge-container">
        {interests.length === 0 ? (
          <span className="placeholder-text">No interests added yet.</span>
        ) : (
          interests.map((interest, idx) => (
            <span
              key={idx}
              className="interest-badge"
              onClick={() => onRemove(interest)}
              aria-label={`Remove interest ${interest}`}
            >
              {interest} ✕
            </span>
          ))
        )}
        {error && <span className="error-text">{error}</span>}
      </section>
    </label>
  </section>
);

const ReviewerSignup = () => {
  const [form, setForm] = useState({
    fullName: "",
    institution: "",
    careerField: "",
    qualifications: "",
    interestInput: "",
    researchInterests: [],
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const {user } = useUserAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!/^[a-zA-Z\s]+$/.test(form.fullName)) newErrors.fullName = "Full name must only contain letters.";
    if (!form.institution.trim()) newErrors.institution = "Institution is required.";
    if (!form.careerField.trim()) newErrors.careerField = "Career field is required.";
    if (!form.qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (form.qualifications.length < 10) newErrors.qualifications = "Qualifications must be at least 10 characters long.";
    if (form.researchInterests.length === 0) newErrors.researchInterests = "At least one interest is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterest = () => {
    const trimmed = form.interestInput.trim();
    if (!trimmed) return;
    if (form.researchInterests.includes(trimmed)) {
      setErrors({ ...errors, researchInterests: "This interest is already added." });
      return;
    }
    setForm({
      ...form,
      researchInterests: [...form.researchInterests, trimmed],
      interestInput: "",
    });
    setErrors({ ...errors, researchInterests: null }); // Clear error
  };

  const handleRemoveInterest = (tag) => {
    setForm({
      ...form,
      researchInterests: form.researchInterests.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    const email = user?.email;
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        console.log("Submitting reviewer form:", form);
        setSubmitStatus({ success: true, message: "Submitted successfully!" });
        navigate("/recommendations");
        await login_service(form.fullName, email, "reviewer", form.institution, JSON.stringify(form.researchInterests));
      } catch (error) {
        setSubmitStatus({ success: false, message: "Failed to submit. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="form-wrapper">
      <form onSubmit={handleSubmit} className="reviewer-form">
        <h3>Reviewer Details</h3>

        <section className="input-row">
          <section className="input-col">
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                aria-label="Full Name"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </label>
          </section>

          <section className="input-col">
            <label>
              Institution Name
              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                aria-label="Institution Name"
              />
              {errors.institution && <span className="error-text">{errors.institution}</span>}
            </label>
          </section>
        </section>

        <section className="input-row">
          <section className="input-col">
            <label>
              Career Field
              <input
                type="text"
                name="careerField"
                value={form.careerField}
                onChange={handleChange}
                aria-label="Career Field"
              />
              {errors.careerField && <span className="error-text">{errors.careerField}</span>}
            </label>
          </section>

          <section className="input-col">
            <label>
              Qualifications
              <input
                type="text"
                name="qualifications"
                value={form.qualifications}
                onChange={handleChange}
                aria-label="Qualifications"
              />
              {errors.qualifications && <span className="error-text">{errors.qualifications}</span>}
            </label>
          </section>
        </section>

        <ResearchInterests
          interests={form.researchInterests}
          onAdd={handleAddInterest}
          onRemove={handleRemoveInterest}
          error={errors.researchInterests}
          inputValue={form.interestInput}
          onInputChange={handleChange}
        />

        <button type="submit" disabled={isSubmitting} aria-label="Submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {submitStatus && (
          <section className={`alert ${submitStatus.success ? "alert-success" : "alert-danger"}`}>
            {submitStatus.message}
          </section>
        )}
      </form>
    </section>
  );
};

export default ReviewerSignup;
