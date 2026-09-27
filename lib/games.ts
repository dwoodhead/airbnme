// Water polo games, pulled from a Google Calendar via its iCal address.
// Set GAMES_ICAL_URL to the calendar's "Secret address in iCal format"
// (Google Calendar → Settings → your calendar → Integrate calendar).

export type Game = {
  id: string
  title: string
  date: string // "YYYY-MM-DD"
  time: string | null // "6:30 PM", or null for all-day events
  location: string | null
}

const TIMEZONE = process.env.GAMES_TIMEZONE || 'America/Los_Angeles'

export async function getGames(): Promise<{ games: Game[]; configured: boolean }> {
  const url = process.env.GAMES_ICAL_URL
  if (!url) return { games: [], configured: false }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`iCal fetch failed: ${res.status}`)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE })
    const games = parseIcs(await res.text())
      .filter((g) => g.date >= today)
      .sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')))
    return { games, configured: true }
  } catch (err) {
    console.error(err)
    return { games: [], configured: true }
  }
}

function parseIcs(text: string): Game[] {
  // Unfold continuation lines (RFC 5545: lines starting with space/tab continue the previous one)
  const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/)
  const games: Game[] = []
  let ev: Record<string, { params: string; value: string }> | null = null

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') ev = {}
    else if (line === 'END:VEVENT' && ev) {
      const start = ev.DTSTART && parseDate(ev.DTSTART.params, ev.DTSTART.value)
      if (start && ev.STATUS?.value !== 'CANCELLED') {
        games.push({
          id: (ev.UID?.value ?? '') + start.date,
          title: unescape(ev.SUMMARY?.value ?? 'Water polo game'),
          date: start.date,
          time: start.time,
          location: ev.LOCATION ? unescape(ev.LOCATION.value) : null,
        })
      }
      ev = null
    } else if (ev) {
      const m = line.match(/^([A-Z-]+)((?:;[^:]*)?):(.*)$/)
      if (m) ev[m[1]] = { params: m[2], value: m[3] }
    }
  }
  return games
}

function parseDate(params: string, value: string): { date: string; time: string | null } | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/)
  if (!m) return null
  const [, y, mo, d, h, mi, , z] = m
  if (!h || params.includes('VALUE=DATE')) return { date: `${y}-${mo}-${d}`, time: null }

  if (z) {
    // UTC time: convert to the display timezone
    const dt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi))
    return {
      date: dt.toLocaleDateString('en-CA', { timeZone: TIMEZONE }),
      time: dt.toLocaleTimeString('en-US', { timeZone: TIMEZONE, hour: 'numeric', minute: '2-digit' }),
    }
  }
  // Floating or TZID time: show as written
  const hour = +h % 12 || 12
  return { date: `${y}-${mo}-${d}`, time: `${hour}:${mi} ${+h < 12 ? 'AM' : 'PM'}` }
}

function unescape(s: string): string {
  return s.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1')
}
