import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginComponent from "./components/LoginComponent";
import SignupComponent from "./components/SignupComponent";
import VerifyOtp from "./components/verifyOtpComponent";
import UserLandingPage from "./pages/user/UserLandingPage";
import BecomeFreelancerForm from "./pages/freelancer/BecomeAfreelancer";
import AdminLogin from "./pages/admin/adminLogin";
import AdminLandingPage from "./pages/admin/adminLandingPage";
import ClientManagement from "./pages/admin/ClientManagement";
import FreelancerLandingPage from "./pages/freelancer/freelancerLandingPage";
import FreelancerManagement from "./pages/admin/FreelancerManagement";
import JobPostForm from "./components/client/JobPost/JobPostForm";
import FreelancerProfile from "./pages/freelancer/ProfileOverview";
import AdminRouteGuard from "./router/AdminRouteGuard";
import AdminLoginGuard from "./router/AdminLoginGuard";
import JobListPage from "./pages/freelancer/JobListPage";
import { useDispatch,useSelector } from "react-redux";
import socket from "./socket/socket";
import { RootState } from "./state/store";
import AllJobPostsPage from "./pages/user/AllJobPostsPage";
import JobBidPage from "./pages/freelancer/JobBidPage";
import FreelancerRouteGuard from "./router/FreelancerRouteGuard";
import ClientRouteGuard from "./router/ClientRouteGuard";
import MyJobDetails from "./pages/user/MyJobdetails";
import MyBids from "./pages/freelancer/MyBids";
import MyBidsDetails from "./pages/freelancer/MyBidDetails";
import FreelancerProfileView from "./pages/user/FreelancerProfileView";
import SkillManagementPage from "./pages/admin/SkillManagementPage";
import Checkout from "./pages/user/Checkout";
import PaymentSuccessPage from "./pages/user/PaymentSuccessPage";
import MyOders from "./pages/freelancer/MyOders";
function App() {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const userID = user?._id

  socket.on('connect', () => {
    console.log('Connected to server with socket ID:', socket.id);
  });
  
  useEffect(() => {
    // Register user when component mounts
    if (userID) {
      console.log(`Registering user with ID: ${userID}`);
      socket.emit("registerUser", userID); // Register user with socket ID
    }
  }, [ userID]);

  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/verification" element={<VerifyOtp />} />

        {/* ------------------- Client --------------------- */}
        
      <Route element={<ClientRouteGuard/>}>
        <Route path="/home" element={<UserLandingPage />} />
        <Route path="/become-a-freelancer" element={<BecomeFreelancerForm />} />
        <Route path="/post-a-job" element={<JobPostForm />} />
        <Route path="/my-job-post" element={<AllJobPostsPage />} />
        <Route path="/job/details" element={<MyJobDetails/>} />
        <Route path="/job/:view" element={<MyJobDetails />} />
        <Route path="/freelancer-info" element={<FreelancerProfileView />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<PaymentSuccessPage />} />

      </Route>

        {/* ------------------- freelancer -------------------- */}


      <Route element={<FreelancerRouteGuard/>}>
        <Route path="/freelancer" element={<FreelancerLandingPage />} />
        <Route path="/freelancer/profile" element={<FreelancerProfile />} />
        <Route path="/freelancer/job-list" element={<JobListPage />} />
        <Route path="/freelancer/job/details" element={<JobBidPage/>} />
        <Route path="/freelancer/job/:view" element={<JobBidPage />} />
        <Route path="/freelancer/your-bids" element={<MyBids />} />
        <Route path="/freelancer/your-bids/details" element={<MyBidsDetails />} />
        <Route path="/freelancer/your-orders" element={<MyOders />} />


      </Route>
        {/* admin */}

        <Route path="/admin/login" element={<AdminLoginGuard element={<AdminLogin />} />} />

        <Route element={<AdminRouteGuard />}>
          <Route path="/admin/" element={<AdminLandingPage />} />
          <Route path="/admin/clients" element={<ClientManagement />} />
          <Route path="/admin/freelancer" element={<FreelancerManagement />} />
          <Route path="/admin/skills" element={<SkillManagementPage />} />

        </Route>
      </Routes>
    </Router>
  ); 
}

export default App;
