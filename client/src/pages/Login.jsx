import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch"; 
import "../assets/styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch(); // hook

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sets cookie with token
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      
      const testRes = await authFetch("http://localhost:5555/my-applications");

      if (testRes.ok) {
        navigate("/dashboard");
      } else {
        throw new Error("Login succeeded but session test failed");
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
