'use server'

import { availableFrom, availableTo } from '@/lib/bookings'

export type Reservation = {
  names: string
  checkIn: string
  checkOut: string
  food: string
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/

// Adds the reservation as a row in the host's Google Sheet, through the Apps Script web app
// in google-apps-script/Code.gs. Env: BOOKING_SHEET_URL (the web app URL).
export async function sendReservation(r: Reservation): Promise<{ ok: true } | { ok: false; error: string }> {
  const names = String(r.names ?? '').trim().slice(0, 200)
  const food = String(r.food ?? '').trim().slice(0, 200)
  const { checkIn, checkOut } = r
  if (
    !names ||
    !isoDate.test(checkIn) ||
    !isoDate.test(checkOut) ||
    checkOut <= checkIn ||
    checkIn < availableFrom ||
    checkOut > availableTo
  ) {
    return { ok: false, error: 'Something about that reservation looks off. Please check the form.' }
  }

  const url = process.env.BOOKING_SHEET_URL
  if (!url) {
    console.error('Reservations not configured: set BOOKING_SHEET_URL')
    return { ok: false, error: "Reservations aren't hooked up yet. Text Dylan instead!" }
  }

  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ names, checkIn, checkOut, nights, food }),
    })
    const body = await res.json().catch(() => null)
    if (!res.ok || !body?.ok) throw new Error(`Sheet responded ${res.status}`)
  } catch (err) {
    console.error('Saving reservation failed', err)
    return { ok: false, error: "We couldn't save your reservation. Please try again, or text Dylan." }
  }
  return { ok: true }
}
