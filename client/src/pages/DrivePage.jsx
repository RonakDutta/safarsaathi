import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function DrivePage() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [appStatus, setAppStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carModel: "",
    licenseNumber: "",
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (user?.role === "driver") {
        setAppStatus("already_driver");
        setIsLoading(false);
        return;
      }

      if (user) {
        try {
          const res = await axios.get("/api/driver/my-application-status");
          if (res.data) setAppStatus(res.data.status); // Will be 'pending', 'rejected', or null
        } catch (err) {
          console.error("Error checking status", err);
        }
      }
      setIsLoading(false);
    };

    checkStatus();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/driver-apply", formData);
      toast.success("Application Sent! We will contact you.");
      setShowModal(false);
      setAppStatus("pending");
      setFormData({
        name: "",
        email: "",
        phone: "",
        carModel: "",
        licenseNumber: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to send application");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#ffc107]">
        <i className="fas fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  // SCENARIO 1: ALREADY A DRIVER
  if (appStatus === "already_driver") {
    return (
      <div className="bg-[#121212] min-h-screen font-['Poppins',sans-serif]">
        <Navbar />
        <div className="pt-40 px-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#1e1e1e] border border-[#ffc107] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,193,7,0.2)]">
            <i className="fas fa-car text-4xl text-[#ffc107]"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            You're already a SafarDriver!
          </h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Your account is fully approved. Head over to your dashboard to start
            accepting rides and earning.
          </p>
          <Link
            to="/driver"
            className="bg-[#ffc107] text-black font-bold px-8 py-4 rounded-4xl hover:bg-[#ffca2c] transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // SCENARIO 2: PENDING APPLICATION
  if (appStatus === "pending") {
    return (
      <div className="bg-[#121212] min-h-screen font-['Poppins',sans-serif]">
        <Navbar />
        <div className="pt-40 px-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#1e1e1e] border border-[#333] rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-clock text-4xl text-[#ffc107] animate-pulse"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Application Under Review
          </h2>
          <p className="text-gray-400 max-w-md mb-8">
            Our team is currently verifying your vehicle details and license. We
            will notify you once you are approved by the Admin.
          </p>
          <Link
            to="/"
            className="text-[#888] hover:text-white transition-colors underline underline-offset-4"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // SCENARIO 3: NORMAL PAGE VIEW
  return (
    <div className="bg-[#121212] min-h-screen font-['Poppins',sans-serif]">
      <Navbar />

      {/* DRIVER APPLICATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[#1e1e1e] px-8 py-10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-full max-w-112.5 text-center border border-[#2a2a2a]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-transparent border-none text-[#888] text-xl cursor-pointer transition-all duration-300 p-2 hover:text-[#ffc107] hover:rotate-90 flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="mb-8">
              <h2 className="text-white text-3xl font-semibold mb-2 tracking-wide">
                Driver Application
              </h2>
              <p className="text-[#e0e0e0] text-sm opacity-80">
                Join our fleet today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative group">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107]"
                  required
                />
              </div>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107]"
                  required
                />
              </div>
              <div className="relative group">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107]"
                  required
                />
              </div>
              <div className="relative group">
                <i className="fas fa-car absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
                <input
                  type="text"
                  name="carModel"
                  placeholder="Car Model (e.g. Swift 2020)"
                  value={formData.carModel}
                  onChange={handleChange}
                  className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107]"
                  required
                />
              </div>
              <div className="relative group">
                <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="Driving License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 border-none rounded-lg bg-[#ffc107] text-black font-semibold text-base cursor-pointer transition-all duration-300 hover:bg-[#ffca2c] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(255,193,7,0.2)] active:scale-95"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pb-16">
        {/* Hero Section */}
        <section className="pt-40 pb-20 text-center bg-linear-to-b from-[#1e1e1e] to-[#121212]">
          <div className="max-w-4xl mx-auto px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Drive with Us,{" "}
              <span className="text-[#ffc107]">Earn on Your Terms</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-[#e0e0e0] leading-relaxed mb-10">
              Take control of your schedule and your earnings. Apply today to
              become a verified SafarSaathi driver.
            </p>
            {!user ? (
              <Link
                to="/login"
                className="inline-block px-10 py-4 rounded-full font-bold text-lg bg-[#333] text-white hover:bg-[#444] transition-all"
              >
                Login to Apply
              </Link>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="inline-block px-10 py-4 rounded-full font-bold text-lg bg-[#ffc107] text-black hover:bg-[#ffca2c] hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all"
              >
                Start Application
              </button>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 max-w-5xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left">
            <div className="bg-[#ffc107] text-black rounded-full w-20 h-20 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(255,193,7,0.3)]">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h3 className="text-3xl mb-3 text-white font-bold">
                Admin Verification
              </h3>
              <p className="text-[#e0e0e0] text-lg leading-relaxed max-w-2xl">
                To maintain trust, every driver on our platform is manually
                verified by our team. Your data is stored securely in our
                Postgres database.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left">
            <div className="bg-[#ffc107] text-black rounded-full w-20 h-20 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(255,193,7,0.3)]">
              <i className="fas fa-credit-card"></i>
            </div>
            <div>
              <h3 className="text-3xl mb-3 text-white font-bold">
                Secure Payments
              </h3>
              <p className="text-[#e0e0e0] text-lg leading-relaxed max-w-2xl">
                All customer bookings are handled through Razorpay. You receive
                your hard-earned money safely and transparently.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left">
            <div className="bg-[#ffc107] text-black rounded-full w-20 h-20 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(255,193,7,0.3)]">
              <i className="fas fa-tasks"></i>
            </div>
            <div>
              <h3 className="text-3xl mb-3 text-white font-bold">
                Smart Assignment
              </h3>
              <p className="text-[#e0e0e0] text-lg leading-relaxed max-w-2xl">
                Once a customer requests a ride, you are directly assigned the
                trip. Use your personal dashboard to track and complete rides.
              </p>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <div className="max-w-5xl mx-auto px-8">
          <section className="bg-[#1e1e1e] border border-[#333] rounded-[20px] p-8 md:p-12 hover:border-[#ffc107]/50 transition-all duration-300">
            <h2 className="text-left mb-8 text-white text-3xl md:text-4xl font-bold">
              Driver Requirements
            </h2>
            <ul className="grid md:grid-cols-2 gap-6">
              {[
                "Create a SafarSaathi Account",
                "Valid Email & Phone Number",
                "A Registered Car Model",
                "Valid Government License Number",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 bg-[#2a2a2a] p-4 rounded-lg"
                >
                  <i className="fas fa-check-circle text-[#ffc107] text-xl"></i>
                  <span className="text-[#e0e0e0] text-lg font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DrivePage;
