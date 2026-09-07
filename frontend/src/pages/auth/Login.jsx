import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/login", credentials);

      if (response.data?.success) {
        login(response.data.user);

        const role = response.data.user.role;

        if (role === "candidate") {
          navigate("/candidate/dashboard");
        } else if (role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        }
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#0d1b2a",
          padding: "32px",
          borderRadius: "16px",
        }}
      >
        <h1>PulseHire Login</h1>

        <p>
          Login to continue to your PulseHire account.
        </p>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                padding: "12px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                padding: "12px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;