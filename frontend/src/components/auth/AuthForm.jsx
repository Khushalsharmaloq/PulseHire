import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const AuthForm = ({
  role,
  onSubmit,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      email,
      password,
    });
  };

  const roleName =
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="email">
          Email address
        </label>

        <div className="auth-input-wrapper">
          <Mail size={18} />

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="password">
          Password
        </label>

        <div className="auth-input-wrapper">
          <LockKeyhole size={18} />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        </div>
      </div>

      <div className="auth-security">
        <ShieldCheck size={16} />

        <span>
          Secure {roleName.toLowerCase()} access
        </span>
      </div>

      <button
        className="auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            Sign in as {roleName}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default AuthForm;