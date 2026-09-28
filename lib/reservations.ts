// Reservations friends have made, read back from the Google Sheet (see google-apps-script/Code.gs).

export type ReservationDates = { names: string; checkIn: string; checkOut: string }

const isoDate = /^\d{4}-\d{2}-\d{2}$/

export async function getReservations(): Promise<ReservationDates[]> {
  const url = process.env.BOOKING_SHEET_URL
  if (!url) return []
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const body = await res.json()
    if (!body?.ok || !Array.isArray(body.reservations)) return []
    return body.reservations
      .filter((r: ReservationDates) => isoDate.test(r.checkIn) && isoDate.test(r.checkOut))
      .map((r: ReservationDates) => ({ names: String(r.names), checkIn: r.checkIn, checkOut: r.checkOut }))
  } catch (err) {
    console.error('Loading reservations failed', err)
    return []
  }
}
