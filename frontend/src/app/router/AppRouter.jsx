import { Route, Routes } from "react-router-dom";

import Landing from "../../pages/Landing";

import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";

import CandidateDashboard from "../../pages/candidate/CandidateDashboard";
import CandidateProfile from "../../pages/candidate/CandidateProfile";
import SkillProof from "../../pages/candidate/SkillProof";
import SkillGap from "../../pages/candidate/SkillGap";
import Learning from "../../pages/candidate/Learning";
import Jobs from "../../pages/candidate/Jobs";
import JobDetails from "../../pages/candidate/JobDetails";
import Applications from "../../pages/candidate/Applications";

import RecruiterDashboard from "../../pages/recruiter/RecruiterDashboard";
import RecruiterCompany from "../../pages/recruiter/RecruiterCompany";
import RecruiterJobs from "../../pages/recruiter/RecruiterJobs";
import RecruiterCandidates from "../../pages/recruiter/RecruiterCandidates";
import RecruiterApplicationsOverview from "../../pages/recruiter/RecruiterApplicationsOverview";
import RecruiterApplications from "../../pages/recruiter/RecruiterApplications";
import RecruiterAnalytics from "../../pages/recruiter/RecruiterAnalytics";
import RecruiterSettings from "../../pages/recruiter/RecruiterSettings";
import SkillVerification from "../../pages/recruiter/SkillVerification";
import PostJob from "../../pages/recruiter/PostJob";

import AppShell from "../../components/layout/AppShell";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";


/* =========================================================
   PLACEHOLDER PAGE
   ========================================================= */

const PlaceholderPage = ({ title, description }) => {
  return (
    <section
      style={{
        minHeight: "420px",
        display: "grid",
        placeItems: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "10px",
            color: "var(--ph-primary)",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          PULSEHIRE
        </span>

        <h1
          style={{
            margin: 0,
            color: "var(--ph-text)",
            fontSize: "30px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              margin: "12px 0 0",
              color: "var(--ph-text-muted)",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
};


/* =========================================================
   UNAUTHORIZED PAGE
   ========================================================= */

const UnauthorizedPage = () => (
  <PlaceholderPage
    title="You don't have access to this workspace."
    description="Your account role does not have permission to view this area."
  />
);


/* =========================================================
   NOT FOUND PAGE
   ========================================================= */

const NotFoundPage = () => (
  <PlaceholderPage
    title="Page not found."
    description="The page you're looking for doesn't exist."
  />
);


/* =========================================================
   APP ROUTER
   ========================================================= */

const AppRouter = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC
          ===================================================== */}

      {/* LANDING PAGE */}

      <Route
        path="/"
        element={<Landing />}
      />


      {/* AUTHENTICATION */}

      <Route element={<PublicOnlyRoute />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* =====================================================
          SYSTEM
          ===================================================== */}

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />


      {/* =====================================================
          CANDIDATE
          ===================================================== */}

      <Route
        element={
          <ProtectedRoute requiredRole="candidate" />
        }
      >

        <Route
          element={
            <AppShell role="candidate" />
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
            element={<Applications />}
          />

        </Route>

      </Route>


      {/* =====================================================
          RECRUITER
          ===================================================== */}

      <Route
        element={
          <ProtectedRoute requiredRole="recruiter" />
        }
      >

        <Route
          element={
            <AppShell role="recruiter" />
          }
        >

          <Route
            path="/recruiter/dashboard"
            element={<RecruiterDashboard />}
          />

          <Route
            path="/recruiter/company"
            element={<RecruiterCompany />}
          />

          <Route
            path="/recruiter/jobs/new"
            element={<PostJob />}
          />

          <Route
            path="/recruiter/jobs"
            element={<RecruiterJobs />}
          />

          <Route
            path="/recruiter/candidates"
            element={<RecruiterCandidates />}
          />

          <Route
            path="/recruiter/applications"
            element={<RecruiterApplicationsOverview />}
          />

          <Route
            path="/recruiter/applications/:jobId"
            element={<RecruiterApplications />}
          />

          <Route
            path="/recruiter/analytics"
            element={<RecruiterAnalytics />}
          />

          <Route
            path="/recruiter/settings"
            element={<RecruiterSettings />}
          />

          <Route
            path="/recruiter/verification"
            element={<SkillVerification />}
          />

        </Route>

      </Route>


      {/* =====================================================
          FALLBACK
          ===================================================== */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
};


export default AppRouter;