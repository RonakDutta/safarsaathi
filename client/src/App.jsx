import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Services from "./pages/Services";
import SafetyPage from "./pages/SafetyPage";
import DrivePage from "./pages/DrivePage";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/drive" element={<DrivePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Routes>
    </>
  );
}

export default App;
