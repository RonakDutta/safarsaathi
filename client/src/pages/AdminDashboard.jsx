import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Ticket,
  UserCheck,
  Users,
  Trash2,
  ArrowRight,
  ChevronRight,
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
  formatPhone,
  telHref,
  shortId,
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

function Tabs({ tabs, value, onChange }) {
  return (
    <div
      className="mb-6 grid w-full grid-cols-2 gap-1 rounded-2xl border border-white/[0.07] bg-coal p-1 sm:inline-grid sm:w-auto sm:auto-cols-fr"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-[background-color,color,transform] duration-200 active:scale-[0.97] sm:px-5 sm:text-sm ${
            value === tab.value
              ? "bg-white/[0.08] text-white"
              : "text-mute hover:text-white"
          }`}
        >
          <span className="truncate">{tab.label}</span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
              value === tab.value
                ? "bg-amber/15 text-amber"
                : "bg-white/[0.05] text-dim"
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-fog/90">
      <Icon size={13} className="shrink-0 text-mute" />
      <span>{children}</span>
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
  const [selectedDriver, setSelectedDriver] = useState({});
  const [bookingView, setBookingView] = useState("pending");
  const [driverList, setDriverList] = useState([]);
  const [deleteBookingId, setDeleteBookingId] = useState(null);

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

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const otherBookings = bookings.filter((b) => b.status !== "pending");
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

    try {
      await axios.put("/api/admin/assign-driver", {
        booking_id: bookingId,
        driver_id: driverId,
      });
      toast.success("Driver assigned");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Assignment failed");
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
                    <TextButton onClick={() => showBookings("pending")}>
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
                        onClick={() => showBookings("pending")}
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
                        <div className="shrink-0 text-right text-sm">
                          <p className="font-semibold text-white tabular-nums">
                            {hoursLabel(b.duration)}
                          </p>
                          <p className="hidden text-xs text-mute sm:block">
                            {formatDate(b.created_at)}
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
                label: "Assigned & done",
                count: otherBookings.length,
              },
            ]}
          />

          {visibleBookings.length > 0 ? (
            <ul className="space-y-3">
              {visibleBookings.map((b) => {
                const status = getStatus(b.status);
                const isPending = b.status === "pending";
                return (
                  <li
                    key={b.booking_id}
                    className="surface lift grid gap-4 p-4 sm:p-5 lg:grid-cols-[12rem_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:px-6"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3 lg:flex-col lg:justify-start lg:gap-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {b.user_name}
                        </p>
                        <a
                          href={telHref(b.phone)}
                          className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-mute tabular-nums transition-colors hover:text-amber"
                        >
                          <Phone size={13} className="shrink-0" />
                          {formatPhone(b.phone)}
                        </a>
                      </div>
                      <span
                        className="shrink-0 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-dim tabular-nums"
                        title={b.booking_id}
                      >
                        {shortId(b.booking_id)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="flex gap-2 text-sm leading-relaxed text-fog">
                        <MapPin
                          size={15}
                          className="mt-[3px] shrink-0 text-amber"
                        />
                        <span
                          className="min-w-0 lg:line-clamp-2"
                          title={b.pickup_location}
                        >
                          {b.pickup_location}
                        </span>
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Meta icon={Clock}>{hoursLabel(b.duration)}</Meta>
                        <Meta icon={IndianRupee}>{b.payment_method}</Meta>
                        {b.created_at && (
                          <Meta icon={Ticket}>{formatDate(b.created_at)}</Meta>
                        )}
                      </div>
                    </div>

                    {isPending ? (
                      <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4 lg:border-0 lg:pt-0">
                        <select
                          aria-label={`Driver for booking ${b.booking_id}`}
                          className="field min-w-0 flex-1 py-2.5 text-sm lg:w-48 lg:flex-none"
                          value={selectedDriver[b.booking_id] || ""}
                          onChange={(e) =>
                            setSelectedDriver({
                              ...selectedDriver,
                              [b.booking_id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose driver</option>
                          {driverList.map((d) => (
                            <option key={d.user_id} value={d.user_id}>
                              {d.full_name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(b.booking_id)}
                          className="btn-primary shrink-0 px-5 py-2.5"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => setDeleteBookingId(b.booking_id)}
                          className="btn-danger h-10 w-10 shrink-0 p-0"
                          aria-label={`Delete booking ${b.booking_id}`}
                          title="Delete booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4 lg:w-48 lg:justify-end lg:border-0 lg:pt-0">
                        <span className={status.className}>{status.label}</span>
                        <button
                          onClick={() => setDeleteBookingId(b.booking_id)}
                          className="btn-danger h-10 w-10 shrink-0 p-0"
                          aria-label={`Delete booking ${b.booking_id}`}
                          title="Delete booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
