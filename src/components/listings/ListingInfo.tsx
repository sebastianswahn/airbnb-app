import Image from "next/image";
import { IMAGES } from "@/constants/images";

interface ListingInfoProps {
  listing: {
    host: {
      name: string;
      image?: string;
    };
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    amenities: string[];
    type: string;
  };
}

export default function ListingInfo({ listing }: ListingInfoProps) {
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi")) return IMAGES.AMENITIES.WIFI;
    if (amenityLower.includes("tv")) return IMAGES.AMENITIES.TV;
    if (amenityLower.includes("pool")) return IMAGES.AMENITIES.POOL;
    if (amenityLower.includes("air")) return IMAGES.AMENITIES.AIR;
    if (amenityLower.includes("bed")) return IMAGES.AMENITIES.BED;
    if (amenityLower.includes("breakfast")) return IMAGES.AMENITIES.BREAKFAST;
    return IMAGES.MISC.STAR; // Default icon
  };

  return (
    <div className="py-8 border-b border-grey-600">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[22px] font-semibold mb-2">
            Entire {listing.type.toLowerCase()} hosted by {listing.host.name}
          </h2>
          <div className="flex gap-2 text-gray-600">
            <span>{listing.maxGuests} guests</span>
            <span>·</span>
            <span>{listing.bedrooms} bedrooms</span>
            <span>·</span>
            <span>{listing.bathrooms} baths</span>
          </div>
        </div>
        <Image
          src={listing.host.image || IMAGES.ICONS.USER_EMPTY}
          alt={listing.host.name}
          width={56}
          height={56}
          className="rounded-full"
        />
      </div>

      {listing.amenities && listing.amenities.length > 0 && (
        <div className="space-y-6">
          {listing.amenities.map((amenity, index) => (
            <div key={index} className="flex gap-4 items-start">
              <Image
                src={getAmenityIcon(amenity)}
                alt={amenity}
                width={24}
                height={24}
              />
              <div>
                <p className="text-gray-600">{amenity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <p className="text-gray-600">{listing.description}</p>
        <button className="mt-4 font-semibold underline">Show more</button>
      </div>
    </div>
  );
}
