# AirBnMe

A fake Airbnb listing for my apartment in Vouliagmeni, Greece, so friends can plan visits.

- **Listing content** (title, summary, amenities, photos, review, location): [`lib/listing.ts`](lib/listing.ts).
  Photos live in `public/photos/`; the first one in the list is the big hero photo.
- **Availability**: the bookable window (`availableFrom`/`availableTo`) and already-booked dates live in [`lib/bookings.ts`](lib/bookings.ts).
- **Water polo games** (Panathinaikos 2026–27: Greek league + Champions League): [`lib/games.ts`](lib/games.ts).
  Past games drop off automatically.
- **Reservations** are emailed to the host with [Resend](https://resend.com) by the `sendReservation`
  server action in [`app/actions.ts`](app/actions.ts). Env vars (in `.env.local` and on Vercel, never committed):
  - `RESEND_API_KEY`: from resend.com → API Keys.
  - `BOOKING_EMAIL_TO`: where reservation emails go. Without a verified domain, Resend only
    delivers to the address you signed up with.
  - `BOOKING_EMAIL_FROM` (optional): defaults to `AirBnMe <onboarding@resend.dev>`.

```bash
npm install && npm run dev
```
