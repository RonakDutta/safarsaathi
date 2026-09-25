import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import RequireRole from "./components/RequireRole";
import Home from "./pages/Home";

// Home ships in the main bundle; every other page loads when first visited
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Services = lazy(() => import("./pages/Services"));
const SafetyPage = lazy(() => import("./pages/SafetyPage"));
const DrivePage = lazy(() => import("./pages/DrivePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber" />
    </div>
  );
}

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

      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
    </>
  );
}

export default App;
