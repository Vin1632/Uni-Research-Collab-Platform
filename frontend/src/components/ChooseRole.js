// frontend/src/pages/ChooseRole.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Simulate role selection and redirect user
    localStorage.setItem('role', role); // Store role in localStorage for now
    
    // Redirect to the corresponding page based on role
    if (role === 'researcher') {
      navigate('/researcher-dashboard');
    } else if (role === 'reviewer') {
      navigate('/reviewer-dashboard');
    }
  };

  return (
    <section>
      <h2>Please select your role</h2>
      <button onClick={() => handleRoleSelection('researcher')}>Researcher</button>
      <button onClick={() => handleRoleSelection('reviewer')}>Reviewer</button>
    </section>
  );
};

export default ChooseRole;
