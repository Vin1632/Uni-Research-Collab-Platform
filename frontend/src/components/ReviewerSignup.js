import React, { useState } from "react";
import "../styles/ReviewerSignUp.css";

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.institution.trim()) newErrors.institution = "Institution is required.";
    if (!form.careerField.trim()) newErrors.careerField = "Career field is required.";
    if (!form.qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (form.researchInterests.length === 0) newErrors.researchInterests = "At least one interest is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    const trimmed = form.interestInput.trim();
    if (trimmed && !form.researchInterests.includes(trimmed)) {
      setForm({
        ...form,
        researchInterests: [...form.researchInterests, trimmed],
        interestInput: "",
      });
    }
  };

  const handleRemoveInterest = (tag) => {
    setForm({
      ...form,
      researchInterests: form.researchInterests.filter((t) => t !== tag),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log("Submitting reviewer form:", form);
        setSubmitStatus({ success: true, message: "Submitted successfully!" });
      } catch (error) {
        setSubmitStatus({ success: false, message: "Failed to submit. Please try again." });
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
              />
              {errors.qualifications && <span className="error-text">{errors.qualifications}</span>}
            </label>
          </section>
        </section>

        <section className="input-row full-width">
          <label>
            Research Interests
            <section className="input-row">
              <input
                type="text"
                name="interestInput"
                value={form.interestInput}
                onChange={handleChange}
                placeholder="Add an interest"
              />
              <button className="add-btn" onClick={handleAddInterest}>Add</button>
            </section>

            <section className="badge-container">
              {form.researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="interest-badge"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  {interest} ✕
                </span>
              ))}
              {errors.researchInterests && (
                <span className="error-text">{errors.researchInterests}</span>
              )}
            </section>
          </label>
        </section>

        <button type="submit">Submit</button>

        {submitStatus && (
          <section className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
            {submitStatus.message}
          </section>
        )}
      </form>
    </section>
  );
};

export default ReviewerSignup;
