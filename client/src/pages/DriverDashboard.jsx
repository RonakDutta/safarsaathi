import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DriverDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeTab, setActiveTab] = useState("active");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pinModal, setPinModal] = useState({ isOpen: false, bookingId: null });
  const [enteredPin, setEnteredPin] = useState("");

  const fetchTrips = async () => {
    try {
      const res = await axios.get("/api/driver-board/my-trips");
      setBookings(res.data.bookings);
      setCompletedCount(res.data.completedCount);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [navigate]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const openPinModal = (id) => {
    setPinModal({ isOpen: true, bookingId: id });
    setEnteredPin("");
  };

  // 2. Submits the PIN to the backend
  const submitCompleteRide = async () => {
    if (enteredPin.length !== 4) return toast.error("PIN must be 4 digits");

    try {
      await axios.put(`/api/driver-board/complete/${pinModal.bookingId}`, {
        pin: enteredPin,
      });

      toast.success("Ride Completed Successfully!");
      setPinModal({ isOpen: false, bookingId: null });
      setEnteredPin("");
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update trip");
    }
  };

  const handleCancelRide = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;
    try {
      await axios.put(`/api/driver-board/cancel/${id}`);
      toast.success("Ride Cancelled.");
      fetchTrips();
    } catch (err) {
      toast.error("Failed to cancel trip");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#000000] font-['Poppins',sans-serif] text-white selection:bg-[#ffc107] selection:text-black">
      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 flex items-center justify-between p-5 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#222] z-30">
        <h1
          className="text-2xl font-bold tracking-tighter cursor-pointer"
          onClick={() => navigate("/")}
        >
          Safar<span className="text-[#ffc107]">Driver.</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-[#ffc107] text-2xl focus:outline-none"
        >
          <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0a0a0a] border-l border-[#222] md:border-l-0 md:border-r flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0`}
      >
        {/* MOBILE DRAWER CLOSE BUTTON & LOGO */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-[#222]">
          <h2 className="text-xl font-bold tracking-tighter">
            Safar<span className="text-[#ffc107]">Driver.</span>
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-8 md:p-10 hidden md:block">
          <h1
            className="text-3xl font-bold tracking-tighter cursor-pointer"
            onClick={() => navigate("/")}
          >
            Safar<span className="text-[#ffc107]">Driver.</span>
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

          <div className="space-y-4">
            <button
              onClick={() => {
                setActiveTab("active");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "active" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
            >
              <i
                className={`fas fa-car text-xl ${activeTab === "active" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
              ></i>
              Active Rides
            </button>

            <button
              onClick={() => {
                setActiveTab("history");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium ${activeTab === "history" ? "bg-[#ffc107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"}`}
            >
              <i
                className={`fas fa-history text-xl ${activeTab === "history" ? "text-black" : "text-gray-500 group-hover:text-[#ffc107]"}`}
              ></i>
              Past History
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-bold transition-all"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative bg-[#000000] pb-10 md:pb-0">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12 animate-fadeIn">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">
                Welcome back,
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight wrap-break-word">
                {user?.name || "Driver"}
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-[#121212] border border-[#222] px-4 md:px-5 py-2 md:py-2.5 rounded-full w-fit">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-gray-400 text-xs md:text-sm font-bold tracking-wide">
                Driver Online
              </span>
            </div>
          </div>

          {/* STATS */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-10 animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-[#222] relative overflow-hidden group hover:border-[#333] transition-colors">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                Total Completed Trips
              </p>
              <div className="flex items-end gap-2 md:gap-3">
                <h3 className="text-5xl md:text-6xl font-black text-white">
                  {completedCount}
                </h3>
                <span className="text-2xl md:text-4xl font-black text-[#ffc107] group-hover:text-[#ffc107]/80 transition-colors">
                  Trips
                </span>
              </div>
              <div className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-7xl md:text-8xl text-[#ffc107] group-hover:text-[#ffc107]/80 transition-all transform group-hover:scale-110 opacity-20 md:opacity-100">
                <i className="fas fa-route"></i>
              </div>
            </div>
          </div>

          {/* FEED */}
          <div
            className="bg-[#121212] rounded-3xl border border-[#222] overflow-hidden animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="p-5 md:p-8 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]/50">
              <h3 className="text-lg md:text-xl font-bold text-white">
                {activeTab === "active"
                  ? "Current Assignments"
                  : "Ride History"}
              </h3>
              <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-full border border-[#222]">
                <span
                  className={`w-2 h-2 rounded-full ${activeTab === "active" ? "bg-[#ffc107] animate-pulse" : "bg-green-500"}`}
                ></span>
                <span
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${activeTab === "active" ? "text-[#ffc107]" : "text-green-500"}`}
                >
                  {activeTab === "active" ? "Live" : "Past"}
                </span>
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-4">
              {bookings
                .filter((b) =>
                  activeTab === "active"
                    ? b.status === "confirmed"
                    : b.status === "completed",
                )
                .map((booking, index) => (
                  <div
                    key={booking.booking_id}
                    className="bg-[#1a1a1a] p-5 md:p-6 rounded-2xl border border-[#222] hover:border-[#ffc107]/40 transition-all duration-300 group flex flex-col gap-4 animate-fadeIn relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Left Status Indicator Line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        activeTab === "active" ? "bg-[#ffc107]" : "bg-green-500"
                      } opacity-80`}
                    ></div>

                    {/* TOP ROW: User Info & Badges */}
                    <div className="flex justify-between items-start pl-3">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#121212] border border-[#333] flex items-center justify-center text-[#ffc107] font-bold text-lg md:text-xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                          {booking.user_name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                              {booking.user_name}
                            </h4>
                            <span className="text-[10px] text-gray-500 font-mono bg-black px-2 py-0.5 rounded border border-[#222]">
                              #{booking.booking_id}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400 mt-1">
                            <div className="flex items-center gap-1.5">
                              <i className="fas fa-clock text-[#ffc107]/70"></i>{" "}
                              {booking.duration} Hrs
                            </div>
                            <div className="flex items-center gap-1.5">
                              <i className="fas fa-phone text-[#ffc107]/70"></i>{" "}
                              +{booking.phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Badge  */}
                      <div className="hidden sm:block">
                        {booking.payment_method === "Online" ? (
                          <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1.5 rounded-md font-bold text-[10px] md:text-xs tracking-wide border border-green-400/20">
                            <i className="fas fa-credit-card"></i> PREPAID
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#ffc107] bg-[#ffc107]/10 px-2.5 py-1.5 rounded-md font-bold text-[10px] md:text-xs tracking-wide border border-[#ffc107]/20">
                            <i className="fas fa-money-bill-wave"></i> CASH
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MIDDLE ROW: Address Box */}
                    <div className="pl-3 sm:pl-18">
                      <div className="bg-[#121212] border border-[#222] p-3 md:p-4 rounded-xl flex items-start gap-3">
                        <i className="fas fa-map-marker-alt text-[#ffc107] mt-1 shrink-0"></i>
                        <span className="text-gray-300 text-xs md:text-sm leading-relaxed">
                          {booking.pickup_location}
                        </span>
                      </div>

                      {/* Mobile-only Payment Badge */}
                      <div className="sm:hidden mt-3 inline-block">
                        {booking.payment_method === "Online" ? (
                          <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1.5 rounded-md font-bold text-[10px] tracking-wide border border-green-400/20 w-fit">
                            <i className="fas fa-credit-card"></i> PREPAID
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#ffc107] bg-[#ffc107]/10 px-2.5 py-1.5 rounded-md font-bold text-[10px] tracking-wide border border-[#ffc107]/20 w-fit">
                            <i className="fas fa-money-bill-wave"></i>
                            CASH
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTTOM ROW: Action Buttons */}
                    <div className="pl-3 sm:pl-18 mt-2 flex flex-col sm:flex-row justify-end gap-3 w-full">
                      {activeTab === "active" ? (
                        <>
                          <button
                            onClick={() => openPinModal(booking.booking_id)}
                            className="bg-[#ffc107] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#ffca2c] transition-all shadow-[0_0_15px_rgba(255,193,7,0.15)] hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] flex justify-center items-center gap-2 text-sm whitespace-nowrap active:scale-95 w-full sm:w-auto"
                          >
                            <i className="fas fa-check-double"></i> Complete
                            Ride
                          </button>
                          <button
                            onClick={() => handleCancelRide(booking.booking_id)}
                            className="bg-[#1e1e1e] text-red-500 border border-[#333] hover:border-red-500 hover:bg-red-500/10 font-bold px-5 py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 text-sm whitespace-nowrap active:scale-95 w-full sm:w-auto"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </>
                      ) : (
                        <div className="w-full sm:w-auto bg-green-500/10 text-green-500 border border-green-500/20 font-bold px-6 py-2.5 rounded-xl flex justify-center items-center gap-2 text-sm">
                          <i className="fas fa-check-circle"></i> Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {/* Empty State */}
              {bookings.filter((b) =>
                activeTab === "active"
                  ? b.status === "confirmed"
                  : b.status === "completed",
              ).length === 0 && (
                <div className="py-16 md:py-20 text-center flex flex-col items-center justify-center animate-fadeIn">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#222]">
                    <i className="fas fa-check text-[#333] text-2xl md:text-3xl"></i>
                  </div>
                  <p className="text-gray-400 font-bold text-base md:text-lg">
                    All caught up!
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    No {activeTab === "active" ? "active" : "past"} rides found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* PIN ENTRY MODAL */}
        {pinModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-[#333] shadow-2xl w-full max-w-sm text-center animate-fadeIn">
              <div className="w-16 h-16 bg-[#ffc107]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ffc107]/20">
                <i className="fas fa-lock text-2xl text-[#ffc107]"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">End Ride</h3>
              <p className="text-gray-400 text-sm mb-6">
                Please ask the customer for the 4-digit PIN sent to their phone
                to verify completion.
              </p>

              <input
                type="text"
                maxLength="4"
                value={enteredPin}
                onChange={(e) =>
                  setEnteredPin(e.target.value.replace(/\D/g, ""))
                } // Only allow numbers
                className="w-full bg-[#121212] border border-[#333] text-white text-center text-3xl tracking-[1em] py-4 rounded-xl focus:outline-none focus:border-[#ffc107] mb-6 font-mono"
                placeholder="••••"
              />

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setPinModal({ isOpen: false, bookingId: null })
                  }
                  className="flex-1 bg-[#121212] text-gray-400 border border-[#333] py-3 rounded-xl font-bold hover:bg-[#222] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCompleteRide}
                  className="flex-1 bg-[#ffc107] text-black py-3 rounded-xl font-bold hover:bg-[#ffca2c] transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        html {
            scrollbar-gutter: stable;
            background-color: #000000;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default DriverDashboard;
