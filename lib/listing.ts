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
    '🤽 Mild chlorine smell',
  ],
  // Photos live in /public/photos. The first one is the big hero photo.
  photos: [
    { src: '/photos/living-room.webp', alt: 'Living room with sea view' },
    { src: '/photos/bedroom.webp', alt: 'Bedroom with balcony' },
    { src: '/photos/lounge.webp', alt: 'Lounge and balcony' },
    { src: '/photos/dining-nook.webp', alt: 'Dining nook' },
    { src: '/photos/hallway.webp', alt: 'Open-plan living and dining' },
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
