import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  History,
  MapPin,
  Phone,
  Navigation,
  Clock,
  CircleCheck,
  Timer,
  KeyRound,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import DashboardShell, {
  PageHeader,
  StatStrip,
  EmptyState,
} from "../components/dashboard/DashboardShell";
import Dialog, { ConfirmDialog } from "../components/dashboard/Dialog";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import {
  formatDate,
  hoursLabel,
  mapsUrl,
} from "../components/dashboard/format";

function PaymentNote({ booking }) {
  if (booking.payment_method === "Online") {
    return (
      <span className="rounded-full bg-ok/10 px-2.5 py-1 text-xs font-semibold text-ok">
        Prepaid online
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber/10 px-2.5 py-1 text-xs font-semibold text-amber">
      Collect {booking.amount ? formatINR(booking.amount) : "fare"} in cash
    </span>
  );
}

function ActiveRide({ booking, onComplete, onCancel }) {
  return (
    <article className="animate-rise relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-panel">
      <div className="checker h-2 [--sq:4px]" />

      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
        <div className="min-w-0">
          <p className="text-xs text-mute tabular-nums">
            Booking #{booking.booking_id}
            {booking.created_at && <>, {formatDate(booking.created_at)}</>}
          </p>
          <h3 className="mt-1 truncate text-2xl font-bold tracking-tight text-white">
            {booking.user_name}
          </h3>
        </div>
        <div className="shrink-0 rounded-2xl bg-amber px-3.5 py-2 text-center text-black">
          <p className="text-2xl leading-none font-extrabold tabular-nums">
            {booking.duration}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold">
            {Number(booking.duration) === 1 ? "hour" : "hours"}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-7">
        <div className="flex gap-3 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
            <MapPin size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-mute">Pickup</p>
            <p className="mt-0.5 leading-relaxed text-fog">
              {booking.pickup_location}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PaymentNote booking={booking} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <a
            href={`tel:+${booking.phone}`}
            className="btn-secondary py-3.5"
          >
            <Phone size={17} />
            Call
          </a>
          <a
            href={mapsUrl(booking)}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-3.5"
          >
            <Navigation size={17} />
            Navigate
          </a>
        </div>
      </div>

      <div className="perforation [--notch:#000]" />

      <div className="flex flex-col-reverse gap-2.5 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
        <button onClick={onCancel} className="btn-danger py-3.5">
          Cancel ride
        </button>
        <button onClick={onComplete} className="btn-primary py-3.5 sm:px-8">
          <KeyRound size={17} />
          Complete with PIN
        </button>
      </div>
    </article>
  );
}

function PastRides({ rides }) {
  return (
    <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
      {rides.map((ride) => (
        <li
          key={ride.booking_id}
          className="flex items-center gap-4 px-4 py-4 sm:px-6"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ok/10 text-ok">
            <CircleCheck size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{ride.user_name}</p>
            <p className="truncate text-sm text-mute">
              {ride.pickup_location}
            </p>
            <p className="mt-0.5 text-xs text-dim">
              {formatDate(ride.created_at)}, {hoursLabel(ride.duration)},{" "}
              {ride.payment_method}
            </p>
          </div>
          <p className="shrink-0 text-right font-bold text-white tabular-nums">
            {formatINR(ride.amount || ride.duration * HOURLY_RATE)}
          </p>
        </li>
      ))}
    </ul>
  );
}

// Four boxes over one real input, so paste and autofill still work.
function PinInput({ value, onChange }) {
  return (
    <div className="relative mx-auto w-fit">
      <div className="flex gap-3" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => {
          const filled = value[i] !== undefined;
          const current = i === value.length;
          return (
            <span
              key={i}
              className={`flex h-16 w-14 items-center justify-center rounded-2xl border text-3xl font-bold tabular-nums transition-colors duration-150 sm:h-[4.5rem] sm:w-16 ${
                filled
                  ? "border-amber bg-amber/10 text-amber"
                  : current
                    ? "border-white/40 bg-black text-white"
                    : "border-white/10 bg-black text-dim"
              }`}
            >
              {value[i] ??
                (current ? (
                  <span className="animate-blink h-7 w-0.5 bg-white/70" />
                ) : (
                  ""
                ))}
            </span>
          );
        })}
      </div>
      <label htmlFor="ride-pin" className="sr-only">
        Customer PIN
      </label>
      <input
        id="ride-pin"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength="4"
        value={value}
        onChange={onChange}
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
      />
    </div>
  );
}

const DriverDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeTab, setActiveTab] = useState("active");
  const [pinBookingId, setPinBookingId] = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await axios.get("/api/driver-board/my-trips");
      setBookings(res.data.bookings);
      setCompletedCount(Number(res.data.completedCount) || 0);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const activeRides = bookings.filter((b) => b.status === "confirmed");
  const pastRides = bookings.filter((b) => b.status === "completed");
  const hoursDriven = pastRides.reduce(
    (sum, b) => sum + (Number(b.duration) || 0),
    0,
  );

  const openPinModal = (id) => {
    setPinBookingId(id);
    setEnteredPin("");
  };

  const closePinModal = useCallback(() => setPinBookingId(null), []);
  const closeCancelModal = useCallback(() => setCancelBookingId(null), []);

  const submitCompleteRide = async (e) => {
    e.preventDefault();
    if (enteredPin.length !== 4) return toast.error("PIN must be 4 digits");

    setIsVerifying(true);
    try {
      await axios.put(`/api/driver-board/complete/${pinBookingId}`, {
        pin: enteredPin,
      });
      toast.success("Ride completed");
      setPinBookingId(null);
      setEnteredPin("");
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update trip");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelRide = async () => {
    const id = cancelBookingId;
    setCancelBookingId(null);
    try {
      await axios.put(`/api/driver-board/cancel/${id}`);
      toast.success("Ride cancelled and returned to the queue");
      fetchTrips();
    } catch {
      toast.error("Failed to cancel trip");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nav = [
    {
      key: "active",
      label: "Active rides",
      icon: Car,
      count: activeRides.length,
      highlight: true,
    },
    {
      key: "history",
      label: "Ride history",
      icon: History,
      count: pastRides.length,
    },
  ];

  const firstName = (user?.name || user?.full_name || "").split(" ")[0];

  return (
    <DashboardShell
      label="Driver"
      nav={nav}
      active={activeTab}
      onNavigate={setActiveTab}
      user={user}
      onLogout={handleLogout}
    >
      {activeTab === "active" ? (
        <div key="active" className="animate-rise">
          <PageHeader
            title={firstName ? `Hi ${firstName}, ready to roll?` : "Your rides"}
            description="Rides assigned to you by the SafarSaathi team."
          />

          <div className="mb-10">
            <StatStrip
              stats={[
                {
                  label: "Active now",
                  value: activeRides.length,
                  accent: true,
                  icon: Car,
                },
                {
                  label: "Completed",
                  value: completedCount,
                  icon: CircleCheck,
                },
                { label: "Hours driven", value: hoursDriven, icon: Timer },
              ]}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {activeRides.map((booking) => (
              <ActiveRide
                key={booking.booking_id}
                booking={booking}
                onComplete={() => openPinModal(booking.booking_id)}
                onCancel={() => setCancelBookingId(booking.booking_id)}
              />
            ))}
          </div>
          {activeRides.length === 0 && (
            <EmptyState
              icon={Car}
              title="No rides assigned right now"
              body="New assignments will show up here as soon as the team books you."
            />
          )}
        </div>
      ) : (
        <div key="history" className="animate-rise">
          <PageHeader
            title="Ride history"
            description={`${completedCount} completed ${
              completedCount === 1 ? "ride" : "rides"
            }, ${hoursDriven} hours on the road.`}
          />
          {pastRides.length > 0 ? (
            <PastRides rides={pastRides} />
          ) : (
            <EmptyState
              icon={Clock}
              title="No completed rides yet"
              body="Rides you finish with a customer PIN will be listed here."
            />
          )}
        </div>
      )}

      <Dialog
        open={pinBookingId !== null}
        onClose={closePinModal}
        title="End ride"
        description="Ask the customer for the 4-digit PIN they received on WhatsApp."
      >
        <form onSubmit={submitCompleteRide}>
          <PinInput
            value={enteredPin}
            onChange={(e) =>
              setEnteredPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePinModal}
              className="btn-secondary py-3.5"
            >
              Not yet
            </button>
            <button
              type="submit"
              disabled={enteredPin.length !== 4 || isVerifying}
              className="btn-primary py-3.5"
            >
              {isVerifying && (
                <LoaderCircle size={17} className="animate-spin" />
              )}
              Verify and complete
            </button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={cancelBookingId !== null}
        onClose={closeCancelModal}
        onConfirm={handleCancelRide}
        title="Cancel this ride?"
        description="The booking goes back to the pending queue so the team can assign another driver."
        confirmLabel="Cancel ride"
        cancelLabel="Keep ride"
      />
    </DashboardShell>
  );
};

export default DriverDashboard;
