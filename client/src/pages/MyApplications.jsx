import React, { useEffect, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/myapplications.css"; 

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await authFetch("http://localhost:5555/my-applications");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, [authFetch]);

  return (
    <div className="container">
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Programme</th>
              <th>Status</th>
              <th>Score</th>
              <th>Eligibility</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.application_id}>
                <td>{app.programme}</td>
                <td>{app.status}</td>
                <td>{app.score ?? 'N/A'}</td>
                <td>{app.is_eligible ? "✅ Eligible" : "❌"}</td>
                <td>{app.applied_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;
