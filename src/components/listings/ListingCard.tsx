import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants/images";
import { ListingCardProps } from "@/types/components";

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  className = "",
}) => {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/${listing._id}`)}
      className={`w-full max-w-[300px] sm:max-w-none mx-auto cursor-pointer ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={listing.images[0] || "/images/placeholder.png"}
          alt={listing.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          priority
        />
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition"
          onClick={(e) => {
            e.stopPropagation();
            // Add favorite logic here
          }}
        >
          <Image src={IMAGES.ICONS.HEART} alt="Like" width={24} height={24} />
        </button>
      </div>
      <div className="mt-3 w-full">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[15px] flex-1 truncate pr-2">
            {listing.location}
          </h3>
          {typeof listing.rating !== "undefined" && listing.rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0 text-[14px]">
              <svg
                viewBox="0 0 32 32"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" />
              </svg>
              <span>{listing.rating}</span>
              {typeof listing.reviewCount !== "undefined" &&
                listing.reviewCount > 0 && (
                  <span className="text-gray-600">({listing.reviewCount})</span>
                )}
            </div>
          )}
        </div>
        <div className="mt-1 text-gray-500">
          <p className="text-[14px]">{listing.dates || "7-12 Jun"}</p>
          <p className="text-[14px]">
            <span className="text-black font-medium">
              {listing.price.toLocaleString()} kr
            </span>{" "}
            night
          </p>
        </div>
      </div>
    </article>
  );
};

export default ListingCard;
