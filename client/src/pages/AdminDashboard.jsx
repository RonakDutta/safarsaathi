import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  UserCheck,
  Users,
  Trash2,
  ArrowRight,
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
import { formatINR } from "../lib/pricing";
import {
  formatDate,
  formatDay,
  getStatus,
  hoursLabel,
} from "../components/dashboard/format";

function SectionTitle({ title, action }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

function TextButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber-soft"
    >
      {children}
      <ArrowRight
        size={14}
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </button>
  );
}

function Tabs({ tabs, value, onChange }) {
  return (
    <div className="mb-6 flex gap-6 border-b border-line" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors duration-200 ${
            value === tab.value
              ? "border-amber text-white"
              : "border-transparent text-mute hover:text-white"
          }`}
        >
          {tab.label}
          <span className="ml-2 text-mute tabular-nums">{tab.count}</span>
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
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [bookingView, setBookingView] = useState("pending");
  const [driverList, setDriverList] = useState([]);
  const [deleteBookingId, setDeleteBookingId] = useState(null);

  // Ref to track completed rides for notifications
  const prevCompletedCount = useRef(0);

  const fetchData = useCallback(
    async (isBackgroundPoll = false) => {
      try {
        const statsRes = await axios.get("/api/admin/stats");
        setStats(statsRes.data);

        const bookingsRes = await axios.get("/api/admin/bookings");
        const fetchedBookings = bookingsRes.data;

        // Notify when a driver completes a ride between polls
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

        setBookings(fetchedBookings);

        const appsRes = await axios.get("/api/admin/applications");
        setApplications(appsRes.data);

        const driversRes = await axios.get("/api/admin/drivers");
        setDrivers(driversRes.data);

        const driversListRes = await axios.get("/api/admin/drivers-list");
        setDriverList(driversListRes.data);
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

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const otherBookings = bookings.filter((b) => b.status !== "pending");
  const pendingApps = applications.filter((app) => app.status === "pending");

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status: "approved" });
      toast.success("Driver approved");
      fetchData();
    } catch {
      toast.error("Update failed");
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

    try {
      await axios.put("/api/admin/assign-driver", {
        booking_id: bookingId,
        driver_id: driverId,
      });
      toast.success("Driver assigned");
      fetchData();
    } catch {
      toast.error("Assignment failed");
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

  const visibleBookings =
    bookingView === "pending" ? pendingBookings : otherBookings;

  return (
    <DashboardShell
      label="Admin"
      nav={nav}
      active={activeTab}
      onNavigate={setActiveTab}
      user={user}
      onLogout={handleLogout}
    >
      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="animate-rise">
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
              },
              {
                label: "Total bookings",
                value: Number(stats.totalBookings) || 0,
              },
              { label: "Drivers", value: Number(stats.activeDrivers) || 0 },
              {
                label: "Applications to review",
                value: Number(stats.pendingApps) || 0,
              },
            ]}
          />

          <div className="mt-12 grid gap-12 xl:grid-cols-[1.4fr_1fr]">
            <section>
              <SectionTitle
                title="Waiting for a driver"
                action={
                  pendingBookings.length > 0 && (
                    <TextButton onClick={() => showBookings("pending")}>
                      Assign drivers
                    </TextButton>
                  )
                }
              />
              {pendingBookings.length > 0 ? (
                <ul className="divide-y divide-line rounded-2xl border border-line bg-panel">
                  {pendingBookings.slice(0, 5).map((b) => (
                    <li
                      key={b.booking_id}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {b.user_name}
                        </p>
                        <p className="truncate text-sm text-mute">
                          {b.pickup_location}
                        </p>
                      </div>
                      <div className="shrink-0 text-right text-sm">
                        <p className="text-fog">{hoursLabel(b.duration)}</p>
                        <p className="text-mute">{formatDate(b.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="Every booking has a driver"
                  body="New requests will appear here."
                />
              )}
            </section>

            <section>
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
                <ul className="divide-y divide-line rounded-2xl border border-line bg-panel">
                  {pendingApps.slice(0, 5).map((app) => (
                    <li key={app.application_id} className="px-5 py-4">
                      <p className="font-medium text-white">{app.full_name}</p>
                      <p className="text-sm text-mute">{app.car_model}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Nothing to review" />
              )}
            </section>
          </div>

          <section className="mt-12">
            <SectionTitle
              title="Recent bookings"
              action={
                <TextButton onClick={() => showBookings("history")}>
                  All bookings
                </TextButton>
              }
            />
            {bookings.length > 0 ? (
              <ul className="divide-y divide-line rounded-2xl border border-line bg-panel">
                {bookings.slice(0, 6).map((b) => {
                  const status = getStatus(b.status);
                  return (
                    <li
                      key={b.booking_id}
                      className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 px-5 py-4 md:grid-cols-[10rem_1fr_8rem_8rem] md:items-center"
                    >
                      <p className="font-medium text-white">{b.user_name}</p>
                      <p className="col-span-2 row-start-2 truncate text-sm text-mute md:col-span-1 md:row-start-auto">
                        {b.pickup_location}
                      </p>
                      <p className="hidden text-sm text-mute md:block">
                        {hoursLabel(b.duration)}, {b.payment_method}
                      </p>
                      <p className="col-start-2 row-start-1 text-right md:col-start-auto md:row-start-auto">
                        <span className={status.className}>{status.label}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="No bookings yet" />
            )}
          </section>
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="animate-rise">
          <PageHeader title="Bookings" />
          <Tabs
            value={bookingView}
            onChange={setBookingView}
            tabs={[
              {
                value: "pending",
                label: "Needs a driver",
                count: pendingBookings.length,
              },
              {
                value: "history",
                label: "Assigned and completed",
                count: otherBookings.length,
              },
            ]}
          />

          {visibleBookings.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="hidden grid-cols-[1.1fr_1.6fr_1fr_1.5fr] gap-6 border-b border-line px-6 py-3 text-xs text-mute lg:grid">
                <span>Customer</span>
                <span>Pickup</span>
                <span>Trip</span>
                <span className="text-right">
                  {bookingView === "pending" ? "Assign" : "Status"}
                </span>
              </div>
              <ul className="divide-y divide-line">
                {visibleBookings.map((b) => {
                  const status = getStatus(b.status);
                  return (
                    <li
                      key={b.booking_id}
                      className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1.6fr_1fr_1.5fr] lg:items-center lg:gap-6 lg:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {b.user_name}
                        </p>
                        <p className="text-sm text-mute tabular-nums">
                          <a
                            href={`tel:+${b.phone}`}
                            className="hover:text-white"
                          >
                            +{b.phone}
                          </a>
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-fog lg:line-clamp-2">
                        {b.pickup_location}
                      </p>
                      <div className="text-sm">
                        <p className="text-fog">
                          {hoursLabel(b.duration)}, {b.payment_method}
                        </p>
                        <p className="text-mute">
                          #{b.booking_id}, {formatDate(b.created_at)}
                        </p>
                      </div>

                      {b.status === "pending" ? (
                        <div className="flex gap-2 lg:justify-end">
                          <select
                            aria-label={`Driver for booking ${b.booking_id}`}
                            className="field min-w-0 flex-1 py-2.5 text-sm lg:max-w-44"
                            value={selectedDriver[b.booking_id] || ""}
                            onChange={(e) =>
                              setSelectedDriver({
                                ...selectedDriver,
                                [b.booking_id]: e.target.value,
                              })
                            }
                          >
                            <option value="">Choose driver</option>
                            {drivers.map((d) => (
                              <option key={d.user_id} value={d.user_id}>
                                {d.full_name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssign(b.booking_id)}
                            className="btn-primary py-2.5"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setDeleteBookingId(b.booking_id)}
                            className="btn-danger px-3 py-2.5"
                            aria-label={`Delete booking ${b.booking_id}`}
                            title="Delete booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <p className="lg:text-right">
                          <span className={status.className}>
                            {status.label}
                          </span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <EmptyState
              title={
                bookingView === "pending"
                  ? "No bookings are waiting for a driver"
                  : "No assigned or completed bookings yet"
              }
            />
          )}
        </div>
      )}

      {/* APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="animate-rise">
          <PageHeader
            title="Driver applications"
            description="Approving an application upgrades that person's account to a driver account."
          />
          {pendingApps.length > 0 ? (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-panel">
              {pendingApps.map((app) => (
                <li
                  key={app.application_id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1.5fr_auto] md:items-center md:gap-8 md:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {app.full_name}
                    </p>
                    <p className="truncate text-sm text-mute">
                      {app.email}
                      {app.applied_at && (
                        <>, applied {formatDay(app.applied_at)}</>
                      )}
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <dt className="text-mute">Phone</dt>
                      <dd className="mt-0.5 text-fog tabular-nums">
                        {app.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-mute">Car</dt>
                      <dd className="mt-0.5 text-fog">{app.car_model}</dd>
                    </div>
                    <div>
                      <dt className="text-mute">Licence</dt>
                      <dd className="mt-0.5 break-all text-fog">
                        {app.license_number || "Not given"}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex gap-2 md:justify-end">
                    <button
                      onClick={() => handleReject(app.application_id)}
                      className="btn-danger flex-1 py-2.5 md:flex-none"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.application_id)}
                      className="btn-primary flex-1 py-2.5 md:flex-none"
                    >
                      Approve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No applications waiting"
              body="New driver applications will appear here for review."
            />
          )}
        </div>
      )}

      {/* DRIVERS */}
      {activeTab === "drivers" && (
        <div className="animate-rise">
          <PageHeader
            title="Drivers"
            description="Everyone approved to take rides, sorted by completed trips."
          />
          {driverList.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="hidden grid-cols-[1.2fr_1.5fr_1.3fr_5rem] gap-6 border-b border-line px-6 py-3 text-xs text-mute md:grid">
                <span>Driver</span>
                <span>Contact</span>
                <span>Vehicle</span>
                <span className="text-right">Trips</span>
              </div>
              <ul className="divide-y divide-line">
                {driverList.map((driver) => (
                  <li
                    key={driver.user_id}
                    className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 px-5 py-5 md:grid-cols-[1.2fr_1.5fr_1.3fr_5rem] md:items-center md:px-6"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {driver.full_name}
                      </p>
                      <p className="text-sm text-mute">
                        Joined {formatDay(driver.created_at)}
                      </p>
                    </div>
                    <div className="col-span-2 min-w-0 text-sm md:col-span-1">
                      <p className="truncate text-fog tabular-nums">
                        {driver.phone_number || "No phone on file"}
                      </p>
                      <p className="truncate text-mute">{driver.email}</p>
                    </div>
                    <div className="col-span-2 min-w-0 text-sm md:col-span-1">
                      <p className="truncate text-fog">
                        {driver.car_model || "No car on file"}
                      </p>
                      <p className="truncate text-mute">
                        {driver.license_number || "No licence on file"}
                      </p>
                    </div>
                    <p className="col-start-2 row-start-1 text-right text-lg font-semibold text-white tabular-nums md:col-start-auto md:row-start-auto">
                      {driver.total_trips || 0}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState
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
