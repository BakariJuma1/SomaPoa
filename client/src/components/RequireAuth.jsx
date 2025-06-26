import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"

const RequireAuth = ({ children, roles }) => {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5555/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in")
        return res.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

export default RequireAuth
