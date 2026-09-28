'use client'

import { useState, useTransition } from 'react'
import { sendReservation } from '@/app/actions'
import { availableFrom, availableTo } from '@/lib/bookings'

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function ReservationCard({
  checkIn,
  checkOut,
  onDatesChange,
}: {
  checkIn: string | null
  checkOut: string | null
  onDatesChange: (checkIn: string | null, checkOut: string | null) => void
}) {
  const [names, setNames] = useState('')
  const [food, setFood] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sending, startSending] = useTransition()

  function confirm() {
    if (!checkIn || !checkOut) return
    setSendError(null)
    startSending(async () => {
      const result = await sendReservation({ names, checkIn, checkOut, food })
      if (result.ok) {
        setConfirming(false)
        setDone(true)
      } else {
        setSendError(result.error)
      }
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!names.trim()) return setError('Tell us who is coming.')
    if (!checkIn || !checkOut) return setError('Pick your check-in and check-out dates.')
    if (checkOut <= checkIn) return setError('Check-out has to be after check-in.')
    if (checkIn < availableFrom || checkOut > availableTo)
      return setError(`The apartment is only open ${fmt(availableFrom)} – ${fmt(availableTo)}.`)
    setError(null)
    setConfirming(true)
  }

  if (done) {
    return (
      <Card>
        <p className="text-4xl">🎉</p>
        <h2 className="mt-3 text-2xl font-semibold">Success!</h2>
        <p className="mt-3 leading-relaxed">We look forward to your stay.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Note the host takes compensation in the form of Japanese BBQ Sauce, Trader Joe&apos;s Almond Biscotti, and
          pictures from home of friends and family!
        </p>
      </Card>
    )
  }

  const nights = checkIn && checkOut ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000) : 0

  return (
    <Card>
      <form onSubmit={submit} noValidate>
        <div className="overflow-hidden rounded-xl border border-[#b0b0b0]">
          <Field label="Name(s)">
            <input
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Who's coming?"
              className="w-full bg-transparent outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 border-t border-[#b0b0b0]">
            <Field label="Check-in">
              <input
                type="date"
                value={checkIn ?? ''}
                min={availableFrom}
                max={availableTo}
                onChange={(e) => onDatesChange(e.target.value || null, checkOut)}
                className="w-full bg-transparent outline-none"
              />
            </Field>
            <Field label="Check-out" className="border-l border-[#b0b0b0]">
              <input
                type="date"
                value={checkOut ?? ''}
                min={checkIn ?? availableFrom}
                max={availableTo}
                onChange={(e) => onDatesChange(checkIn, e.target.value || null)}
                className="w-full bg-transparent outline-none"
              />
            </Field>
          </div>
          <Field label="Favorite Greek food" className="border-t border-[#b0b0b0]">
            <input
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="Spanakopita? Gyros? Loukoumades?"
              className="w-full bg-transparent outline-none"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-sm text-[#c13515]">{error}</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] py-3 font-semibold text-white hover:opacity-90"
        >
          Make Reservation
        </button>
        <p className="mt-3 text-center text-xs text-muted">You won&apos;t be charged (in euros)</p>
      </form>

      {confirming && checkIn && checkOut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={() => !sending && setConfirming(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 id="confirm-title" className="text-xl font-semibold">
              Confirm your reservation
            </h2>
            <p className="mt-1 text-sm text-muted">Please check that your names and dates are correct.</p>
            <dl className="mt-5 divide-y divide-border rounded-xl border border-border text-sm">
              <Row label="Name(s)" value={names.trim()} />
              <Row label="Check-in" value={fmt(checkIn)} />
              <Row label="Check-out" value={fmt(checkOut)} />
              <Row label="Stay" value={`${nights} night${nights === 1 ? '' : 's'}`} />
            </dl>
            {sendError && <p className="mt-4 text-sm text-[#c13515]">{sendError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={sending}
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-lg border border-[#222] py-3 font-semibold hover:bg-[#f7f7f7] disabled:opacity-60"
              >
                Go back
              </button>
              <button
                type="button"
                autoFocus
                disabled={sending}
                onClick={confirm}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">{children}</div>
  )
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block px-3 py-2 text-sm ${className}`}>
      <span className="block text-[10px] font-bold uppercase tracking-wide">{label}</span>
      {children}
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
