import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LocateFixed, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import { HOURLY_RATE, formatINR } from "../lib/pricing";

const DEFAULT_HOURS = 2;

const paymentOptions = [
  {
    value: "Online",
    label: "Pay online",
    hint: "UPI, card or netbanking through Razorpay, before the ride.",
  },
  {
    value: "Cash",
    label: "Pay in cash",
    hint: "Hand the fare to your driver when the ride ends.",
  },
];

// Inject the Razorpay checkout script on demand
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function BookingForm() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [pickup, setPickup] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState(DEFAULT_HOURS);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // Auto-fill name and email if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.full_name || user.name || "");
      if (user.email) setEmail((current) => current || user.email);
    }
  }, [isAuthenticated, user]);

  const fare = duration * HOURLY_RATE;

  const resetTrip = () => {
    setPickup("");
    setCoordinates(null);
    setDuration(DEFAULT_HOURS);
  };

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    const loadingToast = toast.loading("Finding your location...");

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
            toast.success("Location found", { id: loadingToast });
          } else {
            toast.error("Could not find an address here.", {
              id: loadingToast,
            });
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          toast.error("Failed to fetch address.", { id: loadingToast });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        toast.error("Location permission denied.", { id: loadingToast });
        setIsLocating(false);
      },
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!name || !pickup || !phone || !duration || !email) {
      toast.error("Please fill in all the booking details.");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please log in to book a ride.");
      return;
    }

    const messageBody = {
      name,
      pickup,
      phone: "91" + phone,
      email,
      duration: String(duration),
      paymentMethod,
      coordinates,
    };

    setIsSubmitting(true);
    const loadingToast = toast.loading("Processing your booking...");

    try {
      const res = await axios.post("/api/book-ride", messageBody);

      if (res.data.requiresPayment) {
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          toast.error("Razorpay failed to load. Are you online?", {
            id: loadingToast,
          });
          return;
        }

        const options = {
          key: res.data.key,
          amount: res.data.order.amount,
          currency: "INR",
          name: "SafarSaathi",
          description: `Driver booking for ${duration} hours`,
          order_id: res.data.order.id,
          handler: async function (response) {
            toast.loading("Verifying payment...", { id: loadingToast });
            try {
              await axios.post("/api/book-ride/verify-payment", {
                ...response,
                bookingId: res.data.bookingId,
              });
              toast.success(
                "Payment received. Your booking is confirmed — driver details will reach you on WhatsApp.",
                { id: loadingToast, duration: 6000 },
              );
              resetTrip();
            } catch {
              toast.error("Payment verification failed.", { id: loadingToast });
            }
          },
          prefill: {
            name: name,
            email: email,
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
              } catch {
                console.error("Failed to clear abandoned booking");
              }
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function () {
          toast.error("Payment failed or cancelled.", { id: loadingToast });
        });

        toast.dismiss(loadingToast);
        paymentObject.open();
      } else {
        toast.success(
          "Booking confirmed. Pay your driver in cash after the ride.",
          { id: loadingToast, duration: 6000 },
        );
        resetTrip();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Booking failed", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const activePayment = paymentOptions.find((o) => o.value === paymentMethod);

  return (
    <form
      onSubmit={handleBooking}
      className="rounded-xl border border-line bg-panel"
      noValidate
    >
      <div className="border-b border-line px-6 py-5">
        <h2 className="text-lg font-semibold text-white">Book a driver</h2>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="book-name" className="field-label">
              Full name
            </label>
            <input
              id="book-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAuthenticated}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="book-phone" className="field-label">
              WhatsApp number
            </label>
            <div className="flex rounded-lg border border-line bg-coal transition-colors focus-within:border-amber hover:border-edge">
              <span className="flex items-center border-r border-line px-3 text-[15px] text-mute">
                +91
              </span>
              <input
                id="book-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10 digits"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="10"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-[15px] text-white placeholder:text-dim focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="book-email" className="field-label">
            Email
          </label>
          <input
            id="book-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label htmlFor="book-pickup" className="text-sm font-medium text-fog">
              Pickup address
            </label>
            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber transition-colors hover:text-amber-soft disabled:text-mute"
            >
              {isLocating ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <LocateFixed size={15} />
              )}
              Use my location
            </button>
          </div>
          <textarea
            id="book-pickup"
            rows={2}
            placeholder="House / building, street, area"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              setCoordinates(null);
            }}
            className="field resize-none leading-relaxed"
          />
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <label htmlFor="book-duration" className="text-sm font-medium text-fog">
              Duration
            </label>
            <span className="text-sm font-semibold text-white tabular-nums">
              {duration} {duration === 1 ? "hour" : "hours"}
            </span>
          </div>
          <input
            id="book-duration"
            type="range"
            min="1"
            max="24"
            step="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-dim">
            <span>1 hr</span>
            <span>12 hrs</span>
            <span>24 hrs</span>
          </div>
        </div>

        <fieldset>
          <legend className="field-label">Payment</legend>
          <div
            role="radiogroup"
            className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-coal p-1"
          >
            {paymentOptions.map((option) => {
              const selected = paymentMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`rounded-md py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-raise text-white shadow-[inset_0_0_0_1px_var(--color-edge)]"
                      : "text-mute hover:text-fog"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-mute">{activePayment.hint}</p>
        </fieldset>
      </div>

      <div className="border-t border-line px-6 py-5">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm text-fog">Total fare</p>
            <p className="text-xs text-mute tabular-nums">
              {duration} {duration === 1 ? "hr" : "hrs"} &times;{" "}
              {formatINR(HOURLY_RATE)}
            </p>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-white tabular-nums">
            {formatINR(fare)}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 text-base"
        >
          {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
          {paymentMethod === "Online" ? "Continue to payment" : "Confirm booking"}
        </button>

        {!isAuthenticated && (
          <p className="mt-4 text-center text-sm text-mute">
            You&apos;ll need to{" "}
            <Link to="/login" className="link">
              log in
            </Link>{" "}
            before confirming.
          </p>
        )}
      </div>
    </form>
  );
}

export default BookingForm;
