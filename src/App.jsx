import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Destination from "./pages/Destination";
import PlanTrip from "./pages/PlanTrip";
import MyTrips from "./pages/MyTrips";
import TripDetail from "./pages/TripDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/destination" element={<Destination />} />
          <Route path="/destination/:id" element={<Destination />} />

          <Route
            path="/plantrip"
            element={
              <ProtectedRoute message="Please login to plan your trip.">
                <PlanTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mytrips"
            element={
              <ProtectedRoute message="Please login to view your trips.">
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mytrips/:tripId"
            element={
              <ProtectedRoute message="Please login to view your trips.">
                <TripDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/viewall" element={<Destination />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
