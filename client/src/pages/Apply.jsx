import { useEffect, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { Link } from "react-router-dom";
import "../assets/styles/apply.css"; 

const Apply = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await authFetch("http://localhost:5555/programmes");
        if (res.ok) {
          const data = await res.json();
          setProgrammes(data);
        }
      } catch (err) {
        console.error("Error fetching programmes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, [authFetch]);

  return (
    <div className="apply-page">
      <h2>Available Bursary Programmes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : programmes.length === 0 ? (
        <p>No programmes available at the moment.</p>
      ) : (
        <div className="programme-list">
          {programmes.map((prog) => (
            <div className="programme-card" key={prog.id}>
              <h3>{prog.name}</h3>
              <p>{prog.description}</p>
              <p>
                <strong>Deadline:</strong> {new Date(prog.deadline).toLocaleDateString()}
              </p>
              <Link to={`/apply/${prog.id}`} className="btn-primary">Apply</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Apply;
