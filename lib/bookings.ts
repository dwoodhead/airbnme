// Dates the apartment is NOT available (friends already booked, I'm away, etc).
// Inclusive ranges, ISO dates "YYYY-MM-DD".
export type Booking = { start: string; end: string; note?: string }

export const bookings: Booking[] = [
  { start: '2026-10-09', end: '2026-10-12', note: 'Booked' },
  { start: '2026-11-20', end: '2026-11-29', note: 'Booked' },
]
