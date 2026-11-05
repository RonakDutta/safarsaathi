import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LocateFixed,
  LoaderCircle,
  Minus,
  Plus,
  CreditCard,
  Banknote,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import axios from "../api/axios";
import { HOURLY_RATE, formatINR } from "../lib/pricing";

const DEFAULT_HOURS = 2;
const quickHours = [2, 4, 8, 12];

const paymentOptions = [
  {
    value: "Online",
    label: "Pay online",
    sub: "UPI, card, netbanking",
    icon: CreditCard,
  },
  {
    value: "Cash",
    label: "Pay in cash",
    sub: "After the ride",
    icon: Banknote,
  },
];

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

    if (!isAuthenticated) {
      toast.error("Please log in to book a ride.");
      return;
    }

    if (!name || !pickup || !phone || !email) {
      toast.error("Please fill in all the booking details.");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
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
          await axios.post("/api/book-ride/cancel-booking", {
            bookingId: res.data.bookingId,
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
          toast.error("Payment failed. Please try again.");
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

  return (
    <form
      id="book"
      onSubmit={handleBooking}
      className="scroll-mt-24 rounded-3xl border border-white/10 bg-panel/95 p-5 shadow-2xl shadow-black/60 backdrop-blur sm:p-7"
      noValidate
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Book your driver</h2>
        <span className="rounded-full border border-amber/20 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber tabular-nums">
          {formatINR(HOURLY_RATE)}/hr
        </span>
      </div>

      <div className="mt-6">
        <p className="field-label">Hours</p>
        <div className="flex items-center justify-between rounded-xl border border-line bg-coal p-2">
          <button
            type="button"
            onClick={() => changeHours(-1)}
            disabled={duration <= 1}
            aria-label="One hour less"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-[background-color,transform] duration-150 hover:bg-white/[0.06] active:scale-90 disabled:opacity-30"
          >
            <Minus size={18} />
          </button>
          <p className="text-lg font-semibold text-white tabular-nums">
            {duration} {duration === 1 ? "hour" : "hours"}
          </p>
          <button
            type="button"
            onClick={() => changeHours(1)}
            disabled={duration >= 24}
            aria-label="One hour more"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-[background-color,transform] duration-150 hover:bg-white/[0.06] active:scale-90 disabled:opacity-30"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {quickHours.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setDuration(hours)}
              aria-pressed={duration === hours}
              className={`rounded-lg border py-2 text-xs font-medium transition-[border-color,background-color,color,transform] duration-150 active:scale-95 ${
                duration === hours
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-line text-mute hover:border-edge hover:text-white"
              }`}
            >
              {hours} hrs
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="book-pickup" className="field-label">
            Pickup address
          </label>
          <div className="relative">
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
              className="field pr-12"
            />
            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              title="Use my current location"
              aria-label="Use my current location"
              className="absolute inset-y-1.5 right-1.5 flex w-9 items-center justify-center rounded-lg text-amber transition-[background-color,transform] duration-150 hover:bg-amber/10 active:scale-90 disabled:text-mute"
            >
              {isLocating ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LocateFixed size={18} />
              )}
            </button>
          </div>
          {coordinates && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ok">
              <Check size={14} /> Pinned to your live location
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="field-group">
              <span className="flex items-center pl-4 text-sm text-mute">
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
                className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-white tabular-nums placeholder:text-dim"
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
      </div>

      <div className="mt-6">
        <p className="field-label">Payment</p>
        <div role="radiogroup" className="grid grid-cols-2 gap-2">
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
                className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-[border-color,background-color,transform] duration-150 active:scale-[0.98] ${
                  selected
                    ? "border-amber bg-amber/[0.06]"
                    : "border-line hover:border-edge"
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${selected ? "text-amber" : "text-mute"}`}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    {option.label}
                  </span>
                  <span className="block text-xs text-mute">{option.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-white/[0.06] pt-5">
        <div>
          <p className="text-sm text-mute">Total fare</p>
          <p className="text-xs text-dim tabular-nums">
            {duration} &times; {formatINR(HOURLY_RATE)}, no surge
          </p>
        </div>
        <p className="text-2xl font-bold text-white tabular-nums">
          {formatINR(fare)}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-5 w-full py-3.5 text-base"
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
    </form>
  );
}

export default BookingForm;
