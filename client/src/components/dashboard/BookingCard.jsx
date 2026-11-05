import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Clock,
  Ellipsis,
  LoaderCircle,
  MapPin,
  Phone,
  Timer,
  Trash2,
  UserRound,
} from "lucide-react";
import { HOURLY_RATE, formatINR } from "../../lib/pricing";
import {
  WAIT_WARN_MINUTES,
  formatDate,
  formatPhone,
  formatWait,
  hoursLabel,
  minutesSince,
  shortId,
  telHref,
} from "./format";

const chip =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums";

function Chip({
  icon,
  className = "bg-white/[0.05] text-fog/90",
  children,
  title,
}) {
  const Icon = icon;
  return (
    <span className={`${chip} ${className}`} title={title}>
      <Icon size={13} className="shrink-0 opacity-80" />
      {children}
    </span>
  );
}

export function WaitChip({ createdAt, now }) {
  const minutes = minutesSince(createdAt, now);
  if (minutes == null) return null;
  const isLate = minutes >= WAIT_WARN_MINUTES;
  return (
    <Chip
      icon={Timer}
      title={`Booked ${formatDate(createdAt)}`}
      className={
        isLate ? "bg-amber/15 text-amber" : "bg-white/[0.05] text-fog/90"
      }
    >
      {minutes < 1 ? "Just in" : `Waiting ${formatWait(minutes)}`}
    </Chip>
  );
}

function FareChip({ booking }) {
  const isPrepaid = booking.payment_method === "Online";
  const fare =
    Number(booking.amount) || (Number(booking.duration) || 0) * HOURLY_RATE;
  return (
    <Chip
      icon={isPrepaid ? CircleCheck : Banknote}
      className={isPrepaid ? "bg-ok/10 text-ok" : "bg-white/[0.05] text-fog/90"}
    >
      {formatINR(fare)} {isPrepaid ? "prepaid" : "cash"}
    </Chip>
  );
}

const tripsLabel = (driver) => {
  const trips = Number(driver.total_trips) || 0;
  return `${trips} ${trips === 1 ? "trip" : "trips"}`;
};

// A native <select> (so phones get their own picker) laid over a
// two-line display that can show the driver's car and trip count.
function DriverPicker({
  bookingId,
  drivers,
  busyIds,
  value,
  onChange,
  disabled,
}) {
  const selected = drivers.find((d) => String(d.user_id) === String(value));
  const free = drivers.filter((d) => !busyIds.has(d.user_id));
  const busy = drivers.filter((d) => busyIds.has(d.user_id));
  const option = (d) => (
    <option key={d.user_id} value={d.user_id}>
      {[d.full_name, d.car_model, tripsLabel(d)].filter(Boolean).join(" · ")}
    </option>
  );

  return (
    <div
      className={`relative min-w-0 flex-1 rounded-xl border bg-coal transition-[border-color,box-shadow] duration-200 has-[:focus-visible]:border-amber/70 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-amber/10 sm:max-w-sm ${
        disabled ? "border-line opacity-60" : "border-line hover:border-edge"
      }`}
    >
      <div
        aria-hidden="true"
        className="flex h-11 items-center gap-3 pr-9 pl-3.5 sm:pl-3"
      >
        <span
          className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:flex ${
            selected ? "bg-amber/15 text-amber" : "bg-white/[0.05] text-dim"
          }`}
        >
          {selected ? (
            (selected.full_name || "?").charAt(0).toUpperCase()
          ) : (
            <UserRound size={14} />
          )}
        </span>
        {selected ? (
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium text-white">
              {selected.full_name}
            </span>
            <span className="block truncate text-[11px] text-mute">
              {[selected.car_model, tripsLabel(selected)]
                .filter(Boolean)
                .join(" · ")}
              {busyIds.has(selected.user_id) && (
                <span className="text-amber"> · on a ride</span>
              )}
            </span>
          </span>
        ) : (
          <span className="truncate text-sm text-dim">
            {drivers.length ? "Choose a driver" : "No drivers yet"}
          </span>
        )}
      </div>
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-mute"
      />
      <select
        aria-label={`Driver for booking ${shortId(bookingId)}`}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || drivers.length === 0}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      >
        <option value="">Choose a driver</option>
        {busy.length > 0 ? (
          <>
            {free.length > 0 && (
              <optgroup label="Free now">{free.map(option)}</optgroup>
            )}
            <optgroup label="On a ride">{busy.map(option)}</optgroup>
          </>
        ) : (
          free.map(option)
        )}
      </select>
    </div>
  );
}

function DriverTag({ driver, label }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/10 text-sm font-semibold text-amber">
        {driver ? (
          (driver.full_name || "?").charAt(0).toUpperCase()
        ) : (
          <UserRound size={16} />
        )}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[11px] text-mute">{label}</p>
        <p className="truncate text-sm font-medium text-white">
          {driver ? driver.full_name : "Driver no longer listed"}
          {driver?.car_model && (
            <span className="font-normal text-mute"> · {driver.car_model}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function RowMenu({ label, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-auto shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More actions for ${label}`}
        title="More actions"
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-90 ${
          open
            ? "bg-white/[0.08] text-white"
            : "text-mute hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Ellipsis size={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="animate-pop absolute right-0 bottom-full z-20 mb-2 w-48 rounded-xl border border-white/10 bg-raise p-1 shadow-2xl shadow-black"
        >
          <button
            type="button"
            role="menuitem"
            autoFocus
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:bg-danger/10 focus-visible:outline-none"
          >
            <Trash2 size={16} />
            Delete booking
          </button>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  view,
  now,
  drivers,
  driversById,
  busyIds,
  selectedDriverId,
  onSelectDriver,
  onAssign,
  isAssigning,
  onDelete,
}) {
  const driver = driversById.get(booking.driver_id);
  const isWaiting = view === "waiting";

  return (
    <li className="surface lift">
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8 lg:px-6">
        <div className="flex min-w-0 items-start justify-between gap-3 md:flex-col md:justify-start md:gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">
              {booking.user_name}
            </p>
            <a
              href={telHref(booking.phone)}
              className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-mute tabular-nums transition-colors hover:text-amber"
            >
              <Phone size={13} className="shrink-0" />
              {formatPhone(booking.phone)}
            </a>
          </div>
          <span
            className="shrink-0 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-dim tabular-nums"
            title={booking.booking_id}
          >
            {shortId(booking.booking_id)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="flex gap-2 text-sm leading-relaxed text-fog">
            <MapPin size={15} className="mt-[3px] shrink-0 text-amber" />
            <span
              className="min-w-0 md:line-clamp-2"
              title={booking.pickup_location}
            >
              {booking.pickup_location}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isWaiting && <WaitChip createdAt={booking.created_at} now={now} />}
            <Chip icon={Clock}>{hoursLabel(booking.duration)}</Chip>
            <FareChip booking={booking} />
            {!isWaiting && booking.created_at && (
              <Chip icon={CalendarDays}>{formatDate(booking.created_at)}</Chip>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-b-2xl border-t border-white/[0.06] bg-white/[0.015] px-4 py-3 sm:px-5 lg:px-6">
        {isWaiting ? (
          <>
            <DriverPicker
              bookingId={booking.booking_id}
              drivers={drivers}
              busyIds={busyIds}
              value={selectedDriverId}
              onChange={onSelectDriver}
              disabled={isAssigning}
            />
            <button
              onClick={onAssign}
              disabled={!selectedDriverId}
              aria-busy={isAssigning}
              className={
                selectedDriverId
                  ? `btn-primary h-11 shrink-0 px-4 py-0 sm:px-5 ${isAssigning ? "pointer-events-none" : ""}`
                  : "inline-flex h-11 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-white/[0.06] px-4 text-sm font-semibold text-dim sm:px-5"
              }
            >
              {isAssigning && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {isAssigning ? "Assigning" : "Assign"}
            </button>
          </>
        ) : (
          <>
            <DriverTag
              driver={driver}
              label={view === "active" ? "Assigned to" : "Driven by"}
            />
            {view === "active" && driver?.phone_number && (
              <a
                href={telHref(driver.phone_number)}
                className="btn-secondary h-10 shrink-0 px-4 py-0"
                aria-label={`Call ${driver.full_name}`}
              >
                <Phone size={15} />
                <span className="hidden sm:inline">Call driver</span>
              </a>
            )}
          </>
        )}
        <RowMenu
          label={`${booking.user_name} ${shortId(booking.booking_id)}`}
          onDelete={onDelete}
        />
      </div>
    </li>
  );
}

export default BookingCard;
