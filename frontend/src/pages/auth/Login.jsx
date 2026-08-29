import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

import AuthForm from "../../components/auth/AuthForm";

const Login = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Determine the login portal from the URL.
   *
   * /candidate/login  → candidate
   * /recruiter/login  → recruiter
   */

  const selectedRole = location.pathname.startsWith("/recruiter")
    ? "recruiter"
    : "candidate";

  const roleTitle = selectedRole === "recruiter" ? "Recruiter" : "Candidate";

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      /*
       * Store authenticated user.
       */

      localStorage.setItem("pulsehireUser", JSON.stringify(data.user));

      /*
       * Make sure the selected portal matches
       * the actual account role.
       */

      if (data.user?.role !== selectedRole) {
        localStorage.removeItem("pulsehireUser");

        throw new Error(
          `This account is registered as ${data.user?.role}, not ${selectedRole}.`,
        );
      }

      /*
       * Send the user to the correct dashboard.
       */

      if (selectedRole === "candidate") {
        navigate("/candidate/dashboard");
      } else {
        navigate("/recruiter/dashboard");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to PulseHire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-glow"></div>

      <div className="auth-layout">
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="auth-brand-panel">
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} />
            Back to PulseHire
          </Link>

          <div className="auth-brand-content">
            <div className="auth-logo">
              <BriefcaseBusiness size={24} />
            </div>

            <span className="auth-eyebrow">SKILLS. PROOF. POTENTIAL.</span>

            <h1>
              {selectedRole === "candidate"
                ? "Your skills deserve more than a resume."
                : "Hire based on capability, not just claims."}
            </h1>

            <p>
              {selectedRole === "candidate"
                ? "Sign in to build your evidence-backed skill profile, track verification, discover your skill gaps, and become more hiring-ready."
                : "Sign in to discover candidates, review applications, verify skill proofs, and make more informed hiring decisions."}
            </p>

            <div className="auth-value">
              <ShieldCheck size={19} />

              <span>
                {selectedRole === "candidate"
                  ? "Build a profile recruiters can trust."
                  : "Verify the skills behind the application."}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-label">
                {roleTitle.toUpperCase()} PORTAL
              </span>

              <h2>Welcome back.</h2>

              <p>Sign in to continue to PulseHire.</p>
            </div>

            <AuthForm
              role={selectedRole}
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <Link to={`/${selectedRole}/register`}>Create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
