import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  UserCheck,
  Users,
  Trash2,
  ArrowRight,
  IndianRupee,
  MapPin,
  Clock,
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
import { formatINR } from "../lib/pricing";
import {
  formatDate,
  formatDay,
  getStatus,
  hoursLabel,
} from "../components/dashboard/format";

function SectionTitle({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

function TextButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3.5 py-1.5 text-sm font-medium text-amber transition-colors hover:bg-amber hover:text-black"
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
    <div
      className="no-scrollbar mb-6 flex w-full gap-1 overflow-x-auto rounded-full border border-white/[0.07] bg-coal p-1 sm:w-fit"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex flex-1 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 sm:flex-none ${
            value === tab.value
              ? "bg-amber text-black"
              : "text-mute hover:text-white"
          }`}
        >
          {tab.label}
          <span
            className={`rounded-full px-1.5 text-xs tabular-nums ${
              value === tab.value ? "bg-black/15" : "bg-white/[0.06]"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function Meta({ icon, children }) {
  const Icon = icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-fog">
      <Icon size={13} className="text-mute" />
      {children}
    </span>
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
                    <TextButton onClick={() => showBookings("pending")}>
                      Assign
                    </TextButton>
                  )
                }
              />
              {pendingBookings.length > 0 ? (
                <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
                  {pendingBookings.slice(0, 5).map((b) => (
                    <li
                      key={b.booking_id}
                      className="flex items-center gap-4 px-4 py-4 transition-colors duration-200 hover:bg-white/[0.02] sm:px-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
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
                      <div className="shrink-0 text-right text-sm">
                        <p className="font-semibold text-white tabular-nums">
                          {hoursLabel(b.duration)}
                        </p>
                        <p className="text-xs text-mute">
                          {formatDate(b.created_at)}
                        </p>
                      </div>
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
                    <li
                      key={app.application_id}
                      className="flex items-center gap-4 px-4 py-4 sm:px-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-bold text-white">
                        {(app.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {app.full_name}
                        </p>
                        <p className="truncate text-sm text-mute">
                          {app.car_model}
                        </p>
                      </div>
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
                <TextButton onClick={() => showBookings("history")}>
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
                      className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 px-4 py-4 sm:px-5 md:grid-cols-[10rem_1fr_9rem_9rem] md:items-center"
                    >
                      <p className="truncate font-medium text-white">
                        {b.user_name}
                      </p>
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
              <EmptyState icon={Ticket} title="No bookings yet" />
            )}
          </section>
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="animate-rise">
          <PageHeader
            title="Bookings"
            description="Pick a driver for each new request."
          />
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
            <ul className="space-y-3">
              {visibleBookings.map((b) => {
                const status = getStatus(b.status);
                return (
                  <li
                    key={b.booking_id}
                    className="surface grid gap-4 p-4 transition-colors duration-200 hover:border-white/15 sm:p-5 lg:grid-cols-[1.1fr_1.6fr_auto] lg:items-center lg:gap-8 lg:px-6"
                  >
                    <div className="flex items-start justify-between gap-3 lg:block">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {b.user_name}
                        </p>
                        <a
                          href={`tel:+${b.phone}`}
                          className="text-sm text-mute tabular-nums hover:text-amber"
                        >
                          +{b.phone}
                        </a>
                      </div>
                      <span className="shrink-0 text-xs text-dim tabular-nums lg:mt-1 lg:block">
                        #{b.booking_id}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="flex gap-2 text-sm leading-relaxed text-fog lg:line-clamp-2">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-amber"
                        />
                        {b.pickup_location}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <Meta icon={Clock}>{hoursLabel(b.duration)}</Meta>
                        <Meta icon={IndianRupee}>{b.payment_method}</Meta>
                        {b.created_at && (
                          <Meta icon={Ticket}>{formatDate(b.created_at)}</Meta>
                        )}
                      </div>
                    </div>

                    {b.status === "pending" ? (
                      <div className="flex gap-2 border-t border-white/[0.06] pt-4 lg:border-0 lg:pt-0">
                        <select
                          aria-label={`Driver for booking ${b.booking_id}`}
                          className="field min-w-0 flex-1 rounded-full py-2.5 text-sm lg:w-44 lg:flex-none"
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
                          className="btn-primary px-5 py-2.5"
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
                        <span className={status.className}>{status.label}</span>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={Ticket}
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
            <ul className="grid gap-4 md:grid-cols-2">
              {pendingApps.map((app) => (
                <li
                  key={app.application_id}
                  className="surface flex flex-col p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber text-lg font-bold text-black">
                      {(app.full_name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {app.full_name}
                      </p>
                      <p className="truncate text-sm text-mute">
                        {app.email}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-5 grid gap-2 text-sm">
                    {[
                      { icon: Phone, label: "Phone", value: app.phone },
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
                          className="flex items-center gap-3 rounded-2xl bg-black/40 px-3.5 py-2.5"
                        >
                          <Icon size={15} className="shrink-0 text-amber" />
                          <dt className="w-16 shrink-0 text-mute">
                            {row.label}
                          </dt>
                          <dd className="min-w-0 break-all text-fog tabular-nums">
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
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleReject(app.application_id)}
                      className="btn-danger py-3"
                    >
                      <X size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.application_id)}
                      className="btn-primary py-3"
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

      {/* DRIVERS */}
      {activeTab === "drivers" && (
        <div className="animate-rise">
          <PageHeader
            title="Drivers"
            description="Everyone approved to take rides, sorted by completed trips."
          />
          {driverList.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {driverList.map((driver, index) => (
                <li
                  key={driver.user_id}
                  className="surface relative flex flex-col overflow-hidden p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-bold ${
                          index === 0 && Number(driver.total_trips) > 0
                            ? "bg-amber text-black"
                            : "bg-white/[0.06] text-white"
                        }`}
                      >
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
                      <p className="text-2xl font-bold text-white tabular-nums">
                        {driver.total_trips || 0}
                      </p>
                      <p className="text-[11px] text-mute">trips</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5 border-t border-white/[0.06] pt-4 text-sm">
                    <p className="flex items-center gap-2.5 truncate text-fog tabular-nums">
                      <Phone size={14} className="shrink-0 text-dim" />
                      {driver.phone_number || "No phone on file"}
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
