import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/login.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();


  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await googleSignIn();
      const userEmail = user.user.email;
      setEmail(userEmail);
      navigate("/home");
      await logIn(email, password);
      setPassword("Hello");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col className="box2">
          <div className="wrapper">
            <h1>Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="register-link">
              <p>
                Don't have an account? 
              </p>
            </div>
            <GoogleButton className="g-btn" type="dark" onClick={handleGoogleSignIn} />

            
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;