/**
 * Formats an ISO date string into a human-readable format:
 * "12 Mar 2026 14:38"
 */
export const formatMessageDate = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date).replace(",", "");
};
