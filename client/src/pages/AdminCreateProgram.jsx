import { useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";
import "../assets/styles/admincreateprogramme.css"; // Make sure to import the CSS

const AdminCreateProgram = () => {
  const [formData, setFormData] = useState({
    program_name: "",
    ward: "",
    year: new Date().getFullYear(),
    description: "",
    deadline: "",
    image_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await authFetch("https://somapoa.onrender.com/admin/programmes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Program created");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error creating program:", error);
      alert("Failed to create program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-card">
        <h2 className="admin-form-title">Create New Bursary Program</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input
              type="text"
              name="program_name"
              placeholder="Program Name"
              value={formData.program_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="ward"
              placeholder="Ward"
              value={formData.ward}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <textarea
              name="description"
              placeholder="Program Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="form-textarea"
            />
          </div>
          
          <div className="form-group">
            <input
              type="url"
              name="image_url"
              placeholder="Image URL (optional)"
              value={formData.image_url}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Program"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProgram; // This is the crucial default export