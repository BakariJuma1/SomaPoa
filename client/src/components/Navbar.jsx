import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, isLoading, setUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Missing toggle functions
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Missing initials function
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await fetch("https://somapoa.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser({}); // Reset to guest state
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    }
  };

  // Loading state: show minimal UI or skeleton
  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="logo">
            <span className="logo-highlight">Soma</span>Poa
          </NavLink>
          <div className="nav-links">Loading...</div>
        </div>
      </nav>
    );
  }

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
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`menu-line ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </NavLink>
            </>
          ) : (
            <>
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
                <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </NavLink>
              )}

              {/* Profile dropdown */}
              <div className="profile-avatar-container">
                <button
                  className="profile-avatar"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  {getInitials(user?.username || user?.name)}
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {getInitials(user?.username || user?.name)}
                      </div>
                      <div>
                        <div className="dropdown-name">{user?.username || "User"}</div>
                        {user?.email && (
                          <div className="dropdown-email">{user.email}</div>
                        )}
                      </div>
                    </div>
                    <NavLink 
                      to="/profile" 
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </NavLink>
                    <button 
                      className="dropdown-item logout" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;