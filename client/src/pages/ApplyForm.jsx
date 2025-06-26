import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../assets/styles/applyform.css"

const ApplyForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
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

  const [errors, setErrors] = useState({
    academic_proof: '',
    income_proof: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetch(`http://localhost:5555/programmes/${id}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load programme")
        return res.json()
      })
      .then(data => {
        setProgram(data)
        setLoading(false)
      })
      .catch((err) => {
        setMessage({ text: err.message || 'Failed to load programme info', type: 'error' })
        setLoading(false)
      })
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
    // Clear error when file is selected
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.academic_proof) {
      newErrors.academic_proof = 'Academic proof is required'
      isValid = false
    }
    if (!formData.income_proof) {
      newErrors.income_proof = 'Income proof is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (!validateForm()) {
      return
    }

    const data = new FormData()
    data.append('program_id', id)
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value)
      }
    })

    try {
      const res = await fetch('http://localhost:5555/applications', {
        method: 'POST',
        body: data,
        credentials: 'include'
      })

      if (res.ok) {
        setMessage({ text: 'Application submitted successfully!', type: 'success' })
        setTimeout(() => navigate('/my-applications'), 1500)
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Submission failed')
      }
    } catch (err) {
      setMessage({ text: err.message || 'Something went wrong!', type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading programme information...</p>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="error-container">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <h3>Unable to load programme</h3>
        <p>{message.text}</p>
        <button onClick={() => navigate('/apply')} className="back-button">
          Back to Programmes
        </button>
      </div>
    )
  }

  return (
    <div className="apply-form-container">
      <div className="form-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back
        </button>
        <h1>Apply for Bursary</h1>
        <div className="program-info">
          <h2>{program.name}</h2>
          <p>Deadline: {new Date(program.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert-message ${message.type}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            {message.type === 'success' ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            ) : (
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            )}
          </svg>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form" noValidate>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="school_name">School Name</label>
              <input
                id="school_name"
                name="school_name"
                type="text"
                value={formData.school_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ward">Ward</label>
              <input
                id="ward"
                name="ward"
                type="text"
                value={formData.ward}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="education_level">Education Level</label>
              <select
                id="education_level"
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                required
              >
                <option value="">Select Education Level</option>
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="university">University/College</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="household_income">Household Income (KES)</label>
              <input
                id="household_income"
                name="household_income"
                type="number"
                value={formData.household_income}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Academic Information</h3>
          <div className="form-grid">
            {formData.education_level === 'primary' && (
              <div className="form-group">
                <label htmlFor="kcpe_score">K.C.P.E Score</label>
                <input
                  id="kcpe_score"
                  name="kcpe_score"
                  type="number"
                  min="0"
                  max="500"
                  value={formData.kcpe_score}
                  onChange={handleChange}
                />
              </div>
            )}

            {formData.education_level === 'secondary' && (
              <div className="form-group">
                <label htmlFor="kcse_grade">K.C.S.E Grade</label>
                <input
                  id="kcse_grade"
                  name="kcse_grade"
                  type="text"
                  value={formData.kcse_grade}
                  onChange={handleChange}
                />
              </div>
            )}

            {formData.education_level === 'university' && (
              <div className="form-group">
                <label htmlFor="gpa">GPA</label>
                <input
                  id="gpa"
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Document Upload</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="academic_proof">Academic Proof</label>
              <div className="file-upload-container">
                <label htmlFor="academic_proof" className="file-upload-label">
                  {formData.academic_proof ? (
                    <span>{formData.academic_proof.name}</span>
                  ) : (
                    <span>Choose file (PDF or Image)</span>
                  )}
                  <input
                    id="academic_proof"
                    name="academic_proof"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="file-input"
                  />
                </label>
                {errors.academic_proof && (
                  <div className="error-message">{errors.academic_proof}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="income_proof">Income Proof</label>
              <div className="file-upload-container">
                <label htmlFor="income_proof" className="file-upload-label">
                  {formData.income_proof ? (
                    <span>{formData.income_proof.name}</span>
                  ) : (
                    <span>Choose file (PDF or Image)</span>
                  )}
                  <input
                    id="income_proof"
                    name="income_proof"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="file-input"
                  />
                </label>
                {errors.income_proof && (
                  <div className="error-message">{errors.income_proof}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplyForm