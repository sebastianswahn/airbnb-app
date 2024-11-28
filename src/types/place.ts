export interface PlacePageProps {
  params: {
    id: string;
  };
}

export interface Booking {
  checkIn: {
    date: string;
    time: string;
  };
  checkOut: {
    date: string;
    time: string;
  };
  guests: number;
  totalPrice: number;
}

export interface Host {
  id: string;
  name: string;
  image: string;
  joinDate: string;
  about: string;
  languages: string[];
  responseRate: number;
  responseTime: string;
}

export interface PlaceDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  host: Host;
  amenities: {
    icon: string;
    name: string;
  }[];
  rules: string[];
  cancellationPolicy: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
