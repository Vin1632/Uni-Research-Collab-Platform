import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import "../styles/ResearcherSignup.css";

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.institution.trim()) newErrors.institution = "Institution is required.";
    if (!form.careerField.trim()) newErrors.careerField = "Career field is required.";
    if (!form.qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (!form.careerPath.trim()) newErrors.careerPath = "Career path is required.";
    if (form.researchInterests.length === 0)
      newErrors.researchInterests = "At least one research interest is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    const trimmed = form.researchInterestInput.trim();
    if (trimmed && !form.researchInterests.includes(trimmed)) {
      setForm({
        ...form,
        researchInterests: [...form.researchInterests, trimmed],
        researchInterestInput: "",
      });
    }
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
      try {
        console.log("Submitting:", form);
        setSubmitStatus({ success: true, message: "Submitted successfully!" });
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus({ success: false, message: "Failed to submit. Please try again." });
      }
    }
  };

  return (
    <section
      className="form-container"
      style={{
        backgroundImage: "url('C:/Users/2595626/Desktop/Uni-Research-Collab-Platform/frontend/src/assets/bg.jpg')",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <h3>Researcher Details</h3>

        <Form.Control
          className="box"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          isInvalid={!!errors.fullName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.fullName}
        </Form.Control.Feedback>

        <Form.Control
          className="box"
          type="text"
          name="institution"
          placeholder="Institution Name"
          value={form.institution}
          onChange={handleChange}
          isInvalid={!!errors.institution}
        />
        <Form.Control.Feedback type="invalid">
          {errors.institution}
        </Form.Control.Feedback>

        <Form.Control
          className="box"
          type="text"
          name="careerField"
          placeholder="Career Field"
          value={form.careerField}
          onChange={handleChange}
          isInvalid={!!errors.careerField}
        />
        <Form.Control.Feedback type="invalid">
          {errors.careerField}
        </Form.Control.Feedback>

        <Form.Control
          className="box"
          type="text"
          name="qualifications"
          placeholder="Qualifications"
          value={form.qualifications}
          onChange={handleChange}
          isInvalid={!!errors.qualifications}
        />
        <Form.Control.Feedback type="invalid">
          {errors.qualifications}
        </Form.Control.Feedback>

        <Form.Control
          className="box"
          type="text"
          name="careerPath"
          placeholder="Career Path"
          value={form.careerPath}
          onChange={handleChange}
          isInvalid={!!errors.careerPath}
        />
        <Form.Control.Feedback type="invalid">
          {errors.careerPath}
        </Form.Control.Feedback>

        <Form.Control
          className="box"
          type="text"
          placeholder="Add Research Interest"
          value={form.researchInterestInput}
          onChange={(e) =>
            setForm({ ...form, researchInterestInput: e.target.value })
          }
        />
        <Button className="btn" onClick={handleAddInterest}>
          Add Interest
        </Button>

        {form.researchInterests.map((interest, idx) => (
          <p key={idx}>
            <span onClick={() => handleRemoveInterest(interest)}>
              {interest} ✕
            </span>
          </p>
        ))}

        {errors.researchInterests && (
          <Form.Text className="text-danger">
            {errors.researchInterests}
          </Form.Text>
        )}

        <Button type="submit" className="btn">
          Submit
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
