'use server'

import { availableFrom, availableTo } from '@/lib/bookings'

export type Reservation = {
  names: string
  checkIn: string
  checkOut: string
  food: string
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/

// Emails the host about a new reservation via Resend (https://resend.com).
// Env: RESEND_API_KEY, BOOKING_EMAIL_TO, and optionally BOOKING_EMAIL_FROM.
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

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.BOOKING_EMAIL_TO
  if (!apiKey || !to) {
    console.error('Reservation email not configured: set RESEND_API_KEY and BOOKING_EMAIL_TO')
    return { ok: false, error: "Reservations aren't hooked up yet. Text Dylan instead!" }
  }

  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.BOOKING_EMAIL_FROM || 'AirBnMe <onboarding@resend.dev>',
      to,
      subject: `New AirBnMe reservation: ${names} (${checkIn} → ${checkOut})`,
      text: [
        'New reservation on AirBnMe!',
        '',
        `Name(s): ${names}`,
        `Check-in: ${checkIn}`,
        `Check-out: ${checkOut}`,
        `Nights: ${nights}`,
        `Favorite Greek food: ${food || '(not given)'}`,
      ].join('\n'),
    }),
  })

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text())
    return { ok: false, error: "We couldn't send your reservation. Please try again, or text Dylan." }
  }
  return { ok: true }
}
