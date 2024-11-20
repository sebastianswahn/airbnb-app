export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  host: {
    id: string;
    name: string;
  };
  amenities: string[];
  rating?: number;
  reviews?: number;
  dates?: {
    start: string;
    end: string;
  };
  distance?: string;
}

export interface ListingFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  amenities?: string[];
}
