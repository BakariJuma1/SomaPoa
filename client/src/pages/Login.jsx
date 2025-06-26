import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch(); // custom hook for authenticated fetches

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt login
      const res = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends and stores cookies
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      // Fetch session details to know who logged in
      const sessionRes = await authFetch("http://localhost:5555/me");
      if (!sessionRes.ok) throw new Error("Failed to fetch user session");

      const user = await sessionRes.json();

      // Redirect based on user role
      if (user.role === "student") {
        navigate("/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        throw new Error("Unknown role. Contact support.");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
