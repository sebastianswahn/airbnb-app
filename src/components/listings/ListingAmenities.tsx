import Image from "next/image";

interface ListingAmenitiesProps {
  amenities: Array<{
    icon: string;
    name: string;
  }>;
}

export default function ListingAmenities({ amenities }: ListingAmenitiesProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {amenities?.map((amenity, index) => (
          <div key={index} className="flex items-center gap-4">
            <Image
              src={amenity.icon}
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
