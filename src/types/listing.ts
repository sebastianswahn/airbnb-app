export interface Host {
  name: string;
  image: string;
  joinedDate: string;
  stats?: {
    totalReviews?: number;
    responseRate?: number;
    responseTime?: string;
    isSuperhost?: boolean;
  };
  languages?: string[];
  description?: string;
}

export interface Amenity {
  icon: string;
  name: string;
  description?: string;
}

export interface Review {
  _id: string;
  listing?: string; // ObjectId as string
  host?: string; // ObjectId as string
  user: string; // ObjectId as string
  author: {
    // This comes from populating the user field
    name: string;
    image: string;
  };
  rating: number;
  text: string; // This maps to 'text' in the database
  date: string; // This comes from timestamps
}
export interface Listing {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
  images: string[];
  type: "Villa" | "Apartment" | "House" | "Cabin";
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  reviewCount?: number;
  dates?: string;
}
