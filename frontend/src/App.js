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
import ReviewerDashboard from "./components/ReviewerDashboard.js";
import Review from "./pages/review.js";
import ReviewDetails from "./pages/review_details.js";
import MyReviews from "./pages/my_reviews.js";
import ReviewDetailsUser from "./pages/review_details_user.js"; 
import AdminDashboard from "./admin_wrapper/AdminDashboard";
import NotificationPage from "./pages/NotificationsPage.js";
import ChatApp from "./components/ChatApp.js";


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
              <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
              <Route path="/review" element={<Review />} />
              <Route path="/review/:project_id" element={<ReviewDetails />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/review-details-user" element={<ReviewDetailsUser />} />
              <Route path="/notificationspage" element={<NotificationPage/>}/> 
              <Route path="/ChatApp" element={<ChatApp />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
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