import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ApplyForm from './pages/ApplyForm'
import MyApplications from './pages/MyApplications'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/apply/:id" element={<ApplyForm />} />
        <Route path="/admin/applications" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App
