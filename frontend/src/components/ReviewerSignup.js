import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";

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
    if (form.researchInterests.length === 0)
      newErrors.researchInterests = "At least one interest is required.";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log("Submitting reviewer form:", form);

        // 🔻 Uncomment and use this when backend is ready
        /*
        await setDoc(doc(firestore, "users", user.uid), {
          ...form,
          role: "reviewer",
        });
        */

        setSubmitStatus({ success: true, message: "Submitted successfully!" });
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus({ success: false, message: "Failed to submit. Please try again." });
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Reviewer Details</h3>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Institution Name</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                isInvalid={!!errors.institution}
              />
              <Form.Control.Feedback type="invalid">
                {errors.institution}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Career Field</Form.Label>
              <Form.Control
                type="text"
                name="careerField"
                value={form.careerField}
                onChange={handleChange}
                isInvalid={!!errors.careerField}
              />
              <Form.Control.Feedback type="invalid">
                {errors.careerField}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Qualifications</Form.Label>
              <Form.Control
                type="text"
                name="qualifications"
                value={form.qualifications}
                onChange={handleChange}
                isInvalid={!!errors.qualifications}
              />
              <Form.Control.Feedback type="invalid">
                {errors.qualifications}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Research Interests</Form.Label>
              <Row className="g-2">
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="Add an interest"
                    value={form.interestInput}
                    onChange={(e) =>
                      setForm({ ...form, interestInput: e.target.value })
                    }
                  />
                </Col>
                <Col xs={4}>
                  <Button variant="secondary" onClick={handleAddInterest}>
                    Add
                  </Button>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col>
                  {form.researchInterests.map((interest, idx) => (
                    <Badge
                      bg="info"
                      key={idx}
                      className="me-2 mb-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      {interest} ✕
                    </Badge>
                  ))}
                  {errors.researchInterests && (
                    <Form.Text className="text-danger">
                      {errors.researchInterests}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {submitStatus && (
        <Row className="mt-4">
          <Col>
            <Alert variant={submitStatus.success ? "success" : "danger"}>
              {submitStatus.message}
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ReviewerSignup;
