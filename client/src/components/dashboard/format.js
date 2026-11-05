const badge =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap";

export const statusMeta = {
  pending: {
    label: "Needs a driver",
    className: `${badge} bg-white/5 text-fog`,
  },
  confirmed: {
    label: "Driver assigned",
    className: `${badge} bg-amber/10 text-amber`,
  },
  completed: { label: "Completed", className: `${badge} bg-ok/10 text-ok` },
};

export const getStatus = (status) =>
  statusMeta[status] || {
    label: status,
    className: `${badge} bg-white/5 text-mute`,
  };

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const mapsUrl = (booking) => {
  const query =
    booking.latitude && booking.longitude
      ? `${booking.latitude},${booking.longitude}`
      : booking.pickup_location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
};

export const hoursLabel = (hours) =>
  `${hours} ${Number(hours) === 1 ? "hr" : "hrs"}`;

// "919876543210" or "9876543210" -> "+91 98765 43210"
export const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 10
        ? digits
        : null;
  if (!local) return value ? String(value) : "";
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
};

export const telHref = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `91${digits}` : digits}`;
};

export const shortId = (id) =>
  `#${String(id || "")
    .slice(0, 8)
    .toUpperCase()}`;
