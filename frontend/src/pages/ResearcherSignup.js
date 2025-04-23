import React, { useState } from "react";
import { Form, Button, Alert, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { login_service } from "../services/login_service"
import '../styles/ResearchersignUp.css';
const ResearcherSignup = () => {
  const [form, setForm] = useState({
    fullName: "",
    institution: "",
    careerField: "",
    qualifications: "",
    careerPath: "",
    researchInterestInput: "",
    researchInterests: [],
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s-]+$/.test(form.fullName)) {
      newErrors.fullName = "Full name must only contain letters, spaces, or hyphens.";
    }
    if (!form.institution.trim()) newErrors.institution = "Institution is required.";
    if (!form.careerField.trim()) newErrors.careerField = "Career field is required.";
    if (!form.qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (form.qualifications.length < 10) {
      newErrors.qualifications = "Qualifications must be at least 10 characters long.";
    }
    if (!form.careerPath.trim()) newErrors.careerPath = "Career path is required.";
    if (form.researchInterests.length === 0) {
      newErrors.researchInterests = "At least one research interest is required.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    const trimmed = form.researchInterestInput.trim();
    if (!trimmed) {
      setErrors({ ...errors, researchInterests: "Research interest cannot be empty." });
      return;
    }
    if (form.researchInterests.includes(trimmed)) {
      setErrors({ ...errors, researchInterests: "This interest is already added." });
      return;
    }
    setForm({
      ...form,
      researchInterests: [...form.researchInterests, trimmed],
      researchInterestInput: "",
    });
    setErrors({ ...errors, researchInterests: null }); 
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

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        console.log("Submitting:", form);
        setSubmitStatus({ success: true, message: "Submitted successfully!" });
        setTimeout(() => {
          navigate("/home", { state: { role: "researcher" }}); //Navigate to the home
        }, 2000);
        login_service(form.fullName, email, "researcher", form.institution, form.qualifications, JSON.stringify(form.researchInterests));
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus({ success: false, message: "Failed to submit. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section
      className="form-container"
      
    >
      <Form onSubmit={handleSubmit}>
        <h3>Researcher Details</h3>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            isInvalid={!!errors.fullName}
          />
          <Form.Control.Feedback type="invalid" className="text-danger">
            {errors.fullName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            name="institution"
            placeholder="Institution Name"
            value={form.institution}
            onChange={handleChange}
            isInvalid={!!errors.institution}
          />
          <Form.Control.Feedback type="invalid" className="text-danger">
            {errors.institution}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            name="careerField"
            placeholder="Career Field"
            value={form.careerField}
            onChange={handleChange}
            isInvalid={!!errors.careerField}
          />
          <Form.Control.Feedback type="invalid" className="text-danger">
            {errors.careerField}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            name="qualifications"
            placeholder="Qualifications"
            value={form.qualifications}
            onChange={handleChange}
            isInvalid={!!errors.qualifications}
          />
          <Form.Control.Feedback type="invalid" className="text-danger">
            {errors.qualifications}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            name="careerPath"
            placeholder="Career Path"
            value={form.careerPath}
            onChange={handleChange}
            isInvalid={!!errors.careerPath}
          />
          <Form.Control.Feedback type="invalid" className="text-danger">
            {errors.careerPath}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="box"
            type="text"
            placeholder="Add Research Interest"
            value={form.researchInterestInput}
            onChange={(e) =>
              setForm({ ...form, researchInterestInput: e.target.value })
            }
          />
          <Button className="btn mt-2" onClick={handleAddInterest}>
            Add Interest
          </Button>
        </Form.Group>

        {form.researchInterests.length === 0 ? (
          <Form.Text className="text-muted">No interests added yet.</Form.Text>
        ) : (
          <section className="interests-container mt-3">
            {form.researchInterests.map((interest, idx) => (
              <Badge key={idx} bg="info" className="m-1 p-2">
                {interest}{" "}
                <span
                  style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
                  onClick={() => handleRemoveInterest(interest)}
                >
                  ✕
                </span>
              </Badge>
            ))}
          </section>
        )}

        {errors.researchInterests && (
          <Form.Text className="text-danger">
            {errors.researchInterests}
          </Form.Text>
        )}

        <Button type="submit" className="btn mt-3" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        {submitStatus && (
          <Alert
            variant={submitStatus.success ? "success" : "danger"}
            className="mt-3"
          >
            {submitStatus.message}
          </Alert>
        )}
      </Form>
    </section>
  );
};

export default ResearcherSignup;
