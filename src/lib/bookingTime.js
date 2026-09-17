/**
 * Booking timing and notice rules:
 * 1. Minimum 3 hours notice for standard online reservations.
 * 2. Night constraint: No bookings before 08:00 AM for night/early morning departures.
 * 3. Prevention of past date/time selections.
 */

export function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTimeHHMM(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Returns the earliest valid booking Date object from now:
 * - Current time + 3 hours
 * - Rounded up to the nearest 15 minutes
 * - If landing between 00:00 and 07:59, pushed to 08:00 AM
 */
export function getEarliestBookingDateTime() {
  const now = new Date();
  
  // Base: now + 3 hours
  const earliest = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  // Round up minutes to the next 15-minute slot
  const rem = earliest.getMinutes() % 15;
  if (rem !== 0) {
    earliest.setMinutes(earliest.getMinutes() + (15 - rem));
  }
  earliest.setSeconds(0, 0);

  const hours = earliest.getHours();
  // "et la nuit pas avant 8h du matin"
  if (hours >= 0 && hours < 8) {
    earliest.setHours(8, 0, 0, 0);
  }

  return earliest;
}

/**
 * Validates a chosen date (YYYY-MM-DD) and time (HH:MM).
 * Returns { isValid: boolean, errorKey?: string, isTooSoon?: boolean }
 */
export function validateBookingDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    return { isValid: false, errorKey: 'error_datetime_required', isTooSoon: false };
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
    return { isValid: false, errorKey: 'error_datetime_required', isTooSoon: false };
  }

  const chosen = new Date(year, month - 1, day, hour, minute, 0, 0);
  const now = new Date();

  // 1. Must be in the future
  if (chosen.getTime() <= now.getTime()) {
    return { isValid: false, errorKey: 'error_past_datetime', isTooSoon: true };
  }

  // 2. Minimum 3 hours notice
  const minNoticeTime = new Date(now.getTime() + 3 * 60 * 60 * 1000 - 60000); // 1 min tolerance for clock drift
  if (chosen.getTime() < minNoticeTime.getTime()) {
    return { isValid: false, errorKey: 'error_min_notice_3h', isTooSoon: true };
  }

  // 3. Night constraint: "la nuit pas avant 8h du matin"
  // For any departures between 00:00 and 07:59 within 14 hours from now
  const diffHours = (chosen.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hour >= 0 && hour < 8 && diffHours < 14) {
    return { isValid: false, errorKey: 'error_night_before_8am', isTooSoon: true };
  }

  return { isValid: true };
}
