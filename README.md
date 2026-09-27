# AirBnMe

A fake Airbnb listing for my apartment in Vouliagmeni, Greece, so friends can plan visits.

- **Listing content** (title, summary, amenities, photos, review, location): [`lib/listing.ts`](lib/listing.ts).
  Photos live in `public/photos/`; the first one in the list is the big hero photo.
- **Booked dates** (apartment unavailable): [`lib/bookings.ts`](lib/bookings.ts).
- **Water polo games** come from a Google Calendar. Set these env vars (in `.env.local` locally, and in Vercel):
  - `GAMES_ICAL_URL`: the calendar's *Secret address in iCal format*
    (Google Calendar → Settings → the calendar → Integrate calendar). Keep it secret.
  - `GAMES_TIMEZONE` (optional, default `America/Los_Angeles`): timezone to show game times in.
  The page re-fetches the calendar at most once an hour.
- **Flights**: Google Flights has no embeddable widget, so the flight card builds a search
  and opens it on Google Flights. Dates picked in the availability calendar pre-fill it.

```bash
npm install && npm run dev
```
