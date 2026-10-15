const dateFormatter = new Intl.DateTimeFormat("et-EE");

// Today's date as YYYY-MM-DD in the user's local time zone.
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateDaysAgo(date) {
  const mowingDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // Math.round keeps the result correct across daylight-saving changes.
  return Math.round((today.getTime() - mowingDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDaysAgo(date) {
  const daysAgo = calculateDaysAgo(date);

  if (daysAgo === 0) {
    return "Täna";
  }

  if (daysAgo === 1) {
    return "1 päev tagasi";
  }

  return `${daysAgo} päeva tagasi`;
}

export function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}
