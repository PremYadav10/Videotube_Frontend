export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds); // drop decimals
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const formattedH = h > 0 ? `${h}:` : "";
  const formattedM = h > 0 ? String(m).padStart(2, "0") : String(m);
  const formattedS = String(s).padStart(2, "0");

  return `${formattedH}${formattedM}:${formattedS}`;
};


export const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 }, // 365 * 24 * 60 * 60
    { label: "month", seconds: 2592000 }, // 30 * 24 * 60 * 60
    { label: "week", seconds: 604800 },   // 7 * 24 * 60 * 60
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};


export default function convertIsoToSimpleDate(isoString) {
  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  // Return the formatted string
  return `${day}/${month}/${year}`;
}