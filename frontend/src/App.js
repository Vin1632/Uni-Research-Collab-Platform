import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ChooseRole from "./pages/ChooseRole";
import Profile from './components/Profile.js';
import Funding from './components/Funding.js';
import Milestones from './components/Milestones.js';
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
             <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/funding" element={<Funding />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/add-proposal" element={<AddProposals />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/choose-role" element={<ChooseRole />} />
              <Route path="/researcher-signup" element={<ResearcherSignup />} />
              <Route path="/reviewer-signup" element={<ReviewerSignup />} />
            </Route>
            <Route path="/" element={<Login />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;