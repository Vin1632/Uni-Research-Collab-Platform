import React from "react";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

const ChooseRole = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    try {
      // Simulated backend save
      // Save role to localStorage (temporary until backend is used)
      localStorage.setItem("role", role);
      if (role === "researcher") {
        navigate("/researcher-signup");
      } else {
        navigate("/reviewer-signup");
      }
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

  return (
    <main className="page-wrapper">
      <section className="glass-box text-center">
        <h2>Choose Your Role</h2>
        <Button variant="primary" className="btn-primary mb-3" onClick={() => handleRoleSelection("researcher")}>
          Researcher
        </Button>
        <Button variant="secondary" className="btn-secondary" onClick={() => handleRoleSelection("reviewer")}>
          Reviewer
        </Button>
      </section>
    </main>
  );
};

export default ChooseRole;
