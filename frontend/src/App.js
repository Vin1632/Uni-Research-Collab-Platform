import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ChooseRole from "./pages/ChooseRole";
import ResearcherSignup from "./pages/ResearcherSignup";
import ReviewerSignup from "./pages/ReviewerSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import AddProposals  from "./pages/AddProposal";
import Recommendations from "./pages/recommendations"


function App() {
  return (
    <Container>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
              <Route path="/choose-role" element={<ChooseRole />} />
              <Route path="/researcher-signup" element={<ResearcherSignup />} />
              <Route path="/reviewer-signup" element={<ReviewerSignup />} />
              <Route path="/add-proposal" element={<AddProposals />} />
              <Route path="/recommendations" element={<Recommendations />} />


            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;