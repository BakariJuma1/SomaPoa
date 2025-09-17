import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "", // ✅ NEW: field for OTP input
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false); // ✅ control OTP step
  const [message, setMessage] = useState(""); // ✅ optional success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      if (!showOtpField) {
        // ✅ Step 1: Register and trigger OTP
        const res = await fetch("https://somapoa.onrender.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Registration failed");
        }

        // ✅ Show OTP input
        setShowOtpField(true);
        setMessage("An OTP has been sent to your email.");
      } else {
        // ✅ Step 2: Verify OTP
        const otpRes = await fetch("https://somapoa.onrender.com/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username:formData.username, 
            otp: formData.otp,
          }),
        });

        if (!otpRes.ok) {
          const data = await otpRes.json();
          throw new Error(data.message || "Invalid OTP");
        }

        // ✅ Success
        setMessage("Account verified successfully. Redirecting...");
        setTimeout(() => navigate("/login"), 1500); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="logo">
            <span className="logo-highlight">Soma</span>Poa
          </Link>
          <h2>Create Your Account</h2>
          <p>Join thousands of students accessing educational funding</p>
        </div>

        {(error || message) && (
          <div className={`message-box ${error ? "error-message" : "success-message"}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
            <span>{error || message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {!showOtpField && (
            <>
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
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  required
                />
                <p className="password-hint">
                  Use at least 8 characters with a mix of letters and numbers
                </p>
              </div>
            </>
          )}

          {showOtpField && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
          )}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : showOtpField ? "Verify OTP" : "Create Account"}
          </button>
        </form>

        {!showOtpField && (
          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
