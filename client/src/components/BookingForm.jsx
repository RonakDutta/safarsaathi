import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LocateFixed,
  LoaderCircle,
  User,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Minus,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import axios from "../api/axios";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import FareMeter from "./FareMeter";

const DEFAULT_HOURS = 2;
const quickHours = [2, 4, 8, 12];

const iconClass =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dim transition-colors duration-200 group-focus-within:text-amber";

const paymentOptions = [
  {
    value: "Online",
    label: "Pay online",
    sub: "UPI, card, netbanking",
    icon: CreditCard,
    hint: "Paid securely through Razorpay before the ride.",
  },
  {
    value: "Cash",
    label: "Pay in cash",
    sub: "After the ride",
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

function StepLabel({ n, children }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-sm font-semibold text-white">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-[11px] text-amber tabular-nums">
        {n}
      </span>
      {children}
    </p>
  );
}

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

  const changeHours = (delta) =>
    setDuration((h) => Math.min(24, Math.max(1, h + delta)));

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
      className="relative scroll-mt-28 rounded-[1.75rem] border border-white/[0.08] bg-panel shadow-[0_40px_120px_-30px_rgb(0_0_0/1),0_0_0_1px_rgb(255_193_7/0.04)]"
      noValidate
    >
      <div className="checker absolute inset-x-6 top-0 h-1.5 rounded-b-md [--sq:3px]" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 pt-7 sm:px-7">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Book your driver
          </h2>
        </div>
        <span className="rounded-full border border-amber/25 bg-amber/10 px-3 py-1.5 text-xs font-semibold text-amber tabular-nums">
          {formatINR(HOURLY_RATE)}/hr
        </span>
      </div>

      {/* 1. Hours */}
      <div className="px-5 pt-6 pb-7 sm:px-7">
        <StepLabel n="1">How long do you need a driver?</StepLabel>
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => changeHours(-1)}
            disabled={duration <= 1}
            aria-label="One hour less"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-[background-color,border-color,transform] hover:border-amber/50 hover:text-amber active:scale-90 disabled:opacity-30"
          >
            <Minus size={18} />
          </button>
          <FareMeter
            hours={duration}
            fare={fare}
            className="w-full max-w-[13.5rem]"
          />
          <button
            type="button"
            onClick={() => changeHours(1)}
            disabled={duration >= 24}
            aria-label="One hour more"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-[background-color,border-color,transform] hover:border-amber/50 hover:text-amber active:scale-90 disabled:opacity-30"
          >
            <Plus size={18} />
          </button>
        </div>

        <label htmlFor="book-duration" className="sr-only">
          Duration in hours
        </label>
        <input
          id="book-duration"
          type="range"
          min="1"
          max="24"
          step="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ "--fill": `${fill}%` }}
          className="-mt-3 w-full cursor-pointer"
        />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {quickHours.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setDuration(hours)}
              className={`rounded-full border py-2 text-xs font-semibold transition-[background-color,border-color,color] duration-200 ${
                duration === hours
                  ? "border-amber bg-amber text-black"
                  : "border-white/10 text-mute hover:border-white/30 hover:text-white"
              }`}
            >
              {hours} hrs
            </button>
          ))}
        </div>
      </div>

      <div className="perforation mx-0 [--notch:#000]" />

      {/* 2. Details */}
      <div className="space-y-4 px-5 py-7 sm:px-7">
        <StepLabel n="2">Where and who</StepLabel>

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
              className="field pr-14 pl-11"
            />
            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              title="Use my current location"
              aria-label="Use my current location"
              className="absolute inset-y-2 right-2 flex w-10 items-center justify-center rounded-xl bg-amber/10 text-amber transition-colors duration-200 hover:bg-amber hover:text-black disabled:bg-transparent disabled:text-mute"
            >
              {isLocating ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LocateFixed size={18} />
              )}
            </button>
          </div>
          {coordinates && (
            <p className="animate-fade mt-2 flex items-center gap-1.5 text-xs text-ok">
              <Check size={14} /> Pinned to your live location
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="group flex rounded-2xl border border-line bg-coal transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-amber/70 focus-within:bg-black focus-within:shadow-[0_0_0_4px_rgb(255_193_7/0.1)] hover:border-edge">
              <span className="flex items-center border-r border-line pr-3 pl-4 text-[15px] font-medium text-mute transition-colors group-focus-within:text-amber">
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
                className="w-full min-w-0 bg-transparent px-3 py-3.5 text-[15px] text-white tabular-nums placeholder:text-dim"
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
      </div>

      <div className="perforation [--notch:#000]" />

      {/* 3. Payment */}
      <div className="px-5 pt-7 pb-6 sm:px-7">
        <fieldset>
          <legend className="contents">
            <StepLabel n="3">How will you pay?</StepLabel>
          </legend>
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
                  className={`relative flex flex-col items-start gap-3 rounded-2xl border p-3.5 text-left transition-[border-color,background-color] duration-200 sm:p-4 ${
                    selected
                      ? "border-amber/70 bg-amber/[0.07]"
                      : "border-line bg-coal hover:border-edge"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      selected ? "bg-amber text-black" : "bg-white/5 text-mute"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span>
                    <span
                      className={`block text-sm font-semibold ${selected ? "text-white" : "text-fog"}`}
                    >
                      {option.label}
                    </span>
                    <span className="block text-xs text-mute">{option.sub}</span>
                  </span>
                  <span
                    className={`absolute top-3.5 right-3.5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                      selected
                        ? "border-amber bg-amber text-black"
                        : "border-edge"
                    }`}
                  >
                    {selected && <Check size={12} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          <p
            key={paymentMethod}
            className="animate-fade mt-3 text-xs text-mute"
          >
            {paymentOptions.find((o) => o.value === paymentMethod).hint}
          </p>
        </fieldset>
      </div>

      {/* Total */}
      <div className="rounded-b-[1.75rem] border-t border-white/[0.06] bg-black/40 px-5 pt-5 pb-6 sm:px-7">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-fog">
              Total fare
            </p>
            <p className="mt-0.5 text-xs text-dim tabular-nums">
              {duration} {duration === 1 ? "hr" : "hrs"} &times;{" "}
              {formatINR(HOURLY_RATE)}, no surge
            </p>
          </div>
          <p
            key={fare}
            className="animate-rise text-3xl font-bold tracking-tight text-white tabular-nums"
          >
            {formatINR(fare)}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary group w-full py-4 text-base"
        >
          {isSubmitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : null}
          {paymentMethod === "Online"
            ? "Continue to payment"
            : "Confirm booking"}
          {!isSubmitting && (
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
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
