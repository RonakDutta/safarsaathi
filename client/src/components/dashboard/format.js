export const statusMeta = {
  pending: { label: "Needs a driver", className: "text-mute" },
  confirmed: { label: "Driver assigned", className: "text-amber" },
  completed: { label: "Completed", className: "text-ok" },
};

export const getStatus = (status) =>
  statusMeta[status] || { label: status, className: "text-mute" };

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
