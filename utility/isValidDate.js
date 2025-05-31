/**
 * Checks if a given date string in "YYYY-MM-DD" format is a valid date.
 *
 * @param {string} dateString The date string to validate (e.g., "2025-05-21").
 * @returns {boolean} True if the date string is valid, false otherwise.
 */
function isValidDate(dateString) {
  // 1. Check if the string matches the YYYY-MM-DD format using a regex.
  //    This filters out obviously incorrect formats early.
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  // 2. Split the string into year, month, and day parts.
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // Month from string (1-indexed)
  const day = parseInt(parts[2], 10);

  // 3. Perform basic range checks for month and day.
  //    This catches obvious errors like month 0 or month 13, day 0 or day > 31.
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // 4. Create a Date object using the parsed components.
  //    Note: The month parameter in the Date constructor is 0-indexed (0 for January, 11 for December).
  const dateObject = new Date(year, month - 1, day);

  // 5. Validate the created Date object:
  //    a. Check if it's an "Invalid Date" (getTime() returns NaN).
  //    b. Crucially, compare the year, month, and day returned by the Date object
  //       with the original parsed components. This detects "rollover" dates.
  return (
    !isNaN(dateObject.getTime()) && // Ensure it's not an "Invalid Date"
    dateObject.getFullYear() === year && // Check if year matches
    dateObject.getMonth() === month - 1 && // Check if month matches (0-indexed)
    dateObject.getDate() === day // Check if day matches
  );
}

module.exports = {
  isValidDate
}
