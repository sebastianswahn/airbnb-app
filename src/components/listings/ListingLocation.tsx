import Image from "next/image";

interface ListingLocationProps {
  location: string;
}

export default function ListingLocation({ location }: ListingLocationProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <h2 className="text-[22px] font-semibold mb-4">Where you'll be</h2>
      <div className="rounded-xl overflow-hidden">
        <Image
          src="/images/mbl-map.png"
          alt="Location map"
          width={800}
          height={400}
          className="w-full object-cover"
        />
      </div>
      <h3 className="mt-4 text-base font-semibold">{location}</h3>
    </div>
  );
}
