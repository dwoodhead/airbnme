// Everything about the listing lives here. Edit freely.

export const listing = {
  title: 'Seaside apartment in Vouliagmeni, hosted by Dylan',
  subtitle: 'Entire apartment · Vouliagmeni, Attica, Greece',
  guests: 4,
  bedrooms: 2,
  beds: 2,
  baths: 1,
  summary: [
    "Welcome to my place on the Athens Riviera! Vouliagmeni is a quiet seaside town about 30 minutes from central Athens, with crystal-clear water, the famous thermal lake, and more beach bars than any one person needs.",
    "The apartment is bright and breezy, a short walk from the sea. Spend your days swimming, eating grilled octopus, and napping. Spend your evenings watching the sunset over the Saronic Gulf. If you time it right, come watch me play water polo.",
  ],
  amenities: [
    '🌊 Walk to the beach',
    '📶 Fast wifi',
    '❄️ Air conditioning',
    '🍳 Full kitchen',
    '🧺 Washing machine',
    '🌅 Sunset views',
    '🚌 Bus to Athens',
    '🤽 Free water polo lessons (quality not guaranteed)',
  ],
  // Swap these for real photos: drop files in /public/photos and use '/photos/xyz.jpg'.
  photos: [
    { src: 'https://picsum.photos/seed/airbnme-1/1200/800', alt: 'Living room' },
    { src: 'https://picsum.photos/seed/airbnme-2/600/400', alt: 'Bedroom' },
    { src: 'https://picsum.photos/seed/airbnme-3/600/400', alt: 'Kitchen' },
    { src: 'https://picsum.photos/seed/airbnme-4/600/400', alt: 'Balcony' },
    { src: 'https://picsum.photos/seed/airbnme-5/600/400', alt: 'The beach nearby' },
  ],
  hostReview: {
    author: 'Dylan (the host)',
    stars: 5,
    date: 'Every day',
    text: "Honestly the best apartment I've ever stayed in. The host is incredibly handsome, charming, and a very talented water polo player. Would book again. Completely unbiased review.",
  },
  location: {
    name: 'Vouliagmeni, Greece',
    blurb: "On the Athens Riviera, ~30 min from central Athens and ~35 min from Athens International Airport (ATH). Exact address shared after booking.",
    mapQuery: 'Vouliagmeni, Greece',
    airport: 'ATH',
  },
  defaultOrigin: 'SFO',
}
