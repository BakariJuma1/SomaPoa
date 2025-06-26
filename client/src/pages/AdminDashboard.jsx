// pages/AdminDashboard.js
import { useState, useEffect } from "react"
import useAuthFetch from "../hooks/useAuthFetch"
import "../assets/styles/admindashboard.css"; 

const AdminDashboard = () => {
  const [view, setView] = useState("pending") // 'pending' or 'eligible'
  const [applications, setApplications] = useState([])
  const authFetch = useAuthFetch()

  const fetchApplications = async () => {
    const url =
      view === "pending"
        ? "http://localhost:5555/admin/applications/pending"
        : "http://localhost:5555/admin/applications/eligible"

    const res = await authFetch(url)
    const data = await res.json()
    setApplications(data)
  }

  useEffect(() => {
    fetchApplications()
  }, [view])

  const handleStatusUpdate = async (id, action) => {
    const url =
      action === "award"
        ? `http://localhost:5555/admin/applications/${id}/award`
        : `http://localhost:5555/admin/applications/${id}/update`

    const res = await authFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: action === "award" ? "awarded" : "rejected",
      }),
    })

    if (res.ok) {
      fetchApplications()
    }
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="tabs">
        <button onClick={() => setView("pending")}>Pending</button>
        <button onClick={() => setView("eligible")}>Eligible</button>
      </div>

      <div className="applications">
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="application-card">
              <h4>{app.student}</h4>
              <p>Programme: {app.programme}</p>
              <p>Score: {app.score}</p>
              <p>Status: {app.status}</p>
              <p>
                <a href={app.proofs?.income} target="_blank">Income Proof</a> |{" "}
                <a href={app.proofs?.academic} target="_blank">Academic Proof</a>
              </p>

              {view === "eligible" && (
                <div>
                  <button onClick={() => handleStatusUpdate(app.id, "award")}>
                    ✅ Award
                  </button>
                  <button onClick={() => handleStatusUpdate(app.id, "reject")}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
