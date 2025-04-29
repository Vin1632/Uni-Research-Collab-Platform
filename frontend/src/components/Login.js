import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/login.css";

import { get_Users } from "../services/login_service";

const Login = () => {
  const [error, setError] = useState("");
  const { googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await googleSignIn();
      const userEmail = user.user.email;
      
      const data = await get_Users(userEmail);
      console.log(data);
      if (data.length > 0 && data[0].email === userEmail) {
        navigate("/home");
      } else {
        navigate("/choose-role", { state: { email: userEmail } });
        
      }
  
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
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
              <p>Don't have an account?</p>
            </div>
            <GoogleButton className="g-btn" type="dark" onClick={handleGoogleSignIn} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
