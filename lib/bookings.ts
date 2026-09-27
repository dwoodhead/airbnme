// When the apartment can be booked at all (inclusive, ISO dates "YYYY-MM-DD").
export const availableFrom = '2026-10-04'
export const availableTo = '2026-12-17'

// Dates within that window that are already taken (friends booked, I'm away, etc).
export type Booking = { start: string; end: string; note?: string }

export const bookings: Booking[] = []

// Days I'm away (shown in light red). The apartment can still be booked on these days.
export const away: Booking[] = [
  { start: '2026-10-03', end: '2026-10-03' },
  { start: '2026-10-06', end: '2026-10-08' },
  { start: '2026-11-30', end: '2026-12-02' },
  { start: '2026-12-11', end: '2026-12-12' },
  { start: '2026-12-14', end: '2026-12-16' },
]
