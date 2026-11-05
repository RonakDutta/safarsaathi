import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  UserCheck,
  Users,
  ArrowRight,
  ChevronRight,
  IndianRupee,
  MapPin,
  Phone,
  CarFront,
  IdCard,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import DashboardShell, {
  PageHeader,
  StatStrip,
  EmptyState,
} from "../components/dashboard/DashboardShell";
import { ConfirmDialog } from "../components/dashboard/Dialog";
import BookingCard from "../components/dashboard/BookingCard";
import { formatINR } from "../lib/pricing";
import {
  formatDate,
  formatDay,
  getStatus,
  hoursLabel,
  formatPhone,
  formatWait,
  minutesSince,
  oldestFirst,
  WAIT_WARN_MINUTES,
} from "../components/dashboard/format";

function SectionTitle({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
      {action}
    </div>
  );
}

function TextButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 -mr-2 text-sm font-medium text-amber transition-colors hover:bg-amber/10"
    >
      {children}
      <ArrowRight
        size={14}
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </button>
  );
}

function WaitText({ booking, now }) {
  const minutes = minutesSince(booking.created_at, now);
  const isLate = minutes != null && minutes >= WAIT_WARN_MINUTES;
  return (
    <div
      className="shrink-0 text-right text-sm"
      title={formatDate(booking.created_at)}
    >
      <p className="font-semibold text-white tabular-nums">
        {hoursLabel(booking.duration)}
      </p>
      {minutes != null && (
        <p
          className={`text-xs tabular-nums ${isLate ? "font-medium text-amber" : "text-mute"}`}
        >
          {minutes < 1 ? "Just in" : `${formatWait(minutes)} wait`}
        </p>
      )}
    </div>
  );
}

function Tabs({ tabs, value, onChange }) {
  return (
    <div
      className="mb-6 grid w-full gap-1 rounded-2xl border border-white/[0.07] bg-coal p-1 sm:inline-grid sm:w-auto"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-[background-color,color,transform] duration-200 active:scale-[0.97] sm:gap-2 sm:px-5 sm:text-sm ${
            value === tab.value
              ? "bg-white/[0.08] text-white"
              : "text-mute hover:text-white"
          }`}
        >
          <span className="truncate">{tab.label}</span>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums sm:px-2 sm:text-xs ${
              tab.highlight && tab.count > 0
                ? "inline-flex bg-amber text-black"
                : `hidden sm:inline-flex ${
                    value === tab.value
                      ? "bg-white/[0.1] text-white"
                      : "bg-white/[0.05] text-dim"
                  }`
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeDrivers: 0,
    pendingApps: 0,
    revenue: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [bookingView, setBookingView] = useState("waiting");
  const [driverList, setDriverList] = useState([]);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  // Ticks so "Waiting 12m" stays current between data refreshes.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);

  const prevCompletedCount = useRef(0);

  const fetchData = useCallback(
    async (isBackgroundPoll = false) => {
      try {
        const [statsRes, bookingsRes, appsRes, driversRes] = await Promise.all([
          axios.get("/api/admin/stats"),
          axios.get("/api/admin/bookings"),
          axios.get("/api/admin/applications"),
          axios.get("/api/admin/drivers-list"),
        ]);

        const fetchedBookings = bookingsRes.data;
        const currentCompletedCount = fetchedBookings.filter(
          (b) => b.status === "completed",
        ).length;
        if (
          isBackgroundPoll &&
          currentCompletedCount > prevCompletedCount.current
        ) {
          toast.success("A driver just completed a ride", { duration: 5000 });
        }
        prevCompletedCount.current = currentCompletedCount;

        setStats(statsRes.data);
        setBookings(fetchedBookings);
        setApplications(appsRes.data);
        setDriverList(driversRes.data);
      } catch (err) {
        if (err.response?.status === 403) navigate("/");
      }
    },
    [navigate],
  );

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
    const pollInterval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(pollInterval);
  }, [fetchData]);

  // Waiting queue runs oldest first, so the longest wait is always on top.
  const pendingBookings = bookings
    .filter((b) => b.status === "pending")
    .sort(oldestFirst);
  const activeBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter(
    (b) => b.status !== "pending" && b.status !== "confirmed",
  );
  const driversById = new Map(driverList.map((d) => [d.user_id, d]));
  const busyDriverIds = new Set(activeBookings.map((b) => b.driver_id));
  const pendingApps = applications.filter((app) => app.status === "pending");

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status: "approved" });
      toast.success("Driver approved");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status: "rejected" });
      toast.success("Application rejected");
      fetchData();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleAssign = async (bookingId) => {
    const driverId = selectedDriver[bookingId];
    if (!driverId) return toast.error("Select a driver first");
    if (assigningId) return;

    setAssigningId(bookingId);
    try {
      await axios.put("/api/admin/assign-driver", {
        booking_id: bookingId,
        driver_id: driverId,
      });
      const name = driversById.get(driverId)?.full_name;
      toast.success(name ? `Assigned to ${name}` : "Driver assigned");
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Assignment failed");
    } finally {
      setAssigningId(null);
    }
  };

  const handleDeleteBooking = async () => {
    const id = deleteBookingId;
    setDeleteBookingId(null);
    try {
      await axios.delete(`/api/admin/bookings/${id}`);
      toast.success("Booking deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const closeDeleteDialog = useCallback(() => setDeleteBookingId(null), []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nav = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    {
      key: "bookings",
      label: "Bookings",
      icon: Ticket,
      count: pendingBookings.length,
      highlight: true,
    },
    {
      key: "applications",
      label: "Applications",
      icon: UserCheck,
      count: pendingApps.length,
      highlight: true,
    },
    { key: "drivers", label: "Drivers", icon: Users, count: driverList.length },
  ];

  const showBookings = (view) => {
    setBookingView(view);
    setActiveTab("bookings");
  };

  const bookingViews = {
    waiting: {
      label: "Waiting",
      list: pendingBookings,
      description: "Oldest requests first. Pick a driver to confirm the ride.",
      empty: "No one is waiting for a driver",
    },
    active: {
      label: "On a ride",
      list: activeBookings,
      description: "Rides with a driver that haven't been closed yet.",
      empty: "No rides in progress",
    },
    completed: {
      label: "Completed",
      list: completedBookings,
      description: "Rides closed with the customer's PIN.",
      empty: "No completed rides yet",
    },
  };
  const currentView = bookingViews[bookingView] || bookingViews.waiting;

  return (
    <DashboardShell
      label="Admin"
      nav={nav}
      active={activeTab}
      onNavigate={setActiveTab}
      user={user}
      onLogout={handleLogout}
    >
      {activeTab === "overview" && (
        <div>
          <PageHeader
            title="Overview"
            description="Refreshes automatically every 20 seconds."
          />

          <StatStrip
            stats={[
              {
                label: "Revenue",
                value: formatINR(stats.revenue),
                accent: true,
                icon: IndianRupee,
              },
              {
                label: "Total bookings",
                value: Number(stats.totalBookings) || 0,
                icon: Ticket,
              },
              {
                label: "Drivers",
                value: Number(stats.activeDrivers) || 0,
                icon: Users,
              },
              {
                label: "To review",
                value: Number(stats.pendingApps) || 0,
                icon: UserCheck,
              },
            ]}
          />

          <div className="mt-10 grid gap-10 xl:grid-cols-[1.4fr_1fr]">
            <section className="min-w-0">
              <SectionTitle
                title="Waiting for a driver"
                action={
                  pendingBookings.length > 0 && (
                    <TextButton onClick={() => showBookings("waiting")}>
                      Assign
                    </TextButton>
                  )
                }
              />
              {pendingBookings.length > 0 ? (
                <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
                  {pendingBookings.slice(0, 5).map((b) => (
                    <li key={b.booking_id}>
                      <button
                        onClick={() => showBookings("waiting")}
                        className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
                          <MapPin size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">
                            {b.user_name}
                          </p>
                          <p className="truncate text-sm text-mute">
                            {b.pickup_location}
                          </p>
                        </div>
                        <WaitText booking={b} now={now} />
                        <ChevronRight
                          size={16}
                          className="-mr-1 shrink-0 text-dim transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={Check}
                  title="Every booking has a driver"
                  body="New requests will appear here."
                />
              )}
            </section>

            <section className="min-w-0">
              <SectionTitle
                title="Applications to review"
                action={
                  pendingApps.length > 0 && (
                    <TextButton onClick={() => setActiveTab("applications")}>
                      Review
                    </TextButton>
                  )
                }
              />
              {pendingApps.length > 0 ? (
                <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
                  {pendingApps.slice(0, 5).map((app) => (
                    <li key={app.application_id}>
                      <button
                        onClick={() => setActiveTab("applications")}
                        className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                          {(app.full_name || "?").charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">
                            {app.full_name}
                          </p>
                          <p className="truncate text-sm text-mute">
                            {app.car_model}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="-mr-1 shrink-0 text-dim transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={UserCheck} title="Nothing to review" />
              )}
            </section>
          </div>

          <section className="mt-10">
            <SectionTitle
              title="Recent bookings"
              action={
                <TextButton onClick={() => setActiveTab("bookings")}>
                  All bookings
                </TextButton>
              }
            />
            {bookings.length > 0 ? (
              <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
                {bookings.slice(0, 6).map((b) => {
                  const status = getStatus(b.status);
                  return (
                    <li
                      key={b.booking_id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 py-3.5 sm:px-5 md:grid-cols-[11rem_minmax(0,1fr)_8rem_9rem] md:items-center md:gap-x-6"
                    >
                      <p className="truncate font-medium text-white">
                        {b.user_name}
                      </p>
                      <p className="col-span-2 row-start-2 truncate text-sm text-mute md:col-span-1 md:row-start-auto">
                        {b.pickup_location}
                      </p>
                      <p className="hidden text-sm text-mute md:block">
                        {hoursLabel(b.duration)} · {b.payment_method}
                      </p>
                      <p className="col-start-2 row-start-1 text-right md:col-start-auto md:row-start-auto">
                        <span className={status.className}>{status.label}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={Ticket} title="No bookings yet" />
            )}
          </section>
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <PageHeader title="Bookings" description={currentView.description} />
          <Tabs
            value={bookingView}
            onChange={setBookingView}
            tabs={Object.entries(bookingViews).map(([value, view]) => ({
              value,
              label: view.label,
              count: view.list.length,
              highlight: value === "waiting",
            }))}
          />

          {currentView.list.length > 0 ? (
            <ul className="space-y-3">
              {currentView.list.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  booking={b}
                  view={bookingView}
                  now={now}
                  drivers={driverList}
                  driversById={driversById}
                  busyIds={busyDriverIds}
                  selectedDriverId={selectedDriver[b.booking_id]}
                  onSelectDriver={(driverId) =>
                    setSelectedDriver((current) => ({
                      ...current,
                      [b.booking_id]: driverId,
                    }))
                  }
                  onAssign={() => handleAssign(b.booking_id)}
                  isAssigning={assigningId === b.booking_id}
                  onDelete={() => setDeleteBookingId(b.booking_id)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={bookingView === "waiting" ? Check : Ticket}
              title={currentView.empty}
              body={
                bookingView === "waiting"
                  ? "New requests will appear here, oldest first."
                  : undefined
              }
            />
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div>
          <PageHeader
            title="Driver applications"
            description="Approving an application upgrades that person's account to a driver account."
          />
          {pendingApps.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {pendingApps.map((app) => (
                <li
                  key={app.application_id}
                  className="surface lift flex flex-col p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber/10 font-semibold text-amber">
                      {(app.full_name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {app.full_name}
                      </p>
                      <p className="truncate text-sm text-mute">{app.email}</p>
                    </div>
                  </div>
                  <dl className="mt-5 grid gap-1 rounded-xl bg-white/[0.02] p-3 text-sm">
                    {[
                      {
                        icon: Phone,
                        label: "Phone",
                        value: formatPhone(app.phone),
                      },
                      { icon: CarFront, label: "Car", value: app.car_model },
                      {
                        icon: IdCard,
                        label: "Licence",
                        value: app.license_number || "Not given",
                      },
                    ].map((row) => {
                      const Icon = row.icon;
                      return (
                        <div
                          key={row.label}
                          className="flex items-center gap-3 px-1 py-1.5"
                        >
                          <Icon size={15} className="shrink-0 text-dim" />
                          <dt className="w-16 shrink-0 text-mute">
                            {row.label}
                          </dt>
                          <dd className="min-w-0 break-words text-fog tabular-nums">
                            {row.value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  {app.applied_at && (
                    <p className="mt-3 text-xs text-dim">
                      Applied {formatDay(app.applied_at)}
                    </p>
                  )}
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <button
                      onClick={() => handleReject(app.application_id)}
                      className="btn-danger"
                    >
                      <X size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.application_id)}
                      className="btn-primary"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No applications waiting"
              body="New driver applications will appear here for review."
            />
          )}
        </div>
      )}

      {activeTab === "drivers" && (
        <div>
          <PageHeader
            title="Drivers"
            description="Everyone approved to take rides, sorted by completed trips."
          />
          {driverList.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {driverList.map((driver) => (
                <li
                  key={driver.user_id}
                  className="surface lift flex flex-col p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber/10 font-semibold text-amber">
                        {(driver.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {driver.full_name}
                        </p>
                        <p className="text-xs text-mute">
                          Joined {formatDay(driver.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-semibold text-white tabular-nums">
                        {driver.total_trips || 0}
                      </p>
                      <p className="text-[11px] text-mute">trips</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5 border-t border-white/[0.06] pt-4 text-sm">
                    <p className="flex items-center gap-2.5 truncate text-fog tabular-nums">
                      <Phone size={14} className="shrink-0 text-dim" />
                      {formatPhone(driver.phone_number) || "No phone on file"}
                    </p>
                    <p className="flex items-center gap-2.5 truncate text-fog">
                      <CarFront size={14} className="shrink-0 text-dim" />
                      {driver.car_model || "No car on file"}
                    </p>
                    <p className="flex items-center gap-2.5 truncate text-mute">
                      <IdCard size={14} className="shrink-0 text-dim" />
                      {driver.license_number || "No licence on file"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              title="No drivers yet"
              body="Approve an application to add your first driver."
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteBookingId !== null}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteBooking}
        title="Delete this booking?"
        description="The customer's request will be removed for good. This cannot be undone."
        confirmLabel="Delete booking"
      />
    </DashboardShell>
  );
};

export default AdminDashboard;
