import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Not applied to any route yet — available for wrapping specific pages
// (e.g. <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />)
// once it's decided which pages should require login.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
