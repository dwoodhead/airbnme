# AirBnMe

A fake Airbnb listing for my apartment in Vouliagmeni, Greece, so friends can plan visits.

- **Listing content** (title, summary, amenities, photos, review, location): [`lib/listing.ts`](lib/listing.ts).
  Photos live in `public/photos/`; the first one in the list is the big hero photo.
- **Availability**: the bookable window (`availableFrom`/`availableTo`) and already-booked dates live in [`lib/bookings.ts`](lib/bookings.ts).
- **Water polo games** (Panathinaikos, Greek league 2026–27): [`lib/games.ts`](lib/games.ts).
  Past games drop off automatically.
- **Flights**: Google Flights has no embeddable widget, so the flight card builds a search
  and opens it on Google Flights. Dates picked in the availability calendar pre-fill it.

```bash
npm install && npm run dev
```
