import Image from "next/image";
import { IMAGES } from "@/constants/images"; // Adjust the import path as needed

interface ListingAmenitiesProps {
  amenities: Array<{
    icon: string;
    name: string;
  }>;
}

// Helper function to get the icon path
function getAmenityIcon(name: string): string {
  const amenityMap: Record<string, string> = {
    WiFi: IMAGES.AMENITIES.WIFI,
    TV: IMAGES.AMENITIES.TV,
    Pool: IMAGES.AMENITIES.POOL,
    "Air conditioning": IMAGES.AMENITIES.AIR,
    Bedroom: IMAGES.AMENITIES.BED,
    Breakfast: IMAGES.AMENITIES.BREAKFAST,
    Dryer: IMAGES.AMENITIES.DRYER,
    // Add any missing amenities with a default icon
    default: IMAGES.MISC.STAR, // or another suitable default icon
  };

  return amenityMap[name] || amenityMap.default;
}

export default function ListingAmenities({ amenities }: ListingAmenitiesProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {amenities?.map((amenity, index) => (
          <div key={index} className="flex items-center gap-4">
            <Image
              src={getAmenityIcon(amenity.name)}
              alt={amenity.name}
              width={24}
              height={24}
            />
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
