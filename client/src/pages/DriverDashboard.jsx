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
  Banknote,
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
  telHref,
  shortId,
} from "../components/dashboard/format";

function ActiveRide({ booking, onComplete, onCancel }) {
  const isCash = booking.payment_method !== "Online";
  const fare = Number(booking.amount) || booking.duration * HOURLY_RATE;

  return (
    <article className="surface lift flex flex-col overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
            {booking.user_name}
          </h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-mute tabular-nums">
            <span title={booking.booking_id}>
              {shortId(booking.booking_id)}
            </span>
            {booking.created_at && (
              <>
                <span aria-hidden="true" className="text-dim">
                  ·
                </span>
                {formatDate(booking.created_at)}
              </>
            )}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
            <MapPin size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-mute">Pickup</p>
            <p className="mt-0.5 leading-relaxed text-fog">
              {booking.pickup_location}
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 divide-x divide-white/[0.06] rounded-xl border border-white/[0.06]">
          <div className="min-w-0 px-4 py-3">
            <dt className="text-xs text-mute">Duration</dt>
            <dd className="mt-1 flex items-center gap-1.5 font-semibold text-white tabular-nums">
              <Clock size={15} className="shrink-0 text-mute" />
              {hoursLabel(booking.duration)}
            </dd>
          </div>
          <div className="min-w-0 px-4 py-3">
            <dt className="text-xs text-mute">
              {isCash ? "Collect in cash" : "Payment"}
            </dt>
            <dd
              className={`mt-1 flex items-center gap-1.5 font-semibold tabular-nums ${
                isCash ? "text-amber" : "text-ok"
              }`}
            >
              {isCash ? (
                <Banknote size={15} className="shrink-0" />
              ) : (
                <CircleCheck size={15} className="shrink-0" />
              )}
              <span className="truncate">
                {isCash ? formatINR(fare) : "Prepaid"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-auto space-y-2 border-t border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2">
          <a href={telHref(booking.phone)} className="btn-secondary py-2.5">
            <Phone size={16} />
            Call
          </a>
          <a
            href={mapsUrl(booking)}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-2.5"
          >
            <Navigation size={16} />
            Navigate
          </a>
        </div>
        <button onClick={onComplete} className="btn-primary w-full py-3">
          <KeyRound size={16} />
          Complete with PIN
        </button>
        <button
          onClick={onCancel}
          className="btn w-full py-2.5 font-medium text-danger/80 hover:bg-danger/10 hover:text-danger"
        >
          Cancel ride
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ok/10 text-ok">
            <CircleCheck size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{ride.user_name}</p>
            <p className="truncate text-sm text-mute">{ride.pickup_location}</p>
            <p className="mt-0.5 text-xs text-dim">
              {[
                formatDate(ride.created_at),
                hoursLabel(ride.duration),
                ride.payment_method,
              ]
                .filter(Boolean)
                .join(" · ")}
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
        <div>
          <PageHeader
            title={firstName ? `Hi ${firstName}, ready to roll?` : "Your rides"}
            description="Rides assigned to you by the SafarSaathi team."
          />

          <div className="mb-8">
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

          <div className="grid gap-4 xl:grid-cols-2">
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
        <div>
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
            placeholder="••••"
            value={enteredPin}
            onChange={(e) =>
              setEnteredPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            className="field py-4 text-center text-3xl font-semibold tracking-[0.6em] tabular-nums"
          />
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePinModal}
              className="btn-secondary"
            >
              Not yet
            </button>
            <button
              type="submit"
              disabled={enteredPin.length !== 4 || isVerifying}
              className="btn-primary"
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
