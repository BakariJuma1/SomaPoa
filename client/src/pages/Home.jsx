import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/home.css";

// SVG Icons
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Home = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await fetch("https://somapoa.onrender.com/programmes");
        if (!res.ok) throw new Error("Failed to fetch programmes");
        const data = await res.json();
        setProgrammes(data);
      } catch (err) {
        console.error("Error fetching programmes:", err);
        setError("Unable to load bursaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Educational Funding</h1>
          <p className="hero-subtitle">
            Discover and apply for bursary programmes across all wards in your county
          </p>
        </div>
      </section>

      {/* Featured Programmes */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Available Bursaries</h2>
          <p>Browse through current opportunities</p>
        </div>

        <div className="programmes-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading bursaries...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
            </div>
          ) : programmes.length === 0 ? (
            <p>No bursaries available at the moment.</p>
          ) : (
            programmes.map((programme) => (
              <article key={programme.id} className="programme-card">
                <div className="card-image">
                  <img
                    src={programme.image_url || "/default-programme.jpg"}
                    alt={programme.program_name}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x200?text=Bursary")
                    }
                  />
                  <span className="card-badge">Open</span>
                </div>
                <div className="card-content">
                  <h3>{programme.program_name}</h3>
                  <div className="card-meta">
                    <span className="meta-item">
                      <LocationIcon />
                      {programme.ward}
                    </span>
                    <span className="meta-item">
                      <CalendarIcon />
                      {new Date(programme.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="card-description">
                    {programme.description.length > 100
                      ? `${programme.description.substring(0, 100)}...`
                      : programme.description}
                  </p>
                  <Link to={`/apply/${programme.id}`} className="apply-btn">
                    Apply Now
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Info Sections */}
      <div className="info-sections">
        <section className="about-section">
          <h2>About SomaPoa</h2>
          <div className="section-content">
            <p>
              SomaPoa is a revolutionary bursary application platform designed to
              democratize access to educational funding. Our mission is to connect
              students with financial aid opportunities in a transparent, efficient
              manner.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Programmes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Students Helped</span>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Who is eligible to apply?</h3>
              <p>
                Any student residing in the listed wards can apply for these bursary
                programmes. Specific eligibility criteria may vary by programme.
              </p>
            </div>
            <div className="faq-item">
              <h3>What documents are required?</h3>
              <p>
                Typically you'll need proof of residence, academic records, and income
                verification. Each programme lists its specific requirements.
              </p>
            </div>
            <div className="faq-item">
              <h3>When will I know if I'm awarded?</h3>
              <p>
                Decisions are usually made within 4-6 weeks after the application
                deadline. You'll be notified via email and SMS.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
