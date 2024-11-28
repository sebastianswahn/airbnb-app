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

export interface Review {
  id: string;
  author: {
    name: string;
    image: string;
  };
  date: string;
  content: string;
  rating: number;
}

export interface Amenity {
  icon: string;
  name: string;
  description?: string;
}

export interface Listing {
  _id: string;
  title: string;
  location: string;
  description: string;
  images: string[];
  price: number;
  rating: number;
  reviews: Review[];
  reviewCount: number;
  host: Host;
  amenities: Amenity[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}
