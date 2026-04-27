/**
 * Formats an ISO date string into a human-readable format:
 * "12 Mar 2026 14:38"
 */
export const formatMessageDate = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Check if the date is valid (prevents "Invalid Date" appearing in UI)
  if (isNaN(date.getTime())) {
    return "";
  }

  // We use Intl.DateTimeFormat for clean, localized formatting
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Uses 24-hour format (14:30 instead of 2:30 PM)
  });

  // The formatter produces: "26 Apr 2026, 14:30"
  // We replace the comma to match your exact requested format
  return formatter.format(date).replace(",", "");
};
