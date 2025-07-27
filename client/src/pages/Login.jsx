import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authFetch from "../hooks/useAuthFetch";
import { useAuth } from "../context/AuthProvider"; // ✅ Get context to update user
import "../assets/styles/login.css";

const Login = () => {
  const { setUser } = useAuth(); // ✅ Set user after successful login
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically focus OTP input when it's shown
  useEffect(() => {
    if (showOtp) {
      document.getElementById("otpInput")?.focus();
    }
  }, [showOtp]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      if (!showOtp) {
        // First step: send username/password
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

        // OTP sent successfully
        setInfo("OTP has been sent to your email.");
        setShowOtp(true);
      } else {
        // Second step: verify OTP
        const res = await fetch("https://somapoa.onrender.com/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            otp: otp,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Invalid or expired OTP");
        }

        // OTP verified → fetch user session
        const sessionRes = await authFetch("https://somapoa.onrender.com/me");
        if (!sessionRes.ok) {
          throw new Error("Failed to fetch user session.");
        }

        const user = await sessionRes.json();

        setUser(user); // ✅ Update context

        // Redirect based on role
        if (user.role === "student") {
          navigate("/dashboard", { replace: true });
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          throw new Error("Unknown role. Contact support.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{showOtp ? "Enter OTP" : "Login"}</h2>

        {!showOtp && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {showOtp && (
          <input
            id="otpInput"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : showOtp ? "Verify OTP" : "Login"}
        </button>

        {error && <p className="error-msg">{error}</p>}
        {info && <p className="info-msg">{info}</p>}
      </form>
    </div>
  );
};

export default Login;
