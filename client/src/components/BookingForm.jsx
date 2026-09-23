import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LocateFixed,
  LoaderCircle,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import axios from "../api/axios";
import { HOURLY_RATE, formatINR } from "../lib/pricing";

const DEFAULT_HOURS = 2;
const quickHours = [2, 4, 8, 12];

const iconClass =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute transition-colors duration-200 group-focus-within:text-amber";

const paymentOptions = [
  {
    value: "Online",
    label: "Pay online",
    icon: CreditCard,
    hint: "UPI, card or netbanking through Razorpay, before the ride.",
  },
  {
    value: "Cash",
    label: "Pay in cash",
    icon: Banknote,
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
  const [searchParams] = useSearchParams();
  // Links like /?hours=8#book arrive with the duration already picked
  const [duration, setDuration] = useState(() => {
    const hours = Number(searchParams.get("hours"));
    return Number.isInteger(hours) && hours >= 1 && hours <= 24
      ? hours
      : DEFAULT_HOURS;
  });
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
    const loadingToast = toast.loading("Finding your location");

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
    const loadingToast = toast.loading("Processing your booking");

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
            toast.loading("Verifying your payment", { id: loadingToast });
            try {
              await axios.post("/api/book-ride/verify-payment", {
                ...response,
                bookingId: res.data.bookingId,
              });
              toast.success(
                "Payment received and booking confirmed. Driver details will reach you on WhatsApp.",
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

  const fill = ((duration - 1) / 23) * 100;

  return (
    <form
      id="book"
      onSubmit={handleBooking}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md"
      noValidate
    >
      <div className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-7">
        <h2 className="text-xl font-semibold text-white">Book your ride</h2>
        <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
          {formatINR(HOURLY_RATE)} / hour
        </span>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="book-name" className="field-label">
              Full name
            </label>
            <div className="group relative">
              <User size={17} className={iconClass} />
              <input
                id="book-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAuthenticated}
                className="field pl-11"
              />
            </div>
          </div>

          <div>
            <label htmlFor="book-phone" className="field-label">
              WhatsApp number
            </label>
            <div className="group flex rounded-xl border border-edge bg-raise transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-amber/70 focus-within:bg-[#222] focus-within:shadow-[0_0_0_3px_rgb(255_193_7/0.08)] hover:border-[#4a4a4a]">
              <span className="flex items-center gap-2 border-r border-edge pr-3 pl-4 text-[15px] text-mute">
                <Phone
                  size={16}
                  className="transition-colors group-focus-within:text-amber"
                />
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
                className="w-full min-w-0 bg-transparent px-3 py-3 text-[15px] text-white placeholder:text-dim"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="book-email" className="field-label">
            Email
          </label>
          <div className="group relative">
            <Mail size={17} className={iconClass} />
            <input
              id="book-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field pl-11"
            />
          </div>
        </div>

        <div>
          <label htmlFor="book-pickup" className="field-label">
            Pickup address
          </label>
          <div className="group relative">
            <MapPin size={17} className={iconClass} />
            <input
              id="book-pickup"
              type="text"
              autoComplete="street-address"
              placeholder="House, street, area"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setCoordinates(null);
              }}
              className="field pr-12 pl-11"
            />
            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              title="Use my current location"
              aria-label="Use my current location"
              className="absolute inset-y-1.5 right-1.5 flex w-10 items-center justify-center rounded-lg text-amber transition-colors duration-200 hover:bg-amber/10 disabled:text-mute"
            >
              {isLocating ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LocateFixed size={18} />
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label
              htmlFor="book-duration"
              className="text-sm font-medium text-fog"
            >
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
            style={{ "--fill": `${fill}%` }}
            className="w-full cursor-pointer"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {quickHours.map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setDuration(hours)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  duration === hours
                    ? "border-white/80 bg-white text-black"
                    : "border-edge text-mute hover:border-[#555] hover:text-white"
                }`}
              >
                {hours} hrs
              </button>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="field-label">Payment</legend>
          <div role="radiogroup" className="grid grid-cols-2 gap-3">
            {paymentOptions.map((option) => {
              const selected = paymentMethod === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium whitespace-nowrap transition-[border-color,background-color,color] duration-200 ${
                    selected
                      ? "border-amber/60 bg-amber/[0.07] text-white"
                      : "border-edge bg-raise text-mute hover:border-[#4a4a4a] hover:text-fog"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${selected ? "text-amber" : ""}`}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
          <p
            key={paymentMethod}
            className="animate-fade mt-2 text-xs text-mute"
          >
            {paymentOptions.find((o) => o.value === paymentMethod).hint}
          </p>
        </fieldset>
      </div>

      <div className="border-t border-line bg-coal/60 px-6 py-5 sm:px-7">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-fog">Total fare</p>
            <p className="text-xs text-mute tabular-nums">
              {duration} {duration === 1 ? "hr" : "hrs"} &times;{" "}
              {formatINR(HOURLY_RATE)}
            </p>
          </div>
          <p
            key={fare}
            className="animate-rise text-3xl font-semibold tracking-tight text-white tabular-nums"
          >
            {formatINR(fare)}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 text-base"
        >
          {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
          {paymentMethod === "Online"
            ? "Continue to payment"
            : "Confirm booking"}
        </button>

        {!isAuthenticated && (
          <p className="mt-3 text-center text-sm text-mute">
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
