import React from "react";
import { MapPin } from "lucide-react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ListingMapProps {
  location: string;
  coordinates?: Coordinates;
}

const DEFAULT_COORDINATES: Coordinates = {
  latitude: -8.409518,
  longitude: 115.188919, // Default to Bali coordinates
};

const ListingMap: React.FC<ListingMapProps> = ({
  location,
  coordinates = DEFAULT_COORDINATES,
}) => {
  console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  console.log("Coordinates:", coordinates);
  return (
    <div className="my-8 rounded-lg overflow-hidden border border-gray-200">
      <div className="relative w-full h-96">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates.latitude},${coordinates.longitude}&zoom=15`}
        />
      </div>
      <div className="p-6 bg-white">
        <h3 className="text-xl font-semibold mb-2">Where you'll be</h3>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingMap;
