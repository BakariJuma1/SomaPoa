import { useState } from "react"
import useAuthFetch from "../hooks/useAuthFetch"
import { useNavigate } from "react-router-dom"

const AdminCreateProgram = () => {
  const [formData, setFormData] = useState({
    program_name: "",
    ward: "",
    year: new Date().getFullYear(),
    description: "",
    deadline: "",
    image_url: "",
  })

  const authFetch = useAuthFetch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await authFetch("http://localhost:5555/admin/programmes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert("Program created")
      navigate("/admin/dashboard")
    }
  }

  return (
    <div className="form-container">
      <h2>Create New Bursary Program</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="program_name"
          placeholder="Program Name"
          value={formData.program_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ward"
          placeholder="Ward"
          value={formData.ward}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Program Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="image_url"
          placeholder="Image URL (optional)"
          value={formData.image_url}
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AdminCreateProgram
