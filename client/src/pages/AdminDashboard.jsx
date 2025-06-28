import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/admindashboard.css";

const AdminDashboard = () => {
  const [view, setView] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const url = view === "pending"
        ? "https://somapoa.onrender.com/admin/applications/pending"
        : "https://somapoa.onrender.com/admin/applications/eligible";

      const res = await authFetch(url);
      if (!res.ok) throw new Error("Failed to fetch applications");
      
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [view]);

  const handleStatusUpdate = async (id, action) => {
    try {
      const url = action === "award"
        ? `https://somapoa.onrender.com/admin/applications/${id}/award`
        : `https://somapoa.onrender.com/admin/applications/${id}/update`;

      const res = await authFetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "award" ? "awarded" : "rejected",
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return <span className="status-badge unknown">Unknown</span>;
    }

    const statusText = String(status).toLowerCase();
    
    const statusMap = {
      pending: { class: "pending", text: "Pending" },
      eligible: { class: "eligible", text: "Eligible" },
      awarded: { class: "awarded", text: "Awarded" },
      rejected: { class: "rejected", text: "Rejected" },
      default: { class: "unknown", text: status }
    };

    const currentStatus = statusMap[statusText] || statusMap.default;
    return <span className={`status-badge ${currentStatus.class}`}>{currentStatus.text}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <h3>Error Loading Applications</h3>
        <p>{error}</p>
        <button onClick={fetchApplications} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <Link to="/admin/create-program" className="create-program-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Programme
          </Link>

          <Link to="/admin/programmes" className="manage-programmes-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Manage Programmes
          </Link>
        </div>
      </div>

      <div className="view-tabs">
        <button
          className={`tab-button ${view === "pending" ? "active" : ""}`}
          onClick={() => setView("pending")}
        >
          Pending Review
        </button>
        <button
          className={`tab-button ${view === "eligible" ? "active" : ""}`}
          onClick={() => setView("eligible")}
        >
          Eligible for Award
        </button>
      </div>

      <div className="applications-container">
        {applications.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h3>No Applications Found</h3>
            <p>There are currently no {view} applications.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="card-header">
                  <h3>{app.student || "Unknown Student"}</h3>
                  {getStatusBadge(app.status)}
                </div>
                
                <div className="card-details">
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{app.programme || "N/A"}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    <span>Score: {app.score || 'N/A'}</span>
                  </div>
                  
                  <div className="proof-links">
                    <a href={app.proofs?.income} target="_blank" rel="noopener noreferrer">
                      Income Proof
                    </a>
                    <a href={app.proofs?.academic} target="_blank" rel="noopener noreferrer">
                      Academic Proof
                    </a>
                  </div>
                </div>

                {view === "eligible" && (
                  <div className="card-actions">
                    <button 
                      onClick={() => handleStatusUpdate(app.id, "award")}
                      className="action-button award-button"
                    >
                      Award Bursary
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(app.id, "reject")}
                      className="action-button reject-button"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
