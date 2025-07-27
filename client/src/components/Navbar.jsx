import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      setDropdownOpen(false);
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="logo">
          <span className="logo-highlight">Soma</span>Poa
        </NavLink>

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
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
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
            <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Admin Dashboard
            </NavLink>
          )}

          {/* Profile Avatar Dropdown */}
          {user && (
            <div className="profile-avatar-container">
              <button
                className="profile-avatar"
                onClick={toggleDropdown}
                aria-label="User menu"
              >
                {getInitials(user.username || user.name)}
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {getInitials(user.username || user.name)}
                    </div>
                    <div>
                      <div className="dropdown-name">{user.username || "User"}</div>
                      {user.email && (
                        <div className="dropdown-email">{user.email}</div>
                      )}
                    </div>
                  </div>
                  <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </NavLink>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
