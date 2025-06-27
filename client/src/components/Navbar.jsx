import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://somapoa.onrender.com/me", {
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
    fetch("https://somapoa.onrender.com/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
      navigate("/login");
      setMobileMenuOpen(false);
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="logo">
          <span className="logo-highlight">Soma</span>Poa
        </NavLink>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" exact="true" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>

          {!user && (
            <>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}

          {user?.role === "student" && (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/my-applications" onClick={() => setMobileMenuOpen(false)}>
                My Applications
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </NavLink>
            </>
          )}

          {user && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;