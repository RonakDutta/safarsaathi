import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import Auth to auto-fill name
import toast from "react-hot-toast";
import axios from "../api/axios"; // Use the Axios instance we set up
import Bodyfooter from "./Bodyfooter";

function Body() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [pickup, setPickup] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // Helper to inject Razorpay script into the page dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Auto-fill Name if Logged In
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.full_name || user.name);
    }
  }, [isAuthenticated, user]);

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    const loadingToast = toast.loading("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          if (data && data.display_name) {
            setPickup(data.display_name);
            toast.success("Location found!", { id: loadingToast });
          } else {
            toast.error("Could not find address.", { id: loadingToast });
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          toast.error("Failed to fetch address.", { id: loadingToast });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast.error("Location permission denied.", { id: loadingToast });
        setIsLocating(false);
      },
    );
  };

  const handleBooking = async () => {
    if (!name || !pickup || !phone || !duration || !email) {
      toast.error("Please fill in all the booking details.");
      return;
    }

    if (phone.length < 10 || phone.length > 10) {
      toast.error("Please enter a valid phone no.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to book a ride.");
      return;
    }

    const messageBody = {
      name,
      pickup,
      phone: "91" + phone,
      email,
      duration,
      paymentMethod,
      coordinates,
    };

    const loadingToast = toast.loading("Processing your booking...");

    try {
      // 1. Send data to backend
      const res = await axios.post("/api/book-ride", messageBody);

      if (res.data.requiresPayment) {
        // 2. Load Razorpay Script
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          toast.error("Razorpay SDK failed to load. Are you online?", {
            id: loadingToast,
          });
          return;
        }

        // 3. Open Razorpay Checkout Modal
        const options = {
          key: res.data.key,
          amount: res.data.order.amount,
          currency: "INR",
          name: "SafarSaathi",
          description: `Ride Booking for ${duration} hours`,
          order_id: res.data.order.id,
          handler: async function (response) {
            // 4. Payment Successful -> Verify on Backend
            toast.loading("Verifying payment securely...", {
              id: loadingToast,
            });
            try {
              await axios.post("/api/book-ride/verify-payment", {
                ...response,
                bookingId: res.data.bookingId,
              });
              toast.success("Payment Successful! Booking Confirmed. 🚖", {
                id: loadingToast,
              });

              setPickup("");
              setDuration("");
            } catch (err) {
              toast.error("Payment verification failed.", { id: loadingToast });
            }
          },
          prefill: {
            name: name,
            contact: phone,
          },
          theme: {
            color: "#ffc107",
          },
          modal: {
            ondismiss: async function () {
              try {
                await axios.post("/api/book-ride/cancel-booking", {
                  bookingId: res.data.bookingId,
                });
                toast.error("Payment cancelled. Booking was not completed.");
              } catch (err) {
                console.error("Failed to clear abandoned booking");
              }
            },
          },
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.on("payment.failed", function (response) {
          toast.error("Payment failed or cancelled.", { id: loadingToast });
        });

        toast.dismiss(loadingToast);
        paymentObject.open();
      } else {
        toast.success("Booking Confirmed! Pay with cash after the ride.", {
          id: loadingToast,
        });
        setPickup("");
        setDuration("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Booking Failed", {
        id: loadingToast,
      });
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  return (
    <div className="bg-white">
      <main>
        <section className="border-b border-slate-200 bg-slate-100 px-5 pb-20 pt-32 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-end">
            <div className="max-w-xl text-left">
              <p className="eyebrow">Driver on your schedule</p>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl">
                Your day has more than one stop.
              </h1>
              <p className="mt-7 max-w-md text-lg leading-8 text-slate-600">
                Book a professional driver by the hour for errands, meetings, and the plans that do not fit in a single ride.
              </p>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-slate-300 pt-5 text-sm"><div><strong className="block text-xl text-slate-950">1–24</strong><span className="text-slate-500">hours</span></div><div><strong className="block text-xl text-slate-950">₹200</strong><span className="text-slate-500">per hour</span></div><div><strong className="block text-xl text-slate-950">100%</strong><span className="text-slate-500">verified</span></div></div>
            </div>

            <div className="bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
              <div className="mb-7 border-b border-slate-200 pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">Make a booking</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Tell us about your journey
                </h2>
                <p className="mt-1 text-sm text-slate-500">A confirmed fare is based on the hours you select.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block">Full Name</label>
                  <div className="relative">
                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isAuthenticated}
                      className="w-full bg-white border border-slate-300 text-slate-950 text-sm pl-11 pr-4 py-3.5 transition-all duration-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block">WhatsApp Number</label>
                  <div className="relative">
                    <i className="fab fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-[#888] text-lg"></i>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      className="w-full bg-white border border-slate-300 text-slate-950 text-sm pl-11 pr-4 py-3.5 transition-all duration-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Pickup Location Input */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block">Pickup Location</label>
                  <div className="relative">
                    <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <input
                      type="text"
                      placeholder="Enter Pickup Address"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-950 text-sm pl-11 pr-12 py-3.5 transition-all duration-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#ffc107] text-lg cursor-pointer p-1 transition-colors duration-300 hover:text-white disabled:cursor-not-allowed disabled:text-[#666]"
                      onClick={handleGetLiveLocation}
                      disabled={isLocating}
                      title="Detect live location"
                    >
                      {isLocating ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-crosshairs"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Duration Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block">Duration (Hours)</label>
                  <div className="relative">
                    <i className="fas fa-clock absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <input
                      type="number"
                      placeholder="e.g. 4 (Max 24 hrs)"
                      min="1"
                      max="24"
                      value={duration}
                      onChange={(e) => {
                        if (e.target.value <= 24 && e.target.value >= 0) {
                          setDuration(e.target.value);
                        } else {
                          setDuration(duration);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 text-slate-950 text-sm pl-11 pr-4 py-3.5 transition-all duration-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block">Email Address</label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-950 text-sm pl-11 pr-4 py-3.5 transition-all duration-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="sm:col-span-2 pt-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block mb-2">Payment Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center gap-2 p-3 border text-xs sm:text-sm font-medium cursor-pointer transition-all ${paymentMethod === 'Online' ? 'bg-amber-50 border-amber-600 text-amber-800' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-500'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={paymentMethod === "Online"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#ffc107] cursor-pointer"
                      />
                      Online Payment
                    </label>
                    <label className={`flex items-center justify-center gap-2 p-3 border text-xs sm:text-sm font-medium cursor-pointer transition-all ${paymentMethod === 'Cash' ? 'bg-amber-50 border-amber-600 text-amber-800' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-500'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="Cash"
                        checked={paymentMethod === "Cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#ffc107] cursor-pointer"
                      />
                      Pay with Cash
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-2 pt-4 text-center">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-10 py-3.5 border-none font-bold cursor-pointer transition-all duration-300 text-base bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-98"
                    onClick={handleBooking}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Bodyfooter />
      </main>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease;
        }
      `}
      </style>
      <style>
        {`
        /* Hide Number Input Arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }

        /* Your existing animations... */
        @keyframes fadeIn { ... }
        `}
      </style>
    </div>
  );
}

export default Body;
