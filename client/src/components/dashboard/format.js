const badge =
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap";

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
