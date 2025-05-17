import React, { useState, useRef } from "react";
import "../styles/ReviewerSignUp.css";
import { useNavigate } from "react-router-dom";
import { login_service } from "../services/login_service";
import { useUserAuth } from "../context/UserAuthContext";

const ResearchInterests = ({
  interests,
  onAdd,
  onRemove,
  error,
  inputValue,
  onInputChange,
  onKeyDown,
  inputRef
}) => (
  <section className="input-row full-width">
    <label>
      Research Interests
      <section className="input-row">
        <input
          type="text"
          name="interestInput"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
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
  const { user } = useUserAuth();
  const interestInputRef = useRef();

  const validateForm = () => {
    const newErrors = {};
    const fullNameTrimmed = form.fullName.trim();
    if (!/^[a-zA-Z\s]+$/.test(fullNameTrimmed)) {
      newErrors.fullName = "Full name must only contain letters.";
    }
    if (!form.institution.trim()) newErrors.institution = "Institution is required.";
    if (!form.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required.";
    } else if (form.qualifications.length < 10) {
      newErrors.qualifications = "Qualifications must be at least 10 characters long.";
    }
    if (form.researchInterests.length === 0) {
      newErrors.researchInterests = "At least one interest is required.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleAddInterest = () => {
    const trimmed = form.interestInput.trim();
    if (!trimmed) return;
    if (
      form.researchInterests.some(
        (i) => i.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        researchInterests: "This interest is already added.",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      researchInterests: [...prev.researchInterests, trimmed],
      interestInput: "",
    }));
    setErrors((prev) => ({ ...prev, researchInterests: null }));

    // Refocus the input
    interestInputRef.current?.focus();
  };

  const handleRemoveInterest = (tag) => {
    setForm((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((t) => t !== tag),
    }));
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
        await login_service(
          form.fullName,
          email,
          "reviewer",
          form.institution,
          form.qualifications,
          JSON.stringify(form.researchInterests)
        );
        setSubmitStatus({
          success: true,
          message: "Submitted successfully!",
        });
        navigate("/recommendations");
      } catch (error) {
        setSubmitStatus({
          success: false,
          message: "Failed to submit. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="form-wrapper">
      <form onSubmit={handleSubmit} className="reviewer-form">
        <fieldset disabled={isSubmitting}>
          <h3>Researcher Details</h3>

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
                {errors.fullName && (
                  <span className="error-text">{errors.fullName}</span>
                )}
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
                {errors.institution && (
                  <span className="error-text">{errors.institution}</span>
                )}
              </label>
            </section>
          </section>

          <section className="input-row">
            

            <section className="input-col">
              <label>
                Qualifications
                <select
                name="qualifications"
                value={form.qualifications}
                onChange={handleChange}
                aria-label="Qualifications"
              >
                <option value="">-- Select a Degree --</option>

                <optgroup label="Bachelor's Degrees">
                  <option value="BA">BA – Bachelor of Arts</option>
                  <option value="BS">BS – Bachelor of Science</option>
                  <option value="BBA">BBA – Bachelor of Business Administration</option>
                  <option value="BFA">BFA – Bachelor of Fine Arts</option>
                  <option value="BEd">BEd – Bachelor of Education</option>
                  <option value="BEng">BEng – Bachelor of Engineering</option>
                </optgroup>

                <optgroup label="Graduate Degrees">
                  <option value="MA">MA – Master of Arts</option>
                  <option value="MS">MS – Master of Science</option>
                  <option value="MBA">MBA – Master of Business Administration</option>
                  <option value="MEd">MEd – Master of Education</option>
                  <option value="MFA">MFA – Master of Fine Arts</option>
                  <option value="MEng">MEng – Master of Engineering</option>
                </optgroup>

                <optgroup label="Doctoral & Professional Degrees">
                  <option value="PhD">PhD – Doctor of Philosophy</option>
                  <option value="EdD">EdD – Doctor of Education</option>
                  <option value="MD">MD – Doctor of Medicine</option>
                  <option value="JD">JD – Juris Doctor (Law)</option>
                  <option value="DVM">DVM – Doctor of Veterinary Medicine</option>
                  <option value="PharmD">PharmD – Doctor of Pharmacy</option>
                </optgroup>
              </select>
                {errors.qualifications && (
                  <span className="error-text">{errors.qualifications}</span>
                )}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddInterest();
              }
            }}
            inputRef={interestInputRef}
          />

          <button type="submit" aria-label="Submit">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {submitStatus && (
            <section
              className={`alert ${
                submitStatus.success ? "alert-success" : "alert-danger"
              }`}
            >
              {submitStatus.message}
            </section>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default ReviewerSignup;
