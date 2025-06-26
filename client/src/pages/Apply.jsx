import { useEffect, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/apply.css";

const Apply = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await authFetch("http://localhost:5555/programmes");
        if (res.ok) {
          const data = await res.json();
          setProgrammes(data);
        } else {
          throw new Error("Failed to fetch programmes");
        }
      } catch (err) {
        console.error("Error fetching programmes", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, [authFetch]);

  return (
    <div className="apply-container">
      <div className="apply-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1>Available Bursaries</h1>
          <div className="header-spacer"></div>
        </div>
        <p className="header-subtitle">Select a programme to begin your application</p>
      </div>

      <div className="apply-content">
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading bursary programmes...</p>
          </div>
        ) : programmes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H3C2.45 20.92 2 20.47 2 19.92V16.92" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
                <path d="M2 16.92L6.21 10.92C6.57 10.4 7.25 10.18 7.87 10.4L10.76 11.36C11.18 11.5 11.65 11.37 11.94 11.04L13.98 8.7C14.38 8.26 15.07 8.18 15.56 8.53L22 13.28" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M19.5 7.5C20.8807 7.5 22 6.38071 22 5C22 3.61929 20.8807 2.5 19.5 2.5C18.1193 2.5 17 3.61929 17 5C17 6.38071 18.1193 7.5 19.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
              </svg>
            </div>
            <h3>No Programmes Available</h3>
            <p>There are currently no bursary programmes open for applications.</p>
            <button onClick={() => navigate(-1)} className="primary-button">
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="programmes-grid">
            {programmes.map((prog) => (
              <div className="programme-card" key={prog.id}>
                <div className="card-header">
                  <div className="card-badge">
                    {new Date(prog.deadline) > new Date() ? 'Open' : 'Closed'}
                  </div>
                  <h3>{prog.name}</h3>
                </div>
                
                <p className="card-description">{prog.description}</p>
                
                <div className="card-details">
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Deadline: {new Date(prog.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M20 10C20 16 12 21 12 21C12 21 4 16 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>{prog.ward}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/apply/${prog.id}`} 
                  className={`apply-button ${new Date(prog.deadline) > new Date() ? '' : 'disabled'}`}
                >
                  {new Date(prog.deadline) > new Date() ? 'Apply Now' : 'Applications Closed'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply;