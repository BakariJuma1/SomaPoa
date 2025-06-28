import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import "../assets/styles/applicationdetails.css";

const ApplicationDetails = () => {
  const { id } = useParams();
  const authFetch = useAuthFetch();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      const res = await authFetch(`https://somapoa.onrender.com/my-applications/${id}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        setEditData(data);
      } else {
        setError("Failed to fetch application details.");
      }
      setLoading(false);
    };
    fetchApplication();
    // eslint-disable-next-line
  }, [id]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await authFetch(`https://somapoa.onrender.com/my-applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      const updated = await res.json();
      setApplication(updated.application);
      setEditModalOpen(false);
    } else {
      setError("Failed to update application.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return <div className="error-message">{error || "Application not found."}</div>;
  }

  return (
    <div className="application-details-container">
      <h2>Application Details</h2>
      <div className="application-details-card">
        <div><strong>Programme:</strong> {application.programme}</div>
        <div><strong>School Name:</strong> {application.school_name}</div>
        <div><strong>Ward:</strong> {application.ward}</div>
        <div><strong>Education Level:</strong> {application.education_level}</div>
        <div><strong>K.C.P.E Score:</strong> {application.kcpe_score}</div>
        <div><strong>K.C.S.E Grade:</strong> {application.kcse_grade}</div>
        <div><strong>GPA:</strong> {application.gpa}</div>
        <div><strong>Household Income:</strong> {application.household_income}</div>
        <div><strong>Status:</strong> {application.status}</div>
        <div><strong>Applied At:</strong> {new Date(application.applied_at).toLocaleDateString()}</div>
        <button className="edit-btn" onClick={() => setEditModalOpen(true)}>
          Edit Application
        </button>
      </div>

      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Application</h3>
            <form onSubmit={handleEditSubmit}>
              <label>School Name</label>
              <input
                name="school_name"
                value={editData.school_name || ""}
                onChange={handleEditChange}
              />
              <label>Ward</label>
              <input
                name="ward"
                value={editData.ward || ""}
                onChange={handleEditChange}
              />
              <label>Education Level</label>
              <input
                name="education_level"
                value={editData.education_level || ""}
                onChange={handleEditChange}
              />
              <label>K.C.P.E Score</label>
              <input
                name="kcpe_score"
                value={editData.kcpe_score || ""}
                onChange={handleEditChange}
              />
              <label>K.C.S.E Grade</label>
              <input
                name="kcse_grade"
                value={editData.kcse_grade || ""}
                onChange={handleEditChange}
              />
              <label>GPA</label>
              <input
                name="gpa"
                value={editData.gpa || ""}
                onChange={handleEditChange}
              />
              <label>Household Income</label>
              <input
                name="household_income"
                value={editData.household_income || ""}
                onChange={handleEditChange}
              />
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;