import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../assets/styles/applyform.css"

const ApplyForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [program, setProgram] = useState(null)
  const [formData, setFormData] = useState({
    school_name: '',
    ward: '',
    education_level: '',
    kcpe_score: '',
    kcse_grade: '',
    gpa: '',
    household_income: '',
    academic_proof: null,
    income_proof: null
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5555/programmes/${id}`, {
      credentials: 'include' // ✅ include JWT cookie
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then(data => setProgram(data))
      .catch(() => setMessage('Failed to load programme info'))
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = e => {
    const { name, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const data = new FormData()
    data.append('program_id', id)
    data.append('school_name', formData.school_name)
    data.append('ward', formData.ward)
    data.append('education_level', formData.education_level)
    data.append('kcpe_score', formData.kcpe_score)
    data.append('kcse_grade', formData.kcse_grade)
    data.append('gpa', formData.gpa)
    data.append('household_income', formData.household_income)
    data.append('academic_proof', formData.academic_proof)
    data.append('income_proof', formData.income_proof)

    try {
      const res = await fetch('http://localhost:5555/applications', {
        method: 'POST',
        body: data,
        credentials: 'include' // ✅ ensures token is sent
      })

      if (res.ok) {
        setMessage('Application submitted ✅')
        navigate('/my-applications')
      } else {
        const error = await res.json()
        setMessage(error.error || 'Submission failed')
      }
    } catch (err) {
      console.error(err)
      setMessage('Something went wrong!')
    }
  }

  if (!program) return <p>Loading programme info...</p>

  return (
    <div className="apply-form">
      <h2>Apply for: {program.name}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>School Name:</label>
        <input name="school_name" value={formData.school_name} onChange={handleChange} required />

        <label>Ward:</label>
        <input name="ward" value={formData.ward} onChange={handleChange} required />

        <label>Education Level:</label>
        <select name="education_level" value={formData.education_level} onChange={handleChange} required>
          <option value="">-- Select --</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="university">University</option>
        </select>

        {formData.education_level === 'primary' && (
          <>
            <label>K.C.P.E Score:</label>
            <input name="kcpe_score" type="number" onChange={handleChange} />
          </>
        )}

        {formData.education_level === 'secondary' && (
          <>
            <label>K.C.S.E Grade:</label>
            <input name="kcse_grade" onChange={handleChange} />
          </>
        )}

        {formData.education_level === 'university' && (
          <>
            <label>GPA:</label>
            <input name="gpa" step="0.1" onChange={handleChange} />
          </>
        )}

        <label>Household Income (KES):</label>
        <input name="household_income" onChange={handleChange} required />

        <label>Academic Proof (PDF/Image):</label>
        <input type="file" name="academic_proof" onChange={handleFileChange} required />

        <label>Income Proof (PDF/Image):</label>
        <input type="file" name="income_proof" onChange={handleFileChange} required />

        <button type="submit">Submit Application</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )
}

export default ApplyForm
