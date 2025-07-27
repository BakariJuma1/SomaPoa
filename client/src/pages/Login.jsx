import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../assets/styles/login.css";

const Login = () => {
  const { setUser, isLoading: isAuthLoading } = useAuth(); // ✅ Use context loading state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showOtp) document.getElementById("otpInput")?.focus();
  }, [showOtp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!showOtp) {
        // Step 1: Send username/password
        const res = await fetch("https://somapoa.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Login failed. Please try again.");
        }

        setInfo("OTP has been sent to your email.");
        setShowOtp(true);
      } else {
        // Step 2: Verify OTP
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

        // Fetch updated user data
        const userRes = await fetch("https://somapoa.onrender.com/me", {
          credentials: "include",
        });
        const user = await userRes.json();

        setUser(user); // ✅ Update context

        // Redirect based on role
        navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{showOtp ? "Enter OTP" : "Login"}</h2>

        {!showOtp ? (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isSubmitting || isAuthLoading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isSubmitting || isAuthLoading}
            />
          </>
        ) : (
          <input
            id="otpInput"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={isSubmitting}
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting || isAuthLoading}
        >
          {isSubmitting ? "Processing..." : showOtp ? "Verify OTP" : "Login"}
        </button>

        {error && <p className="error-msg">{error}</p>}
        {info && <p className="info-msg">{info}</p>}
      </form>
    </div>
  );
};

export default Login;