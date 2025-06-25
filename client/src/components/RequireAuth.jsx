import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

// roles = optional array of allowed roles (e.g., ['admin'])
const RequireAuth = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Not logged in
  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based check (if roles prop was provided)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAuth;
