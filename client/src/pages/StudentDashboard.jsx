import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import useAuthFetch from "../hooks/useAuthFetch";
import { Link } from "react-router-dom";
import "../assets/styles/studentdashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const authFetch = useAuthFetch();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await authFetch("http://localhost:5555/my-applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        } else {
          console.error("Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching apps:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "student") {
      fetchApplications();
    }
  }, [user, authFetch]);

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

return (
    <div className="dashboard-container">
        <div className="dashboard-header">
            <div className="welcome-section">
                <h1>Welcome back, {user.username}</h1>
                <p className="subtitle">Here's your application overview</p>
            </div>
            
            {user.role === "student" && (
                <Link to="/my-applications" className="new-application-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    My Applications
                </Link>
            )}
        </div>

        {user.role === "student" && (
            <div className="dashboard-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3>No Applications Yet</h3>
                        <p>You haven't applied for any bursary programmes.</p>
                        <Link to="/apply" className="btn-primary">Apply Now</Link>
                    </div>
                ) : (
                    <>
                        <div className="stats-summary">
                            <div className="stat-card">
                                <h3>{applications.length}</h3>
                                <p>Total Applications</p>
                            </div>
                            <div className="stat-card">
                                <h3>{applications.filter(app => app.status === 'Approved').length}</h3>
                                <p>Approved</p>
                            </div>
                            <div className="stat-card">
                                <h3>{applications.filter(app => app.status === 'Pending').length}</h3>
                                <p>Pending</p>
                            </div>
                        </div>

                        <div className="applications-grid">
                            {applications.map((app) => (
                                <div key={app.application_id} className="application-card">
                                    <div className="card-header">
                                        <h3>{app.programme}</h3>
                                        <span className={`status-badge ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="card-details">
                                        <div className="detail-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>Applied on: {new Date(app.applied_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 8v4l3 3" />
                                            </svg>
                                            <span>Last updated: {new Date(app.updated_at || app.applied_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Link to={`/application/${app.application_id}`} className="view-details-btn">
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        )}

        {user.role === "admin" && (
            <div className="admin-dashboard">
                <h2>Admin Dashboard</h2>
                <p>Administrator tools and statistics will appear here</p>
                <div className="admin-actions">
                    <Link to="/admin/applications" className="admin-btn">
                        View All Applications
                    </Link>
                    <Link to="/admin/programmes" className="admin-btn">
                        Manage Programmes
                    </Link>
                </div>
            </div>
        )}
    </div>
);
};

export default Dashboard;