'use client'

import { useState } from 'react'
import { availableFrom, availableTo, type Booking } from '@/lib/bookings'
import type { Game } from '@/lib/games'
import AvailabilityCalendar from './AvailabilityCalendar'
import ReservationCard from './ReservationCard'

// Listing details, calendar, reservation form and game list on the left; a sticky
// "check availability" card on the right. Dates picked in the calendar fill in the form (and vice versa).
export default function BookingSection({
  children,
  bookings,
  games,
  today,
}: {
  children: React.ReactNode
  bookings: Booking[]
  games: Game[]
  today: string
}) {
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)

  const setDates = (inDate: string | null, outDate: string | null) => {
    setCheckIn(inDate)
    setCheckOut(outDate)
  }

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        {children}
        {/* Calendar, then the reservation form, then the game list */}
        <div className="border-t border-border">
          <AvailabilityCalendar
            bookings={bookings}
            games={games}
            today={today}
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={setDates}
            reservation={<ReservationCard checkIn={checkIn} checkOut={checkOut} onDatesChange={setDates} />}
          />
        </div>
      </div>
      <aside className="hidden md:block">
        <div className="sticky top-24">
          <ReserveTeaser />
        </div>
      </aside>
    </div>
  )
}

function ReserveTeaser() {
  const fmt = (iso: string) =>
    new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
      <p className="text-lg font-semibold">Come visit!</p>
      <p className="mt-1 text-sm text-muted">Open {fmt(availableFrom)} – {fmt(availableTo)}. Pick your dates and see when Dylan has games.</p>
      <a
        href="#availability"
        className="mt-4 block rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] py-3 text-center font-semibold text-white hover:opacity-90"
      >
        Check availability
      </a>
    </div>
  )
}
