import { useEffect, useState, useContext, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeDrivers: 0,
    pendingApps: 0,
    revenue: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [driverList, setDriverList] = useState([]);

  // Ref to track completed rides for notifications
  const prevCompletedCount = useRef(0);

  // Fetch Data Function (Made accessible for background polling)
  const fetchData = async (isBackgroundPoll = false) => {
    try {
      const statsRes = await axios.get("/api/admin/stats");
      setStats(statsRes.data);

      const bookingsRes = await axios.get("/api/admin/bookings");
      const fetchedBookings = bookingsRes.data;

      // NOTIFICATION LOGIC
      const currentCompletedCount = fetchedBookings.filter(
        (b) => b.status === "completed",
      ).length;

      if (
        isBackgroundPoll &&
        currentCompletedCount > prevCompletedCount.current
      ) {
        toast.success("A driver just completed a ride! 🚖✅", {
          duration: 5000,
          style: {
            background: "#121212",
            color: "#fff",
            border: "1px solid #22c55e",
          },
        });
      }
      prevCompletedCount.current = currentCompletedCount;
      // --------------------------

      setBookings(fetchedBookings);

      const appsRes = await axios.get("/api/admin/applications");
      setApplications(appsRes.data);

      const driversRes = await axios.get("/api/admin/drivers");
      setDrivers(driversRes.data);

      const driversListRes = await axios.get("/api/admin/drivers-list");
      setDriverList(driversListRes.data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
    }
  };

  useEffect(() => {
    fetchData(false);
    const pollInterval = setInterval(() => {
      fetchData(true);
    }, 20000);
    return () => clearInterval(pollInterval);
  }, [navigate]);

  // Lock scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status: "approved" });
      toast.success("Driver Approved!");
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status: "rejected" });
      toast.success("Application Rejected");
      fetchData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleAssign = async (bookingId) => {
    const driverId = selectedDriver[bookingId];
    if (!driverId) return toast.error("Select a driver first");

    try {
      await axios.put("/api/admin/assign-driver", {
        booking_id: bookingId,
        driver_id: driverId,
      });
      toast.success("Driver Assigned!");
      fetchData();
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(`/api/admin/bookings/${id}`);
      toast.success("Booking Deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete booking");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black font-['Poppins',sans-serif] text-white selection:bg-[#ffc107] selection:text-black">
      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden sticky top-0 flex items-center justify-between p-5 bg-[#121212]/95 backdrop-blur-sm border-b border-[#222] z-30">
        <h1
          className="text-2xl font-bold tracking-tighter cursor-pointer"
          onClick={() => navigate("/")}
        >
          Safar<span className="text-[#ffc107]">Admin.</span>
        </h1>
        <div className="flex items-center gap-4">
          {stats.pendingApps > 0 && (
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#ffc107] text-2xl focus:outline-none"
          >
            <i
              className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
            ></i>
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR (Desktop Fixed Left & Mobile Drawer Right) --- */}
      <aside
        className={`fixed inset-y-0 right-0 md:left-0 z-50 w-72 bg-[#121212] border-l border-[#222] md:border-l-0 md:border-r flex flex-col h-full transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
      >
        {/* MOBILE DRAWER CLOSE BUTTON */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-[#222]">
          <h2 className="text-xl font-bold tracking-tighter">
            Safar<span className="text-[#ffc107]">Admin.</span>
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-8 md:p-10 hidden md:block">
          <h1 className="text-3xl font-bold tracking-tighter">
            Safar<span className="text-[#ffc107]">Admin.</span>
          </h1>
        </div>

        <nav className="flex-1 px-6 pt-6 md:pt-0 space-y-4 overflow-y-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:bg-[#1e1e1e] hover:text-white transition-all duration-300 mb-6 border border-transparent hover:border-[#333]"
          >
            <i className="fas fa-arrow-left text-xl"></i>
            Back to Home
          </button>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-4">
            Menu
          </p>

          <button
            onClick={() => {
              setActiveTab("overview");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "overview" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
          >
            <i
              className={`fas fa-chart-pie text-xl w-5 ${activeTab === "overview" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
            ></i>
            Overview
          </button>

          <button
            onClick={() => {
              setActiveTab("bookings");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "bookings" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
          >
            <i
              className={`fas fa-ticket-alt text-xl w-5 ${activeTab === "bookings" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
            ></i>
            Bookings
          </button>

          <button
            onClick={() => {
              setActiveTab("drivers");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "drivers" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
          >
            <i
              className={`fas fa-id-badge text-xl w-5 ${activeTab === "drivers" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
            ></i>
            My Drivers
          </button>

          <button
            onClick={() => {
              setActiveTab("applications");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "applications" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
          >
            <div className="relative">
              <i
                className={`fas fa-users-cog text-xl w-5 ${activeTab === "applications" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
              ></i>
              {stats.pendingApps > 0 && activeTab !== "applications" && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            Applications
            {stats.pendingApps > 0 && (
              <span
                className={`ml-auto text-xs px-2 py-1 rounded-md font-bold ${activeTab === "applications" ? "bg-black text-white" : "bg-[#1e1e1e] text-white"}`}
              >
                {stats.pendingApps}
              </span>
            )}
          </button>
        </nav>

        <div className="p-6 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-bold transition-all"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 md:ml-72 bg-black min-h-screen w-full md:w-[calc(100%-18rem)] overflow-x-hidden">
        {/* Top Header */}
        <header className="flex justify-between items-end mb-8 md:mb-12 mt-4 md:mt-0">
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">
              Welcome back,
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white capitalize wrap-break-word">
              {user?.full_name?.split(" ")[0] || "Admin"}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-[#121212] px-4 py-2 rounded-full border border-[#222]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-400 font-medium">
              System Active & Syncing
            </span>
          </div>
        </header>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Row: Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue */}
              <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-3xl border border-[#333] relative overflow-hidden group lg:col-span-1">
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <i className="fas fa-rupee-sign text-8xl md:text-9xl text-[#ffc107]"></i>
                </div>
                <p className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-[10px] md:text-xs">
                  Total Revenue
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 truncate">
                  ₹{stats.revenue.toLocaleString()}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs font-mono bg-black/50 w-fit px-3 py-1.5 rounded-full border border-[#333]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffc107] animate-pulse"></div>{" "}
                  Updated Live
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-6">
                {/* Total Bookings Box */}
                <div className="bg-[#121212] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-[#222] hover:border-[#ffc107] transition-colors flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#1e1e1e] rounded-full flex items-center justify-center text-[#ffc107] text-sm md:text-xl">
                      <i className="fas fa-route"></i>
                    </div>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 font-mono mt-1">
                      LIFETIME
                    </span>
                  </div>
                  <div>
                    <h3 className="text-4xl sm:text-3xl md:text-4xl font-bold text-white">
                      {stats.totalBookings}
                    </h3>
                    <p className="text-gray-500 text-[13px] sm:text-xs md:text-sm mt-0.5">
                      Total Bookings
                    </p>
                  </div>
                </div>

                {/* Total Drivers Box */}
                <div className="bg-[#121212] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-[#222] hover:border-[#ffc107] transition-colors flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#1e1e1e] rounded-full flex items-center justify-center text-[#ffc107] text-sm md:text-xl">
                      <i className="fas fa-users"></i>
                    </div>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-green-500 font-mono bg-green-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded mt-1">
                      REGISTERED
                    </span>
                  </div>
                  <div>
                    <h3 className="text-4xl sm:text-3xl md:text-4xl font-bold text-white">
                      {stats.activeDrivers}
                    </h3>
                    <p className="text-gray-500 text-[13px] sm:text-xs md:text-sm mt-0.5">
                      Total Drivers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Feeds */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
              {/* Pending Requests List */}
              <div className="xl:col-span-1 bg-[#1e1e1e] p-5 md:p-6 rounded-3xl border border-[#333] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Driver Requests
                  </h3>
                  {stats.pendingApps > 0 && (
                    <span className="bg-[#ffc107] text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded-md">
                      {stats.pendingApps} New
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  {applications
                    .filter((app) => app.status === "pending")
                    .slice(0, 4)
                    .map((app) => (
                      <div
                        key={app.application_id}
                        className="flex items-center justify-between p-3 bg-[#121212] rounded-xl border border-[#2a2a2a]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                            {app.full_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white leading-none truncate">
                              {app.full_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {app.car_model}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("applications")}
                          className="text-[#ffc107] text-xs font-bold hover:underline shrink-0 pl-2"
                        >
                          Review
                        </button>
                      </div>
                    ))}

                  {/* Empty State */}
                  {applications.filter((app) => app.status === "pending")
                    .length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-50">
                      <i className="fas fa-check-circle text-3xl md:text-4xl text-green-500 mb-2"></i>
                      <p className="text-xs md:text-sm text-gray-400">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>

                {stats.pendingApps > 4 && (
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="w-full mt-4 text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    View all {stats.pendingApps} requests
                  </button>
                )}
              </div>

              {/* Live Activity Feed */}
              <div className="xl:col-span-2 bg-[#1e1e1e] p-5 md:p-6 rounded-3xl border border-[#333]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Live Activity
                  </h3>
                  <span className="text-green-500 text-[10px] md:text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                    Live Updates
                  </span>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 p-4 bg-[#121212] rounded-2xl border border-[#222] hover:border-[#333] transition-colors relative"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border shrink-0 ${booking.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/30" : booking.status === "confirmed" ? "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30" : "bg-[#1e1e1e] text-gray-400 border-[#333]"}`}
                        >
                          {booking.status === "completed" ? (
                            <i className="fas fa-check"></i>
                          ) : booking.status === "confirmed" ? (
                            <i className="fas fa-car-side"></i>
                          ) : (
                            booking.user_name.charAt(0)
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pr-12 sm:pr-0">
                          <p className="text-white font-medium text-xs md:text-sm leading-snug">
                            <span className="font-bold text-white mr-1">
                              {booking.user_name}
                            </span>
                            {booking.status === "pending" && (
                              <span className="text-gray-400">
                                requested a ride from{" "}
                              </span>
                            )}
                            {booking.status === "confirmed" && (
                              <span className="text-[#ffc107]">
                                is on a ride from{" "}
                              </span>
                            )}
                            {booking.status === "completed" && (
                              <span className="text-green-400">
                                completed their ride from{" "}
                              </span>
                            )}
                            <span className="text-white inline-block">
                              {booking.pickup_location.split(",")[0]}
                            </span>
                          </p>

                          <p className="text-gray-500 text-[10px] md:text-xs mt-1.5 font-mono flex items-center gap-1.5">
                            <i className="fas fa-clock"></i> {booking.duration}{" "}
                            hrs • {booking.payment_method}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`absolute top-4 right-4 sm:static text-[9px] md:text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 ${booking.status === "completed" ? "bg-green-500/10 text-green-500" : booking.status === "confirmed" ? "bg-[#ffc107]/10 text-[#ffc107]" : "bg-[#333] text-gray-400"}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <p className="text-gray-500 text-xs md:text-sm text-center py-8">
                      No recent bookings.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- BOOKINGS TAB --- */}
        {activeTab === "bookings" && (
          <div className="animate-fadeIn">
            <div className="bg-[#121212] rounded-3xl border border-[#222] overflow-hidden">
              <div className="p-5 md:p-8 border-b border-[#222] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h3 className="text-lg md:text-xl font-bold">
                  {showHistory
                    ? "All Bookings History"
                    : "New Booking Requests"}
                </h3>
                <div className="flex bg-[#1e1e1e] p-1 rounded-xl border border-[#333] w-full sm:w-auto overflow-hidden">
                  <button
                    onClick={() => setShowHistory(false)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${!showHistory ? "bg-[#ffc107] text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setShowHistory(true)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${showHistory ? "bg-[#ffc107] text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    History
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-150">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                      <th className="p-4 md:p-6 font-medium">Customer</th>
                      <th className="p-4 md:p-6 font-medium">Pickup</th>
                      <th className="p-4 md:p-6 font-medium">Contact</th>
                      <th className="p-4 md:p-6 font-medium text-right">
                        Action / Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {bookings
                      .filter((b) =>
                        showHistory
                          ? b.status !== "pending"
                          : b.status === "pending",
                      )
                      .map((booking) => (
                        <tr
                          key={booking.booking_id}
                          className="hover:bg-[#1a1a1a] transition-colors"
                        >
                          <td className="p-4 md:p-6">
                            <div className="font-bold text-white text-sm md:text-base">
                              {booking.user_name}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500">
                              #{booking.booking_id}
                            </div>
                          </td>
                          <td className="p-4 md:p-6 text-gray-400 text-xs md:text-sm max-w-37.5 md:max-w-xs truncate">
                            {booking.pickup_location}
                          </td>
                          <td className="p-4 md:p-6 text-gray-300 font-mono text-xs md:text-sm">
                            +{booking.phone}
                          </td>

                          <td className="p-4 md:p-6 text-right">
                            {booking.status === "pending" ? (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full mt-2 sm:mt-0">
                                <select
                                  className="bg-[#1a1a1a] border border-[#333] text-[10px] md:text-xs text-white p-2.5 rounded-lg outline-none focus:border-[#ffc107] w-full sm:w-auto min-w-32.5"
                                  onChange={(e) =>
                                    setSelectedDriver({
                                      ...selectedDriver,
                                      [booking.booking_id]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Driver</option>
                                  {drivers.map((d) => (
                                    <option key={d.user_id} value={d.user_id}>
                                      {d.full_name}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleAssign(booking.booking_id)
                                    }
                                    className="bg-[#ffc107] text-black text-[10px] md:text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#ffca2c] w-full sm:w-auto transition-all"
                                  >
                                    ASSIGN
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteBooking(booking.booking_id)
                                    }
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-[10px] md:text-xs font-bold px-3 py-2.5 rounded-lg transition-all"
                                    title="Delete Booking"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span
                                className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase border ${
                                  booking.status === "completed"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : booking.status === "confirmed"
                                      ? "bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/20"
                                      : "bg-gray-700 text-gray-400 border-gray-600"
                                }`}
                              >
                                {booking.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {bookings.filter((b) =>
                  showHistory ? b.status !== "pending" : b.status === "pending",
                ).length === 0 && (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <i className="fas fa-check-circle text-3xl md:text-4xl mb-3 text-gray-700"></i>
                    <p className="text-xs md:text-sm">
                      No bookings found in this view.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DRIVERS TAB */}
        {activeTab === "drivers" && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {driverList.map((driver) => (
                <div
                  key={driver.user_id}
                  className="bg-[#1e1e1e] p-5 md:p-6 rounded-3xl border border-[#333] hover:border-[#ffc107] transition-all group relative overflow-hidden"
                >
                  <span className="absolute -right-4 -bottom-8 text-8xl md:text-9xl font-bold text-[#ffffff05] select-none group-hover:text-[#ffc1070a] transition-colors">
                    {driver.total_trips || 0}
                  </span>
                  <div className="relative z-10 flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#121212] border border-[#333] flex items-center justify-center text-xl md:text-2xl font-bold text-gray-500 shrink-0">
                      {driver.full_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white truncate">
                        {driver.full_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#ffc107] text-black text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded">
                          DRIVER
                        </span>
                        <span className="text-gray-500 text-[10px] md:text-xs truncate">
                          Joined{" "}
                          {new Date(driver.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 md:space-y-3 bg-[#121212] p-3 md:p-4 rounded-xl border border-[#2a2a2a]">
                    {/* Phone */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 truncate">
                      <i className="fas fa-phone text-[#ffc107] w-4 text-center"></i>{" "}
                      {driver.phone_number}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 truncate">
                      <i className="fas fa-envelope text-[#ffc107] w-4 text-center"></i>{" "}
                      {driver.email}
                    </div>

                    {/* Vehicle Info - ADDED */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 truncate">
                      <i className="fas fa-car text-[#ffc107] w-4 text-center"></i>
                      <span className="uppercase font-medium text-white">
                        {driver.car_model || "No Model"} —{" "}
                        <span className="text-gray-400">
                          {driver.license_number || "N/A"}
                        </span>
                      </span>
                    </div>

                    {/* Stats Divider */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 font-bold mt-2 pt-2 border-t border-[#222]">
                      <i className="fas fa-route text-[#ffc107] w-4 text-center"></i>
                      <span className="text-white">
                        {driver.total_trips || 0}
                      </span>
                      Trips Handled
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {driverList.length === 0 && (
              <div className="text-center py-20 opacity-50 flex flex-col items-center">
                <i className="fas fa-users-slash text-4xl md:text-5xl mb-4 text-gray-600"></i>
                <p className="text-xs md:text-sm text-gray-400">
                  No active drivers found.
                </p>
              </div>
            )}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications
                .filter((app) => app.status === "pending")
                .map((app) => (
                  <div
                    key={app.application_id}
                    className="bg-[#121212] p-5 md:p-8 rounded-3xl border border-[#222] hover:border-[#ffc107] transition-all group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-5 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center text-gray-400 font-bold text-lg md:text-xl border border-[#333]">
                        {app.full_name.charAt(0)}
                      </div>
                      <span className="px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase bg-[#222] text-gray-400 border border-[#333]">
                        PENDING
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 truncate">
                      {app.full_name}
                    </h3>
                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-[#1a1a1a] p-3 md:p-4 rounded-xl border border-[#222] mt-3 md:mt-4">
                      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 truncate">
                        <i className="fas fa-phone text-[#ffc107] w-4 text-center"></i>{" "}
                        {app.phone}
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300 truncate">
                        <i className="fas fa-car text-[#ffc107] w-4 text-center"></i>{" "}
                        {app.car_model}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mt-auto">
                      <button
                        onClick={() => handleApprove(app.application_id)}
                        className="bg-[#ffc107] text-black font-bold text-xs md:text-sm py-2.5 md:py-3 rounded-xl hover:bg-[#ffca2c] transition-all active:scale-95"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app.application_id)}
                        className="bg-[#1e1e1e] text-red-500 font-bold text-xs md:text-sm py-2.5 md:py-3 rounded-xl border border-[#333] hover:bg-red-500/10 transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {applications.filter((app) => app.status === "pending").length ===
              0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 opacity-60">
                <i className="fas fa-clipboard-check text-4xl mb-4 text-gray-600"></i>
                <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-2">
                  All Caught Up!
                </h3>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
