import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/home.css"; 

const Home = () => {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/programmes")
      .then((res) => res.json())
      .then((data) => setProgrammes(data))
      .catch((err) => console.error("Error fetching programmes:", err));
  }, []);

  return (
    <div className="home-container">
      <h1> Ongoing Bursary Programmes</h1>

      {programmes.length === 0 ? (
        <p>Loading programmes...</p>
      ) : (
        programmes.map((programme) => (
          <div key={programme.id} className="programme-card">
            <h2>{programme.name}</h2>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(programme.deadline).toLocaleDateString()}
            </p>
            <p>{programme.description}</p>
            <Link to={`/apply/${programme.id}`}>Apply Now</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
