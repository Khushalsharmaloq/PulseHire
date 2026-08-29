import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import Candidates from "./pages/recruiter/Candidates";
import CandidateDetail from "./pages/recruiter/CandidateDetail";
import Verification from "./pages/recruiter/Verification";
import RecruiterApplications from "./pages/recruiter/Applications";
import JobDetails from "./pages/candidate/JobDetails";
import Analytics from "./pages/recruiter/Analytics";

import "./App.css";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);

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
          {/* =========================
              LANDING
          ========================= */}
          <Route path="/" element={<LandingPage />} />
          {/* =========================
              CANDIDATE AUTH
          ========================= */}
          <Route path="/candidate/login" element={<Login />} />
          <Route path="/candidate/register" element={<Register />} />
          {/* =========================
              RECRUITER AUTH
          ========================= */}
          <Route path="/recruiter/login" element={<Login />} />
          <Route path="/recruiter/register" element={<Register />} />

          {/*========================= 
          CANDIDATE DASHBOARD
          =========================*/}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          {/*========================= 
          CANDIDATE PROFILE
          =========================*/}
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          {/*========================= 
          CANDIDATE SKILL PROOF
          =========================*/}
          <Route path="/candidate/skill-proof" element={<SkillProof />} />
          {/*============================
          CANDIDATE SKILL GAP
          ============================*/}
          <Route path="/candidate/skill-gap" element={<SkillGap />} />
          {/*============================
          CANDIDATE LEARNING
          ============================*/}
          <Route path="/candidate/learning" element={<Learning />} />
          {/*============================
          CANDIDATE JOBS
          ============================*/}
          <Route path="/candidate/jobs" element={<Jobs />} />
          {/*============================
          CANDIDATE APPLICATIONS
          ============================*/}
          <Route
            path="/candidate/applications"
            element={<CandidateApplications />}
          />

          {/*============================
          RECRUITER DASHBOARD
          ============================*/}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          {/*============================
          RECRUITER JOBS
          ============================*/}
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          {/*============================
          RECRUITER CREATE JOB
          ============================*/}
          <Route path="/recruiter/jobs/create" element={<CreateJob />} />
          {/*============================
          RECRUITER CANDIDATES
          ============================*/}
          <Route path="/recruiter/candidates" element={<Candidates />} />

          {/*============================
          RECRUITER CANDIDATE DETAIL
          ============================*/}
          <Route
            path="/recruiter/candidates/:candidateId"
            element={<CandidateDetail />}
          />
          {/*============================
          RECRUITER VERIFICATION
          ============================*/}
          <Route path="/recruiter/verification" element={<Verification />} />

          {/*============================
          RECRUITER APPLICATIONS
          ============================*/}
          <Route
            path="/recruiter/applications"
            element={<RecruiterApplications />}
          />
          {/*============================
          CANDIDATE JOB DETAILS
          ============================*/}
          <Route path="/candidate/jobs/:jobId" element={<JobDetails />} />
          {/*============================
          RECRUITER ANALYTICS
          ============================*/}
          <Route path="/recruiter/analytics" element={<Analytics />} />

          {/* =========================
              FALLBACK
          ========================= */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
