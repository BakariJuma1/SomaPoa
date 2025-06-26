import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./pages/StudentDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ApplyForm from "./pages/ApplyForm"
import MyApplications from "./pages/MyApplications"
import Unauthorized from "./pages/Unauthorized"
import RequireAuth from "./components/RequireAuth"
import Apply from "./pages/Apply"
import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth roles={["student"]}>
              <StudentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/my-applications"
          element={
            <RequireAuth roles={["student"]}>
              <MyApplications />
            </RequireAuth>
          }
        />
        <Route
          path="/apply"
          element={
            <RequireAuth roles={["student"]}>
              <Apply />
            </RequireAuth>
          }
        />
        <Route
          path="/apply/:id"
          element={
            <RequireAuth roles={["student"]}>
              <ApplyForm />
            </RequireAuth>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App
