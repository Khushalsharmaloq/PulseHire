import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import React from "react";
import AuthProvider from "./context/AuthProvider";

import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import LandingSections from "./components/landing/LandingSections";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import SkillProof from "./pages/candidate/SkillProof";
import SkillGap from "./pages/candidate/SkillGap";
import Learning from "./pages/candidate/Learning";
import Jobs from "./pages/candidate/Jobs";
import CandidateApplications from "./pages/candidate/Applications";
import JobDetails from "./pages/candidate/JobDetails";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import Candidates from "./pages/recruiter/Candidates";
import CandidateDetail from "./pages/recruiter/CandidateDetail";
import Verification from "./pages/recruiter/Verification";
import RecruiterApplications from "./pages/recruiter/Applications";
import Analytics from "./pages/recruiter/Analytics";

import "./App.css";

const LandingPage = () => {
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <Hero />
        <LandingSections />
      </main>
    </div>
  );
};

function App() {
  return (
   <BrowserRouter>
  <AuthProvider>
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/candidate/login"
        element={<Login />}
      />

      <Route
        path="/candidate/register"
        element={<Register />}
      />

      <Route
        path="/recruiter/login"
        element={<Login />}
      />

      <Route
        path="/recruiter/register"
        element={<Register />}
      />

      {/* CANDIDATE PROTECTED */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["candidate"]} />
        }
      >
        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />

        <Route
          path="/candidate/profile"
          element={<CandidateProfile />}
        />

        <Route
          path="/candidate/skill-proof"
          element={<SkillProof />}
        />

        <Route
          path="/candidate/skill-gap"
          element={<SkillGap />}
        />

        <Route
          path="/candidate/learning"
          element={<Learning />}
        />

        <Route
          path="/candidate/jobs"
          element={<Jobs />}
        />

        <Route
          path="/candidate/jobs/:jobId"
          element={<JobDetails />}
        />

        <Route
          path="/candidate/applications"
          element={<CandidateApplications />}
        />
      </Route>

      {/* RECRUITER PROTECTED */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["recruiter"]} />
        }
      >
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />

        <Route
          path="/recruiter/jobs/create"
          element={<CreateJob />}
        />

        <Route
          path="/recruiter/candidates"
          element={<Candidates />}
        />

        <Route
          path="/recruiter/candidates/:candidateId"
          element={<CandidateDetail />}
        />

        <Route
          path="/recruiter/verification"
          element={<Verification />}
        />

        <Route
          path="/recruiter/applications"
          element={<RecruiterApplications />}
        />

        <Route
          path="/recruiter/analytics"
          element={<Analytics />}
        />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<LandingPage />}
      />

    </Routes>
  </AuthProvider>
</BrowserRouter>
  );
}

export default App;
