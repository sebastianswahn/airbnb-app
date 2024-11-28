// components/listings/ListingInfo.tsx
import Image from "next/image";

interface ListingInfoProps {
  listing: {
    host: {
      name: string;
      image: string;
    };
    maxGuests: number;
    bedrooms: number;
    beds: number;
    baths: number;
    description: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export default function ListingInfo({ listing }: ListingInfoProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[22px] font-semibold mb-2">
            Entire villa hosted by {listing.host.name}
          </h2>
          <div className="flex gap-2 text-gray-600">
            <span>{listing.maxGuests} guests</span>
            <span>·</span>
            <span>{listing.bedrooms} bedrooms</span>
            <span>·</span>
            <span>{listing.beds} beds</span>
            <span>·</span>
            <span>{listing.baths} baths</span>
          </div>
        </div>
        <Image
          src={listing.host.image}
          alt={listing.host.name}
          width={56}
          height={56}
          className="rounded-full"
        />
      </div>

      <div className="space-y-6">
        {listing.features.map((feature, index) => (
          <div key={index} className="flex gap-4 items-start">
            <Image
              src={feature.icon}
              alt={feature.title}
              width={24}
              height={24}
            />
            <div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-gray-600">{listing.description}</p>
        <button className="mt-4 font-semibold underline">Show more</button>
      </div>
    </div>
  );
}
