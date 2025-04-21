import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ChooseRole from "./pages/ChooseRole";
import ResearcherSignup from "./pages/ResearcherSignup";
import ReviewerSignup from "./pages/ReviewerSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";


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

             
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;