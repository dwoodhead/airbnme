'use client'

import { useState } from 'react'
import { availableFrom, availableTo, away, type Booking } from '@/lib/bookings'
import type { Game } from '@/lib/games'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Date helpers on "YYYY-MM-DD" strings (UTC math avoids timezone drift)
const toIso = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return toIso(d)
}
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...opts })

export default function AvailabilityCalendar({
  bookings,
  games,
  today,
  checkIn,
  checkOut,
  onChange,
}: {
  bookings: Booking[]
  games: Game[]
  today: string
  checkIn: string | null
  checkOut: string | null
  onChange: (checkIn: string | null, checkOut: string | null) => void
}) {
  const [monthOffset, setMonthOffset] = useState(0)

  const isBooked = (iso: string) =>
    iso < availableFrom || iso > availableTo || bookings.some((b) => iso >= b.start && iso <= b.end)
  const isAway = (iso: string) => away.some((b) => iso >= b.start && iso <= b.end)
  const gamesOn = (iso: string) => games.filter((g) => g.date === iso)

  function pick(iso: string) {
    if (iso < today || isBooked(iso)) return
    if (!checkIn || checkOut || iso <= checkIn) return onChange(iso, null)
    // Don't allow a stay that spans a booked night
    for (let d = checkIn; d < iso; d = addDays(d, 1)) if (isBooked(d)) return onChange(iso, null)
    onChange(checkIn, iso)
  }

  // Open on the first month that can actually be booked
  const [ty, tm] = (today > availableFrom ? today : availableFrom).split('-').map(Number)
  const months = [0, 1].map((i) => new Date(Date.UTC(ty, tm - 1 + monthOffset + i, 1)))

  const nights =
    checkIn && checkOut
      ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
      : 0

  return (
    <section id="availability" className="border-t border-border py-10">
      <h2 className="text-2xl font-semibold">
        {nights ? `${nights} night${nights > 1 ? 's' : ''} in Vouliagmeni` : 'Availability'}
      </h2>
      <p className="mt-1 text-muted">
        {checkIn && checkOut
          ? `${fmt(checkIn, { month: 'short', day: 'numeric', year: 'numeric' })} – ${fmt(checkOut, { month: 'short', day: 'numeric', year: 'numeric' })}`
          : checkIn
            ? 'Now pick your check-out date'
            : 'Pick your check-in date'}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <NavButton label="Previous month" disabled={monthOffset === 0} onClick={() => setMonthOffset(monthOffset - 1)}>
          ‹
        </NavButton>
        <NavButton label="Next month" onClick={() => setMonthOffset(monthOffset + 1)}>
          ›
        </NavButton>
      </div>

      <div className="-mt-8 grid gap-8 sm:grid-cols-2">
        {months.map((m, i) => (
          <Month
            key={toIso(m)}
            first={m}
            className={i === 1 ? 'hidden sm:block' : ''}
            render={(iso) => {
              const past = iso < today
              const booked = isBooked(iso)
              const dayGames = gamesOn(iso)
              const isEnd = iso === checkIn || iso === checkOut
              const dylanAway = isAway(iso)
              const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut
              // Away days join into one band per week row, rounded where the run starts/ends
              const weekday = new Date(iso + 'T00:00:00Z').getUTCDay()
              const prev = addDays(iso, -1)
              const next = addDays(iso, 1)
              const capStart = weekday === 0 || !isAway(prev) || prev.slice(0, 7) !== iso.slice(0, 7)
              const capEnd = weekday === 6 || !isAway(next) || next.slice(0, 7) !== iso.slice(0, 7)
              const band = dylanAway
                ? `bg-[#fde2e2] ${capStart ? 'rounded-l-full' : ''} ${capEnd ? 'rounded-r-full' : ''}`
                : ''
              return (
                <div className={`flex h-11 items-center ${band}`}>
                  <button
                    type="button"
                    onClick={() => pick(iso)}
                    disabled={past || booked}
                    title={
                      [dylanAway && 'Dylan is away', ...dayGames.map((g) => `🤽 ${g.title}${g.time ? ' · ' + g.time : ''}`)]
                        .filter(Boolean)
                        .join('\n') || undefined
                    }
                    className={[
                      'relative mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full text-sm',
                      past || booked ? 'cursor-default text-[#b0b0b0]' : 'font-medium hover:ring-1 hover:ring-black',
                      booked && !past ? 'line-through' : '',
                      isEnd ? 'bg-[#222] text-white hover:ring-0' : '',
                      inRange ? 'bg-[#f0f0f0]' : '',
                    ].join(' ')}
                  >
                    {Number(iso.slice(8))}
                    {dayGames.length > 0 && (
                      <span className="absolute -bottom-0.5 text-[11px] leading-none" aria-label="water polo game">
                        🤽
                      </span>
                    )}
                  </button>
                </div>
              )
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <span><span className="line-through">12</span> Unavailable</span>
        <span>Open {fmt(availableFrom, { month: 'short', day: 'numeric' })} – {fmt(availableTo, { month: 'short', day: 'numeric' })}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-6 rounded-full bg-[#fde2e2]" /> Dylan is away
        </span>
        <span>🤽 Dylan has a game</span>
        {checkIn && (
          <button type="button" onClick={() => onChange(null, null)} className="font-semibold text-black underline">
            Clear dates
          </button>
        )}
      </div>

      <GameList games={games} checkIn={checkIn} checkOut={checkOut} />
    </section>
  )
}

function Month({
  first,
  className,
  render,
}: {
  first: Date
  className?: string
  render: (iso: string) => React.ReactNode
}) {
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
  const cells: (string | null)[] = Array(first.getUTCDay()).fill(null)
  for (let d = 0; d < daysInMonth; d++) cells.push(addDays(toIso(first), d))

  return (
    <div className={className}>
      <h3 className="mb-4 text-center font-semibold">
        {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
      </h3>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-2 text-xs font-semibold text-muted">{w}</div>
        ))}
        {cells.map((iso, i) => (
          <div key={iso ?? `blank-${i}`}>{iso && render(iso)}</div>
        ))}
      </div>
    </div>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xl hover:bg-[#f0f0f0] disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}

function GameList({
  games,
  checkIn,
  checkOut,
}: {
  games: Game[]
  checkIn: string | null
  checkOut: string | null
}) {
  const [showAll, setShowAll] = useState(false)
  const during = (g: Game) => checkIn && checkOut && g.date >= checkIn && g.date <= checkOut
  // By default, only games up to the end of the bookable window
  const shown = showAll ? games : games.filter((g) => g.date <= availableTo)

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold">🤽 Upcoming Panathinaikos games</h3>
      <p className="mb-4 text-sm text-muted">Greek League and Champions League. Come cheer. Heckling is permitted.</p>
      {games.length === 0 ? (
        <p className="text-sm text-muted">No games scheduled. Must be the off-season.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {shown.map((g) => (
            <li key={g.id} className={`flex gap-4 px-4 py-3 ${during(g) ? 'bg-[#fff8f6]' : ''}`}>
              <div className="w-14 shrink-0 text-center">
                <div className="text-xs font-semibold uppercase text-[#e61e4d]">{fmt(g.date, { month: 'short' })}</div>
                <div className="text-xl font-semibold leading-tight">{Number(g.date.slice(8))}</div>
              </div>
              <div className="min-w-0">
                <p className="font-medium">
                  {g.title}
                  <span className="ml-2 rounded bg-[#f0f0f0] px-1.5 py-0.5 text-[11px] font-semibold text-muted">
                    {g.home ? 'HOME' : 'AWAY'}
                  </span>
                  {g.competition === 'champions' && (
                    <span className="ml-1.5 rounded bg-[#e8eefc] px-1.5 py-0.5 text-[11px] font-semibold text-[#1d4ed8]">
                      ⭐ CHAMPIONS LEAGUE
                    </span>
                  )}
                  {during(g) && <span className="ml-2 text-xs font-semibold text-[#e61e4d]">During your stay!</span>}
                </p>
                <p className="truncate text-sm text-muted">
                  {fmt(g.date, { weekday: 'long' })}
                  {g.time && ` · ${g.time}`}
                  {g.location && ` · ${g.location}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!showAll && shown.length < games.length && (
        <button type="button" onClick={() => setShowAll(true)} className="mt-4 text-sm font-semibold underline">
          Show the rest of the season ({games.length - shown.length} more)
        </button>
      )}
    </div>
  )
}
