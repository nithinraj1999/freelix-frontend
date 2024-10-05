import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import AdminRouteGuard from "./router/AdminRouteGuard";
import AdminLoginGuard from "./router/AdminLoginGuard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/verification" element={<VerifyOtp />} />
        <Route path="/home" element={<UserLandingPage />} />
        <Route path="/become-a-freelancer" element={<BecomeFreelancerForm />} />

        {/* ------------------- Client --------------------- */}


        <Route path="/post-a-job" element={<JobPostForm />} />

        {/* ------------------- freelancer -------------------- */}

        <Route path="/freelancer" element={<FreelancerLandingPage />} />

        <Route
          path="/admin/login"
          element={<AdminLoginGuard element={<AdminLogin />} />}
        />

        <Route element={<AdminRouteGuard />}>
          <Route path="/admin/" element={<AdminLandingPage />} />
          <Route path="/admin/clients" element={<ClientManagement />} />
          <Route path="/admin/freelancer" element={<FreelancerManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
