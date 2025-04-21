import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ChooseRole = () => {
  const { setRole } = useUserAuth(); // Use setRole from context
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    const confirm = window.confirm(`Are you sure you want to select the ${role} role?`);
    if (!confirm) return;

    try {
      setIsLoading(true);
      setRole(role); // Save role in context and localStorage
      if (role === "researcher") {
        navigate("/researcher-signup");
      } else {
        navigate("/reviewer-signup");
      }
    } catch (error) {
      console.error("Error selecting role:", error);
      setErrorMessage("Failed to select role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <section className="glass-box text-center">
        <h2>Choose Your Role</h2>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button
          variant="primary"
          className="btn-primary mb-3"
          onClick={() => handleRoleSelection("researcher")}
          disabled={isLoading}
          aria-label="Select Researcher Role"
        >
          {isLoading ? "Loading..." : "Researcher"}
        </Button>
        <Button
          variant="secondary"
          className="btn-secondary"
          onClick={() => handleRoleSelection("reviewer")}
          disabled={isLoading}
          aria-label="Select Reviewer Role"
        >
          {isLoading ? "Loading..." : "Reviewer"}
        </Button>
      </section>
    </main>
  );
};

export default ChooseRole;
