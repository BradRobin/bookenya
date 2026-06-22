export type Property = {
  id: string;
  name: string;
  location: string;
  area: string;
  rating: number;
  ratingLabel: string;
  pricePerNight: number;
  currency: "KES" | "USD";
  category: "Hotel" | "Luxury Apartment" | "Safari Lodge" | "Beach Resort";
  guests: number;
  rooms: number;
  images: string[];
  description: string;
  amenities: string[];
};

export const properties: Property[] = [
  {
    id: "nairobi-blue-haven",
    name: "Blue Haven Suites Westlands",
    location: "Westlands, Nairobi",
    area: "Nairobi",
    rating: 8.9,
    ratingLabel: "Excellent",
    pricePerNight: 18500,
    currency: "KES",
    category: "Luxury Apartment",
    guests: 4,
    rooms: 2,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A polished serviced apartment close to business hubs, malls, nightlife, and Nairobi expressway access.",
    amenities: ["Airport transfer", "Fast Wi-Fi", "Pool", "Secure parking"]
  },
  {
    id: "diani-coral-resort",
    name: "Coral Tide Beach Resort",
    location: "Diani Beach, Kwale",
    area: "Diani",
    rating: 9.2,
    ratingLabel: "Superb",
    pricePerNight: 31000,
    currency: "KES",
    category: "Beach Resort",
    guests: 3,
    rooms: 1,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "Oceanfront comfort with white-sand beach access, family-friendly dining, and curated coastal excursions.",
    amenities: ["Beachfront", "Breakfast included", "Spa", "Ocean views"]
  },
  {
    id: "naivasha-lakehouse",
    name: "Lakeview Manor Naivasha",
    location: "Lake Naivasha, Nakuru",
    area: "Naivasha",
    rating: 8.7,
    ratingLabel: "Fabulous",
    pricePerNight: 24200,
    currency: "KES",
    category: "Hotel",
    guests: 5,
    rooms: 2,
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A calm lakeside retreat for weekend escapes, boat rides, and easy access to Hell's Gate National Park.",
    amenities: ["Lake access", "Garden dining", "Family rooms", "Guided tours"]
  },
  {
    id: "maasai-mara-camp",
    name: "Savannah Gold Safari Camp",
    location: "Maasai Mara, Narok",
    area: "Maasai Mara",
    rating: 9.5,
    ratingLabel: "Exceptional",
    pricePerNight: 48000,
    currency: "KES",
    category: "Safari Lodge",
    guests: 2,
    rooms: 1,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A boutique safari camp with guided game drives, sundowners, and an intimate wilderness atmosphere.",
    amenities: ["Game drives", "Full board", "Private deck", "Bush transfers"]
  },
  {
    id: "mombasa-harbor-hotel",
    name: "Harbor View Grand Hotel",
    location: "Nyali, Mombasa",
    area: "Mombasa",
    rating: 8.4,
    ratingLabel: "Very good",
    pricePerNight: 16800,
    currency: "KES",
    category: "Hotel",
    guests: 4,
    rooms: 2,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "Modern coastal convenience near Nyali Beach, Old Town, restaurants, and family entertainment spots.",
    amenities: ["Rooftop lounge", "Pool", "Conference rooms", "City tours"]
  },
  {
    id: "karen-garden-villas",
    name: "Karen Garden Villas",
    location: "Karen, Nairobi",
    area: "Nairobi",
    rating: 9.0,
    ratingLabel: "Wonderful",
    pricePerNight: 27500,
    currency: "KES",
    category: "Luxury Apartment",
    guests: 6,
    rooms: 3,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "Private villa-style stays surrounded by greenery, ideal for family visits, retreats, and longer stays.",
    amenities: ["Private garden", "Chef on request", "Pet friendly", "Backup power"]
  }
];

export const formatMoney = (amount: number, currency: Property["currency"]) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
