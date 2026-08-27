import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps a route's element: redirects guests to /login (carrying a message the
// login page can display) once the initial auth check resolves.
function ProtectedRoute({ children, message = "Please login to continue." }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace state={{ message }} />;
  }
  return children;
}

export default ProtectedRoute;
