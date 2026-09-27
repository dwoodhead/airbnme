// When the apartment can be booked at all (inclusive, ISO dates "YYYY-MM-DD").
export const availableFrom = '2026-10-04'
export const availableTo = '2026-12-17'

// Dates within that window that are already taken (friends booked, I'm away, etc).
export type Booking = { start: string; end: string; note?: string }

export const bookings: Booking[] = []
