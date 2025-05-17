import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ChooseRole from "./pages/ChooseRole";
import Profile from './components/Profile.js';
import Milestones from './components/Milestones.js';
import ResearcherSignup from "./pages/ResearcherSignup";
import ReviewerSignup from "./pages/ReviewerSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import AddProposals  from "./pages/AddProposal";
import Recommendations from "./pages/recommendations";
import ProjectDetails from './pages/project_details.js';
import ProjectDetailsUser from './pages/project_details_user.js';
import NotificationsPage from './pages/NotificationsPage.js';



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
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/add-proposal" element={<AddProposals />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/choose-role" element={<ChooseRole />} />
              <Route path="/researcher-signup" element={<ResearcherSignup />} />
              <Route path="/reviewer-signup" element={<ReviewerSignup />} />
              <Route path="/project_details" element={<ProjectDetails />} />
              <Route path="/project_details_user" element={<ProjectDetailsUser />} />
              <Route path="/notificationspage" element={<NotificationsPage />} />
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