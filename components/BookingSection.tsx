'use client'

import { useState } from 'react'
import type { Booking } from '@/lib/bookings'
import type { Game } from '@/lib/games'
import AvailabilityCalendar from './AvailabilityCalendar'
import ReservationCard from './ReservationCard'

// Two-column body: listing details + calendar on the left, reservation card on the right.
// Dates picked in the calendar fill in the reservation card (and vice versa).
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

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        {children}
        <AvailabilityCalendar
          bookings={bookings}
          games={games}
          today={today}
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(inDate, outDate) => {
            setCheckIn(inDate)
            setCheckOut(outDate)
          }}
        />
      </div>
      <aside>
        <div className="md:sticky md:top-24">
          <ReservationCard
            checkIn={checkIn}
            checkOut={checkOut}
            onDatesChange={(inDate, outDate) => {
              setCheckIn(inDate)
              setCheckOut(outDate)
            }}
          />
        </div>
      </aside>
    </div>
  )
}
