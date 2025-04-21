import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Save role locally (simulate backend write)
    localStorage.setItem('role', role);

    // Delay slightly to ensure localStorage is updated before navigating (just in case)
    setTimeout(() => {
      if (role === 'researcher') {
        navigate('/researcher-signup');
      } else if (role === 'reviewer') {
        navigate('/reviewer-signup');
      }
    }, 0);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2>Please select your role</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => handleRoleSelection('researcher')}>
            Researcher
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={() => handleRoleSelection('reviewer')}>
            Reviewer
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ChooseRole;
