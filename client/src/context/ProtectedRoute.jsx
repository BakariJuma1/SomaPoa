import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // While auth is loading
  if (user === null) return <p>Loading...</p>;

  // If user is not logged in or has no role
  if (!user.role) return <Navigate to="/login" />;

  // If user role is allowed
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // If role not allowed
  return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
