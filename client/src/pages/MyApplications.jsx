import React, { useEffect, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";
import "../assets/styles/myapplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await authFetch("http://localhost:5555/my-applications");
        
        if (!res.ok) {
          throw new Error(res.status === 401 ? 
            "Please login to view applications" : 
            "Failed to fetch applications");
        }
        
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [authFetch]);

  const getStatusBadge = (status) => {
    const statusText = status?.toLowerCase() || 'unknown';
    
    const statusMap = {
      approved: { class: "approved", text: "Approved" },
      pending: { class: "pending", text: "Pending" },
      rejected: { class: "rejected", text: "Rejected" },
      default: { class: "", text: status || "Unknown" }
    };

    const currentStatus = statusMap[statusText] || statusMap.default;
    
    return (
      <span className={`status-badge ${currentStatus.class}`}>
        {currentStatus.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your applications...</p>
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
        <h3>Unable to load applications</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="home-button">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back
        </button>
        <h1>My Applications</h1>
        <div className="header-actions">
          {applications.length > 0 && (
            <span className="applications-count">
              {applications.length} {applications.length === 1 ? 'application' : 'applications'}
            </span>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h3>No Applications Yet</h3>
          <p>You haven't applied for any bursary programmes.</p>
          <button onClick={() => navigate('/apply')} className="primary-button">
            Apply Now
          </button>
        </div>
      ) : (
        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Status</th>
                <th>Score</th>
                <th>Eligibility</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_id} className="application-row">
                  <td className="programme-name">{app.programme}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td className="score">{app.score ?? 'N/A'}</td>
                  <td>
                    {app.is_eligible ? (
                      <span className="eligibility eligible">Eligible</span>
                    ) : (
                      <span className="eligibility not-eligible">Not Eligible</span>
                    )}
                  </td>
                  <td>{formatDate(app.applied_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;