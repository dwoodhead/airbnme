'use client'

import { useState } from 'react'
import type { Booking } from '@/lib/bookings'
import type { Game } from '@/lib/games'
import AvailabilityCalendar from './AvailabilityCalendar'
import FlightSearch from './FlightSearch'
import ReservationCard from './ReservationCard'

// Two-column body: listing details + calendar on the left, sticky flight card on the right.
// Dates picked in the calendar pre-fill the flight search.
export default function BookingSection({
  children,
  bookings,
  games,
  today,
  airport,
  defaultOrigin,
}: {
  children: React.ReactNode
  bookings: Booking[]
  games: Game[]
  today: string
  airport: string
  defaultOrigin: string
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
        <div className="space-y-6">
          <ReservationCard
            checkIn={checkIn}
            checkOut={checkOut}
            onDatesChange={(inDate, outDate) => {
              setCheckIn(inDate)
              setCheckOut(outDate)
            }}
          />
          <FlightSearch
            airport={airport}
            defaultOrigin={defaultOrigin}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </div>
      </aside>
    </div>
  )
}
