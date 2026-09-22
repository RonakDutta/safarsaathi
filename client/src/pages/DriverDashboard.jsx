import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Car, History, MapPin, Phone, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DashboardShell, {
  PageHeader,
  StatStrip,
  EmptyState,
} from "../components/dashboard/DashboardShell";
import Dialog, { ConfirmDialog } from "../components/dashboard/Dialog";
import { formatINR } from "../lib/pricing";
import {
  formatDate,
  hoursLabel,
  mapsUrl,
} from "../components/dashboard/format";

function PaymentNote({ booking }) {
  if (booking.payment_method === "Online") {
    return <span className="text-ok">Prepaid online</span>;
  }
  return (
    <span className="text-amber">
      Collect {booking.amount ? formatINR(booking.amount) : "fare"} in cash
    </span>
  );
}

function ActiveRide({ booking, onComplete, onCancel }) {
  return (
    <article className="animate-rise overflow-hidden rounded-xl border border-line bg-panel">
      <div className="flex flex-col gap-1 border-b border-line px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-6">
        <h3 className="text-lg font-semibold text-white">{booking.user_name}</h3>
        <p className="text-sm text-mute">
          Booking #{booking.booking_id}
          {booking.created_at && <> &middot; {formatDate(booking.created_at)}</>}
        </p>
      </div>

      <dl className="grid gap-5 px-5 py-5 sm:grid-cols-[2fr_1fr_1fr] sm:px-6">
        <div>
          <dt className="flex items-center gap-2 text-xs text-mute">
            <MapPin size={14} /> Pickup
          </dt>
          <dd className="mt-1.5 leading-relaxed text-fog">
            {booking.pickup_location}
          </dd>
          <a
            href={mapsUrl(booking)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber-soft"
          >
            Open in Maps <ExternalLink size={14} />
          </a>
        </div>
        <div>
          <dt className="text-xs text-mute">Booked for</dt>
          <dd className="mt-1.5 text-fog">{hoursLabel(booking.duration)}</dd>
          <dd className="mt-1 text-sm">
            <PaymentNote booking={booking} />
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-xs text-mute">
            <Phone size={14} /> Customer
          </dt>
          <dd className="mt-1.5">
            <a
              href={`tel:+${booking.phone}`}
              className="text-fog tabular-nums hover:text-white"
            >
              +{booking.phone}
            </a>
          </dd>
        </div>
      </dl>

      <div className="flex flex-col-reverse gap-3 border-t border-line bg-coal px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button onClick={onCancel} className="btn-danger">
          Cancel ride
        </button>
        <button onClick={onComplete} className="btn-primary">
          Complete ride
        </button>
      </div>
    </article>
  );
}

function PastRides({ rides }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel">
      <div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] gap-6 border-b border-line px-6 py-3 text-xs text-mute md:grid">
        <span>Customer</span>
        <span>Date</span>
        <span>Duration</span>
        <span className="text-right">Fare</span>
      </div>
      <ul className="divide-y divide-line">
        {rides.map((ride) => (
          <li
            key={ride.booking_id}
            className="grid grid-cols-[1fr_auto] gap-x-6 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center md:px-6"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{ride.user_name}</p>
              <p className="truncate text-sm text-mute">
                {ride.pickup_location}
              </p>
              <p className="mt-1 text-sm text-mute md:hidden">
                {formatDate(ride.created_at)} &middot; {hoursLabel(ride.duration)}
              </p>
            </div>
            <p className="hidden text-sm text-mute md:block">
              {formatDate(ride.created_at)}
            </p>
            <p className="hidden text-sm text-mute md:block">
              {hoursLabel(ride.duration)} &middot; {ride.payment_method}
            </p>
            <p className="text-right font-semibold text-white tabular-nums">
              {ride.amount ? formatINR(ride.amount) : "—"}
            </p>
          </li>
        ))}
      </ul>
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
    { key: "history", label: "Ride history", icon: History, count: pastRides.length },
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
        <>
          <PageHeader
            title={firstName ? `Hi ${firstName}, here are your rides` : "Your rides"}
            description="Rides assigned to you by the SafarSaathi team."
          />

          <div className="mb-10">
            <StatStrip
              stats={[
                { label: "Active now", value: activeRides.length, accent: true },
                { label: "Completed", value: completedCount },
                { label: "Hours driven", value: hoursDriven },
              ]}
            />
          </div>

          <div className="space-y-5">
            {activeRides.map((booking) => (
              <ActiveRide
                key={booking.booking_id}
                booking={booking}
                onComplete={() => openPinModal(booking.booking_id)}
                onCancel={() => setCancelBookingId(booking.booking_id)}
              />
            ))}
            {activeRides.length === 0 && (
              <EmptyState
                title="No rides assigned right now"
                body="New assignments will show up here as soon as the team books you."
              />
            )}
          </div>
        </>
      ) : (
        <>
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
              title="No completed rides yet"
              body="Rides you finish with a customer PIN will be listed here."
            />
          )}
        </>
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
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
            className="field py-4 text-center text-3xl font-semibold tracking-[0.6em] tabular-nums"
            placeholder="0000"
          />
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={closePinModal} className="btn-secondary">
              Not yet
            </button>
            <button
              type="submit"
              disabled={enteredPin.length !== 4 || isVerifying}
              className="btn-primary"
            >
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
