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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username} 👋</h2>

      {user.role === "student" && (
        <>
          <p className="highlight">Here’s a summary of your bursary applications:</p>

          <Link to="/apply" className="btn-primary">📌 Apply for a New Bursary</Link>

          {loading ? (
            <p>Loading your applications...</p>
          ) : applications.length === 0 ? (
            <p>You haven’t applied for any programmes yet.</p>
          ) : (
            <div className="app-list">
              {applications.map((app) => (
                <div key={app.application_id} className="app-card">
                  <h4>{app.programme}</h4>
                  <p>Status: <strong>{app.status}</strong></p>
                  <p>Applied on: {app.applied_at}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {user.role === "admin" && (
        <div>
          <p>This is your admin dashboard.</p>
          {/* We can load admin stuff separately */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
