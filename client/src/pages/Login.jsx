import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setInfo("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setInfo("");

    if (!showOtp) {
      // Step 1: Submit login credentials
      try {
        const res = await fetch("https://somapoa.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Invalid username or password");
        }

        setShowOtp(true);
        setInfo("OTP sent to your email. Please enter it below.");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2: Submit OTP
      try {
        const res = await fetch("https://somapoa.onrender.com/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username: formData.username, otp }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Invalid or expired OTP");
        }

        // Fetch user session using protected route
        const sessionRes = await authFetch("https://somapoa.onrender.com/me");
        if (!sessionRes.ok) throw new Error("Failed to fetch user session");

        const user = await sessionRes.json();

        if (user.role === "student") {
          navigate("/dashboard", { replace: true });
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          throw new Error("Unknown role. Please contact support.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
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

        {info && (
          <div className="info-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!showOtp ? (
            <>
              <div className="form-group">
                <label htmlFor="username">Username or Email</label>
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
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : showOtp ? (
              "Verify OTP"
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
