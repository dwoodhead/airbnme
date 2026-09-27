'use client'

import { useState } from 'react'

// Google Flights has no embeddable widget, so this builds a search and opens it on Google Flights.
export default function FlightSearch({
  airport,
  defaultOrigin,
  checkIn,
  checkOut,
}: {
  airport: string
  defaultOrigin: string
  checkIn: string | null
  checkOut: string | null
}) {
  const [origin, setOrigin] = useState(defaultOrigin)
  const [depart, setDepart] = useState('')
  const [ret, setRet] = useState('')
  const [travelers, setTravelers] = useState(1)

  // Calendar selection wins until the user edits the date fields directly
  const [lastSync, setLastSync] = useState<string>('')
  const sync = `${checkIn}|${checkOut}`
  if (sync !== lastSync) {
    setLastSync(sync)
    if (checkIn) setDepart(checkIn)
    if (checkOut) setRet(checkOut)
  }

  let q = `Flights from ${origin.trim() || defaultOrigin} to ${airport}`
  if (depart) q += ` on ${depart}`
  if (depart && ret) q += ` through ${ret}`
  if (!ret) q += ' one way'
  q += ` for ${travelers} adult${travelers > 1 ? 's' : ''}`
  const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
      <p className="text-xl">
        <span className="font-semibold">€0</span> <span className="text-muted">night</span>
      </p>
      <p className="mb-5 text-sm text-muted">Payable in souvlaki and good company</p>

      <div className="overflow-hidden rounded-xl border border-[#b0b0b0]">
        <div className="grid grid-cols-2">
          <Field label="From">
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              placeholder="SFO"
              className="w-full bg-transparent outline-none"
            />
          </Field>
          <Field label="To" className="border-l border-[#b0b0b0]">
            <span>{airport} · Athens</span>
          </Field>
        </div>
        <div className="grid grid-cols-2 border-t border-[#b0b0b0]">
          <Field label="Depart">
            <input
              type="date"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </Field>
          <Field label="Return" className="border-l border-[#b0b0b0]">
            <input
              type="date"
              value={ret}
              min={depart || undefined}
              onChange={(e) => setRet(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </Field>
        </div>
        <Field label="Travelers" className="border-t border-[#b0b0b0]">
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-transparent outline-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} traveler{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] py-3 text-center font-semibold text-white hover:opacity-90"
      >
        Search flights on Google Flights
      </a>
      <p className="mt-3 text-center text-xs text-muted">
        Tip: pick dates in the calendar to fill these in
      </p>
    </div>
  )
}

function Field({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block px-3 py-2 text-sm ${className}`}>
      <span className="block text-[10px] font-bold uppercase tracking-wide">{label}</span>
      {children}
    </label>
  )
}
