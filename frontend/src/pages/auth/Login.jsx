import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";


const Login = () => {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();


  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  const [showPassword, setShowPassword] =
    useState(false);


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      const email =
        formData.email
          .trim()
          .toLowerCase();


      if (!email) {
        setError(
          "Please enter your email address."
        );
        return;
      }


      if (!formData.password) {
        setError(
          "Please enter your password."
        );
        return;
      }


      try {

        setSubmitting(true);


        const data =
          await login({
            email,
            password:
              formData.password,
          });


        if (
          data.user?.role ===
          "candidate"
        ) {

          navigate(
            "/candidate/dashboard",
            {
              replace: true,
            }
          );

          return;
        }


        if (
          data.user?.role ===
          "recruiter"
        ) {

          navigate(
            "/recruiter/dashboard",
            {
              replace: true,
            }
          );

          return;
        }


        setError(
          "Your account has an unsupported role."
        );

      } catch (requestError) {

        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
            requestError?.message ||
            "Unable to log in. Please try again."
        );

      } finally {

        setSubmitting(false);

      }

    };


  return (
    <main className="auth-page">

      <section className="auth-shell">

        {/* =================================================
            BRAND / VALUE
            ================================================= */}

        <div className="auth-visual">

          <Link
            to="/"
            className="auth-brand"
          >

            <div className="auth-brand-mark">
              PH
            </div>

            <span>
              PulseHire
            </span>

          </Link>


          <div className="auth-visual-content">

            <span className="auth-eyebrow">
              EVIDENCE-BACKED HIRING
            </span>


            <h1>
              Your skills.
              <br />
              Your proof.
              <br />
              Your next opportunity.
            </h1>


            <p>
              PulseHire connects verified
              candidate capabilities with the
              opportunities where they matter.
            </p>


            <div className="auth-trust-row">

              <ShieldCheck
                size={18}
              />

              <span>
                Built around evidence,
                verification and meaningful
                skill intelligence.
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <section className="auth-card">

          <div className="auth-card-header">

            <span className="auth-eyebrow">
              WELCOME BACK
            </span>


            <h2>
              Sign in to PulseHire
            </h2>


            <p>
              Continue to your professional workspace.
            </p>

          </div>


          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={
              handleSubmit
            }
            noValidate
          >


            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="email">
                Email address
              </label>


              <div className="auth-input-wrap">

                <Mail
                  size={17}
                  aria-hidden="true"
                />


                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-field">

              <label htmlFor="password">
                Password
              </label>


              <div className="auth-input-wrap">

                <LockKeyhole
                  size={17}
                  aria-hidden="true"
                />


                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                  required
                />


                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}

                </button>

              </div>

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={
                submitting
              }
            >

              {submitting
                ? "Signing in..."
                : "Sign in"}

              <ArrowRight
                size={16}
              />

            </button>

          </form>


          <div className="auth-divider">
            <span />
            <small>
              New to PulseHire?
            </small>
            <span />
          </div>


          <Link
            to="/register"
            className="auth-secondary-action"
          >
            Create an account
          </Link>


          <p className="auth-security-note">
            Your session is protected by
            secure HTTP-only authentication.
          </p>

        </section>

      </section>

    </main>
  );
};


export default Login;