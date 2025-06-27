import React, { useEffect, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";

import "../assets/styles/adminprogramlist.css"; // Make sure your CSS file includes modal styles

const AdminProgramList = () => {
  const [programmes, setProgrammes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await authFetch("https://somapoa.onrender.com/admin/programmes");
        const data = await res.json();
        setProgrammes(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load programmes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  const hideProgramme = async (id) => {
    try {
      await authFetch(`https://somapoa.onrender.com/admin/programmes/${id}/hide`, {
        method: "PATCH"
      });
      setProgrammes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error hiding programme:", err);
      alert("Failed to hide programme");
    }
  };

  const updateProgramme = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`https://somapoa.onrender.com/admin/programmes/${selectedProgramme.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProgramme)
      });

      if (!res.ok) throw new Error("Failed to update programme");
      const updated = await res.json();

      setProgrammes(prev =>
        prev.map(p => p.id === updated.id ? updated : p)
      );
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading programmes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Programmes</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (

    <div className="admin-dashboard">
      <div className="dashboard-header">
        <button
          className="back-button"
          onClick={() => navigate("/admin/dashboard")}
          style={{ marginBottom: "1rem" }}
        >
          &larr; Back to Dashboard
        </button>
        <h1>Manage Programmes</h1>
      </div>

      {programmes.length === 0 ? (
        <div className="empty-state">
          <h3>No Programmes Found</h3>
          <p>There are currently no active programmes to display.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {programmes.map(programme => (
            <div key={programme.id} className="programme-card">
              <div className="card-header">
                <h3>{programme.program_name}</h3>
              </div>
              
              <div className="card-details">
                <div className="detail-item">Ward: {programme.ward}</div>
                <div className="detail-item">Year: {programme.year}</div>
                <div className="detail-item">
                  Deadline: {new Date(programme.deadline).toLocaleDateString()}
                </div>
                <p className="programme-description">{programme.description}</p>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-button reject-button"
                  onClick={() => hideProgramme(programme.id)}
                >
                  Hide
                </button>
                <button 
                  className="action-button award-button"
                  onClick={() => {
                    setSelectedProgramme(programme);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedProgramme && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Programme</h2>
            <form onSubmit={updateProgramme}>
              <label>Programme Name</label>
              <input
                type="text"
                value={selectedProgramme.program_name}
                onChange={(e) =>
                  setSelectedProgramme({ ...selectedProgramme, program_name: e.target.value })
                }
              />

              <label>Ward</label>
              <input
                type="text"
                value={selectedProgramme.ward}
                onChange={(e) =>
                  setSelectedProgramme({ ...selectedProgramme, ward: e.target.value })
                }
              />

              <label>Year</label>
              <input
                type="text"
                value={selectedProgramme.year}
                onChange={(e) =>
                  setSelectedProgramme({ ...selectedProgramme, year: e.target.value })
                }
              />

              <label>Description</label>
              <textarea
                value={selectedProgramme.description}
                onChange={(e) =>
                  setSelectedProgramme({ ...selectedProgramme, description: e.target.value })
                }
              ></textarea>

              <label>Deadline</label>
              <input
                type="date"
                value={selectedProgramme.deadline.split("T")[0]}
                onChange={(e) =>
                  setSelectedProgramme({ ...selectedProgramme, deadline: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="submit" className="action-button award-button">Save</button>
                <button
                  type="button"
                  className="action-button reject-button"
                  onClick={() => setIsEditModalOpen(false)}
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

export default AdminProgramList;
