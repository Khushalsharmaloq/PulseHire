import { useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     HANDLE INPUT
     ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* =====================================================
     ROLE SELECTION
     ===================================================== */

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    if (error) {
      setError("");
    }
  };

  /* =====================================================
     VALIDATION
     ===================================================== */

  const validateForm = () => {
    const fullname = formData.fullname.trim();

    const email = formData.email.trim().toLowerCase();

    const phoneNumber = formData.phoneNumber.trim();

    if (!fullname) {
      return "Please enter your full name.";
    }

    if (fullname.length < 2) {
      return "Full name must contain at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please provide a valid email address.";
    }

    if (!phoneNumber) {
      return "Please enter your phone number.";
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must contain exactly 10 digits.";
    }

    if (!formData.password) {
      return "Please create a password.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!["candidate", "recruiter"].includes(formData.role)) {
      return "Please choose whether you are joining as a candidate or recruiter.";
    }

    return "";
  };

  /* =====================================================
     SUBMIT
     ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      setSubmitting(true);

      const data = await register({
        fullname: formData.fullname.trim(),

        email: formData.email.trim().toLowerCase(),

        phoneNumber: formData.phoneNumber.trim(),

        password: formData.password,

        role: formData.role,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Unable to create your account.");
      }

      setSuccess("Account created successfully. Redirecting you to sign in...");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            registered: true,
            email: formData.email.trim().toLowerCase(),
          },
        });
      }, 900);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-shell register-shell">
        {/* =================================================
            VISUAL SIDE
            ================================================= */}

        <div className="auth-visual register-visual">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-mark">PH</div>

            <span>PulseHire</span>
          </Link>

          <div className="auth-visual-content">
            <span className="auth-eyebrow">BUILD YOUR PROFESSIONAL SIGNAL</span>

            <h1>
              Don't just list your skills.
              <br />
              Prove them.
            </h1>

            <p>
              Create your PulseHire account and build a professional profile
              based on skills, evidence, verification and real opportunities.
            </p>

            <div className="register-benefits">
              <div>
                <div className="register-benefit-icon">
                  <Check size={14} />
                </div>

                <span>Build an evidence-backed profile</span>
              </div>

              <div>
                <div className="register-benefit-icon">
                  <Check size={14} />
                </div>

                <span>Discover roles matched to verified skills</span>
              </div>

              <div>
                <div className="register-benefit-icon">
                  <Check size={14} />
                </div>

                <span>Track your professional progress</span>
              </div>
            </div>

            <div className="auth-trust-row">
              <ShieldCheck size={18} />

              <span>Designed around trustworthy, evidence-backed hiring.</span>
            </div>
          </div>
        </div>

        {/* =================================================
            FORM SIDE
            ================================================= */}

        <section className="auth-card register-card">
          <div className="auth-card-header">
            <span className="auth-eyebrow">CREATE YOUR ACCOUNT</span>

            <h2>Join PulseHire</h2>

            <p>Start building your professional identity.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {success && (
            <div className="register-success" role="status" aria-live="polite">
              <Check size={16} />

              <span>{success}</span>
            </div>
          )}

          <form
            className="auth-form register-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* =================================================
                ROLE
                ================================================= */}

            <fieldset className="register-role-fieldset">
              <legend>I am joining as</legend>

              <div className="register-role-grid">
                <label
                  className={`register-role-card ${
                    formData.role === "candidate" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === "candidate"}
                    onChange={() => handleRoleChange("candidate")}
                    disabled={submitting}
                  />

                  <span className="register-role-icon">
                    <User size={18} />
                  </span>

                  <span className="register-role-content">
                    <strong>Candidate</strong>

                    <small>Find opportunities and prove your skills.</small>
                  </span>

                  {formData.role === "candidate" && (
                    <span className="register-role-check">
                      <Check size={12} />
                    </span>
                  )}
                </label>

                <label
                  className={`register-role-card ${
                    formData.role === "recruiter" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === "recruiter"}
                    onChange={() => handleRoleChange("recruiter")}
                    disabled={submitting}
                  />

                  <span className="register-role-icon">
                    <BriefcaseBusiness size={18} />
                  </span>

                  <span className="register-role-content">
                    <strong>Recruiter</strong>

                    <small>Discover talent and manage opportunities.</small>
                  </span>

                  {formData.role === "recruiter" && (
                    <span className="register-role-check">
                      <Check size={12} />
                    </span>
                  )}
                </label>
              </div>
            </fieldset>

            {/* =================================================
                NAME
                ================================================= */}

            <div className="auth-field">
              <label htmlFor="fullname">Full name</label>

              <div className="auth-input-wrap">
                <User size={17} aria-hidden="true" />

                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.fullname}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* =================================================
                EMAIL
                ================================================= */}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={17} aria-hidden="true" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* =================================================
                PHONE
                ================================================= */}

            <div className="auth-field">
              <label htmlFor="phoneNumber">Phone number</label>

              <div className="auth-input-wrap">
                <Phone size={17} aria-hidden="true" />

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
                ================================================= */}

            <div className="register-password-grid">
              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <div className="auth-input-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm password</label>

                <div className="auth-input-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                PASSWORD RULE
                ================================================= */}

            <p className="register-password-note">
              Your password must contain at least 8 characters.
            </p>

            {/* =================================================
                SUBMIT
                ================================================= */}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}

              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-divider">
            <span />

            <small>Already have an account?</small>

            <span />
          </div>

          <Link to="/login" className="auth-secondary-action">
            Sign in instead
          </Link>

          <p className="auth-security-note">
            By creating an account, you join the PulseHire professional network.
          </p>
        </section>
      </section>
    </main>
  );
};

export default Register;
