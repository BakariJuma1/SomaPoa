import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../assets/styles/navbar.css'

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // This simulates checking user status
  useEffect(() => {
    fetch("http://localhost:5555/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:5555/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">SomaPoa</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/my-applications">My Applications</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
