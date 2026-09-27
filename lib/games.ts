// Panathinaikos fixtures for 2026–27. All times are Athens local time.
// - Greek Water Polo League (regular season): league schedule issued 3 Sept 2026.
// - LEN Champions League, Group D: draw results issued 21 Sept 2026
//   (listed in CET; Athens is always one hour ahead).

export type Game = {
  id: string
  title: string
  date: string // "YYYY-MM-DD"
  time: string | null // "8:00 PM"
  location: string | null
  home: boolean
  competition: 'league' | 'champions'
}

type Fixture = [round: number, date: string, time: string, opponent: string, home: boolean, pool: string]

const league: Fixture[] = [
  [1, '2026-09-26', '20:00', 'Ilisiakos', true, 'Serafio, Athens'],
  [2, '2026-10-03', '16:30', 'PAOK', false, 'Poseidonio, Thessaloniki'],
  [3, '2026-10-14', '21:30', 'Apollon Smyrnis', true, 'Serafio, Athens'],
  [4, '2026-10-17', '18:30', 'Peristeri', false, 'Peristeri Pool'],
  [5, '2026-10-24', '20:00', 'Chios', true, 'Serafio, Athens'],
  [6, '2026-10-30', '21:30', 'Ydraikos', false, 'Glyfada Pool'],
  [7, '2026-11-07', '18:00', 'Olympiacos', false, 'Piraeus'],
  [8, '2026-11-14', '20:00', 'Palaio Faliro', true, 'Serafio, Athens'],
  [9, '2026-11-21', '18:00', 'Panionios', false, 'Nea Smyrni Pool'],
  [10, '2026-11-28', '20:00', 'Ethnikos Piraeus', true, 'Serafio, Athens'],
  [11, '2026-12-05', '16:00', 'Vouliagmeni', false, 'Vouliagmeni Pool (walk from the apartment!)'],
  [12, '2026-12-12', '15:45', 'Chania', false, 'Heraklion, Crete'],
  [13, '2026-12-20', '20:00', 'Glyfada', true, 'Serafio, Athens'],
  [14, '2026-12-23', '20:30', 'Ilisiakos', false, 'Ilisio, Athens'],
  [15, '2027-01-23', '20:00', 'PAOK', true, 'Serafio, Athens'],
  [16, '2027-01-27', '21:00', 'Apollon Smyrnis', false, 'Serafio, Athens'],
  [17, '2027-01-30', '20:00', 'Peristeri', true, 'Serafio, Athens'],
  [18, '2027-02-06', '17:00', 'Chios', false, 'Chios'],
  [19, '2027-02-13', '20:00', 'Ydraikos', true, 'Serafio, Athens'],
  [20, '2027-03-10', '20:00', 'Olympiacos', true, 'Serafio, Athens'],
  [21, '2027-03-13', '18:00', 'Palaio Faliro', false, 'Palaio Faliro'],
  [22, '2027-03-17', '21:00', 'Panionios', true, 'Serafio, Athens'],
  [23, '2027-03-20', '14:00', 'Ethnikos Piraeus', false, 'Piraeus'],
  [24, '2027-03-27', '20:00', 'Vouliagmeni', true, 'Serafio, Athens'],
  [25, '2027-04-04', '16:00', 'Chania', true, 'Serafio, Athens'],
  [26, '2027-04-10', '15:00', 'Glyfada', false, 'Glyfada Pool'],
]

const champions: Fixture[] = [
  [1, '2026-10-07', '21:30', 'CN Marseille', false, 'Marseille, France'],
  [2, '2026-10-28', '21:30', 'FTC Telekom', true, 'Athens'],
  [3, '2026-11-11', '19:30', 'CSA Steaua', true, 'Athens'],
  [4, '2026-11-17', '21:30', 'CN Marseille', true, 'Athens'],
  [5, '2026-12-01', '21:30', 'FTC Telekom', false, 'Budapest, Hungary'],
  [6, '2026-12-15', '21:30', 'CSA Steaua', false, 'Bucharest, Romania'],
]

function toGame(competition: Game['competition']) {
  return ([round, date, time, opponent, home, pool]: Fixture): Game => {
    const [h, m] = time.split(':').map(Number)
    return {
      id: `${competition}-${round}`,
      title: home ? `Panathinaikos vs ${opponent}` : `${opponent} vs Panathinaikos`,
      date,
      time: `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`,
      location: pool,
      home,
      competition,
    }
  }
}

export const games: Game[] = [...league.map(toGame('league')), ...champions.map(toGame('champions'))].sort(
  (a, b) => a.date.localeCompare(b.date),
)

// Games from today (Athens time) onward
export function upcomingGames(today: string): Game[] {
  return games.filter((g) => g.date >= today)
}
