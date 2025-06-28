import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("https://somapoa.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const sessionRes = await authFetch("https://somapoa.onrender.com/me");
      if (!sessionRes.ok) throw new Error("Failed to fetch user session");

      const user = await sessionRes.json();

      if (user.role === "student") {
        navigate("/dashboard",{replace:true});
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        throw new Error("Unknown role. Contact support.");
      }

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo">
            <span className="logo-highlight">Soma</span>Poa
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;