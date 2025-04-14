import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
// import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/login.css";

// // FontAwesome imports
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await logIn(email, password);
  //     navigate("/home");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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

            {/* <Form onSubmit={handleSubmit}>
              <div className="input-box">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i><FontAwesomeIcon icon={faEnvelope} /></i>
              </div>

              <div className="input-box">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i><FontAwesomeIcon icon={faLock} /></i>
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>

              <button className="btn" type="submit">
                Log In
              </button>
            </Form> */}

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