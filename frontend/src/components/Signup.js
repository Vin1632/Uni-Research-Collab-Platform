import React, { useRef, useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signUp } = useUserAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signUp(emailRef.current.value, passwordRef.current.value);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <Container>
      <Row>
        <Col className="box2">
        <div className="wrapper">
        <h1 className="text-center mb-4">Sign Up</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="input-box">
              
              <Form.Control type="email" ref={emailRef} placeholder="Email" required />
            </Form.Group>

            <Form.Group id="password" className="input-box">
              
              <Form.Control type="password" ref={passwordRef} placeholder="Password" required />
            </Form.Group>

            <Form.Group id="password-confirm" className="input-box">
              
              <Form.Control type="password" ref={passwordConfirmRef} placeholder="Confirm Password" required />
            </Form.Group>

            <Button disabled={loading} className="btn" type="submit">
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form>
          <div className="register-link">
            <p>Already have an account? <Link to="/">Log In</Link></p>
          </div>
        </div>

        </Col>
      </Row>
    </Container>
  );
}
