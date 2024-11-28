import Image from "next/image";
import type { Review } from "@/types/listing";

interface ListingHeaderProps {
  listing: {
    title: string;
    location: string;
    reviews: Review[];
    reviewCount: number;
    rating: number;
  };
}

export default function ListingHeader({ listing }: ListingHeaderProps) {
  const { title, location, rating, reviewCount } = listing;
  return (
    <div className="max-w-[1360px] mx-auto px-[26px] flex items-center justify-between">
      <h1 className="text-[32px] font-semibold">{listing.title}</h1>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2">
          <Image
            src="/images/share-icon.svg"
            alt="Share"
            width={16}
            height={16}
          />
          <span>Share</span>
        </button>
        <button className="flex items-center gap-2">
          <Image src="/images/heart2.svg" alt="Save" width={16} height={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
