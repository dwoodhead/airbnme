# AirBnMe

A fake Airbnb listing for my apartment in Vouliagmeni, Greece, so friends can plan visits.

- **Listing content** (title, summary, amenities, photos, review, location): [`lib/listing.ts`](lib/listing.ts).
  Photos live in `public/photos/`; the first one in the list is the big hero photo.
- **Availability**: the bookable window (`availableFrom`/`availableTo`) and already-booked dates live in [`lib/bookings.ts`](lib/bookings.ts).
- **Water polo games** (Panathinaikos 2026–27: Greek league + Champions League): [`lib/games.ts`](lib/games.ts).
  Past games drop off automatically.
- **Reservations** are saved as rows in a Google Sheet by the `sendReservation` server action in
  [`app/actions.ts`](app/actions.ts), via the Apps Script in [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
  Set `BOOKING_SHEET_URL` (the Apps Script web app URL) in `.env.local` and on Vercel. Never commit it.

```bash
npm install && npm run dev
```
