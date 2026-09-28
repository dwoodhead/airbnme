import BookingSection from '@/components/BookingSection'
import { bookings } from '@/lib/bookings'
import { upcomingGames } from '@/lib/games'
import { listing } from '@/lib/listing'

// Rebuild hourly so past games drop off
export const revalidate = 3600

export default function Home() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' })
  const games = upcomingGames(today)
  const [hero, ...rest] = listing.photos
  const review = listing.hostReview

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-1.5 text-brand">
            <Logo />
            <span className="text-2xl font-bold tracking-tight">airbnme</span>
          </a>
          <nav className="hidden gap-6 text-sm font-medium sm:flex">
            <a href="#availability" className="hover:underline">Availability</a>
            <a href="#location" className="hover:underline">Location</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="pt-6 text-2xl font-semibold sm:text-[26px]">{listing.title}</h1>
        <p className="mt-1 text-sm">
          ★ 5.0 · <span className="underline">1 review</span> · <span className="underline">{listing.location.name}</span>
        </p>

        {/* Photos */}
        <div className="mt-6 grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[420px]">
          <img src={hero.src} alt={hero.alt} className="col-span-4 row-span-2 h-full w-full object-cover sm:col-span-2" />
          {rest.map((p) => (
            <img key={p.src} src={p.src} alt={p.alt} className="hidden h-full w-full object-cover sm:block" />
          ))}
        </div>

        <div className="mt-10">
          <BookingSection
            bookings={bookings}
            games={games}
            today={today}
          >
            {/* Overview */}
            <section className="pb-8">
              <h2 className="text-[22px] font-semibold">{listing.subtitle}</h2>
              <p className="mt-1">
                {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.baths} bath
              </p>
            </section>

            <section className="flex items-center gap-4 border-t border-border py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#222] text-lg font-semibold text-white">
                D
              </div>
              <div>
                <p className="font-semibold">Hosted by Dylan</p>
                <p className="text-sm text-muted">Superhost · Water polo player · Friend of yours (hopefully)</p>
              </div>
            </section>

            {/* Summary */}
            <section className="space-y-4 border-t border-border py-8 leading-relaxed">
              {listing.summary.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            {/* Amenities */}
            <section className="border-t border-border py-8">
              <h2 className="mb-4 text-[22px] font-semibold">What this place offers</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {listing.amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>

            {/* Review */}
            <section className="border-t border-border py-8">
              <h2 className="text-[22px] font-semibold">★ 5.0 · 1 review</h2>
              <div className="mt-6 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">D</div>
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-muted">Verified host · also the guest</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  <span aria-label={`${review.stars} stars`}>{'★'.repeat(review.stars)}</span> · {review.date}
                </p>
                <p className="mt-2 leading-relaxed">{review.text}</p>
              </div>
            </section>
          </BookingSection>
        </div>

        {/* Location */}
        <section id="location" className="scroll-mt-24 border-t border-border py-10">
          <h2 className="text-[22px] font-semibold">Where you&apos;ll be</h2>
          <p className="mt-1">{listing.location.name}</p>
          <iframe
            title="Map of Vouliagmeni"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location.mapQuery)}&z=13&output=embed`}
            className="mt-6 h-[400px] w-full rounded-xl border-0"
            loading="lazy"
          />
          <p className="mt-4 max-w-2xl text-muted">{listing.location.blurb}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2.5 text-sm font-semibold hover:bg-[#f7f7f7]"
          >
            📍 Open Vouliagmeni in Google Maps
          </a>
        </section>
      </main>

      <footer className="border-t border-border bg-[#f7f7f7] py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} AirBnMe · Not affiliated with Airbnb · No actual money changes hands
      </footer>
    </>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden>
      <path d="M16 1c2 0 3.5 1.2 4.6 3.4l.3.6 7.8 15.9c1.9 4-.4 8.1-4.6 8.1-2.2 0-4.2-1.2-6.4-3.6l-1.7-1.9-1.7 1.9c-2.2 2.4-4.2 3.6-6.4 3.6-4.2 0-6.5-4.1-4.6-8.1L11 5l.3-.6C12.5 2.2 14 1 16 1zm0 20.2c-1.6-2-2.6-3.8-2.6-5.2 0-1.5 1.1-2.4 2.6-2.4s2.6.9 2.6 2.4c0 1.4-1 3.2-2.6 5.2z" />
    </svg>
  )
}
