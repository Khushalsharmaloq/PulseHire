import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

const Register = () => {
  const location = useLocation();

  const navigate = useNavigate();

  /*
   * Determine the registration portal from the URL.
   *
   * /candidate/register → candidate
   * /recruiter/register → recruiter
   */

  const selectedRole = location.pathname.startsWith("/recruiter")
    ? "recruiter"
    : "candidate";

  const roleTitle = selectedRole === "recruiter" ? "Recruiter" : "Candidate";

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      setError("");

      setSuccess("");

      const response = await fetch(
        "http://localhost:8000/api/v1/user/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullname: formData.fullname,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            role: selectedRole,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate(`/${selectedRole}/login`);
      }, 1200);
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
        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="auth-brand-panel">
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} />
            Back to PulseHire
          </Link>

          <div className="auth-brand-content">
            <div className="auth-logo">
              <BriefcaseBusiness size={24} />
            </div>

            <span className="auth-eyebrow">
              {roleTitle.toUpperCase()} PROFILE
            </span>

            <h1>
              {selectedRole === "candidate"
                ? "Make your skills visible."
                : "Build better hiring decisions."}
            </h1>

            <p>
              {selectedRole === "candidate"
                ? "Create your PulseHire account and start building an evidence-backed professional profile."
                : "Create your recruiter account and discover candidates through skills, proof, and hiring intelligence."}
            </p>

            <div className="register-benefits">
              <div>
                <CheckCircle2 size={18} />

                <span>
                  {selectedRole === "candidate"
                    ? "Build your skill profile"
                    : "Create and manage job openings"}
                </span>
              </div>

              <div>
                <CheckCircle2 size={18} />

                <span>
                  {selectedRole === "candidate"
                    ? "Submit proof for verification"
                    : "Review candidate applications"}
                </span>
              </div>

              <div>
                <CheckCircle2 size={18} />

                <span>
                  {selectedRole === "candidate"
                    ? "Discover your skill gaps"
                    : "Verify candidate skill proofs"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-label">
                {roleTitle.toUpperCase()} REGISTRATION
              </span>

              <h2>Create your account.</h2>

              <p>Start your PulseHire journey.</p>
            </div>

            <form className="auth-form register-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}

              {success && <div className="auth-success">{success}</div>}

              {/* FULL NAME */}

              <div className="auth-field">
                <label htmlFor="fullname">Full name</label>

                <div className="auth-input-wrapper">
                  <User size={18} />

                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="auth-field">
                <label htmlFor="email">Email address</label>

                <div className="auth-input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="auth-field">
                <label htmlFor="phoneNumber">Phone number</label>

                <div className="auth-input-wrapper">
                  <Phone size={18} />

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <div className="auth-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create {roleTitle} Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span>Already have an account?</span>

              <Link to={`/${selectedRole}/login`}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
