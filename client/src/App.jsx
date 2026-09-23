import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import RequireRole from "./components/RequireRole";

// Import Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Services from "./pages/Services";
import SafetyPage from "./pages/SafetyPage";
import DrivePage from "./pages/DrivePage";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#e0e0e0",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#ffc107", secondary: "#000" } },
          error: { iconTheme: { primary: "#ff4444", secondary: "#000" } },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/drive" element={<DrivePage />} />
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/driver"
          element={
            <RequireRole role="driver">
              <DriverDashboard />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
