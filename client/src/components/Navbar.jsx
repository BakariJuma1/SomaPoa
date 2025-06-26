import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "../assets/styles/navbar.css"

const Navbar = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5555/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in")
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = () => {
    fetch("http://localhost:5555/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null)
      navigate("/login")
    })
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        SomaPoa
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>

        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}

        {user?.role === "student" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/my-applications">My Applications</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
