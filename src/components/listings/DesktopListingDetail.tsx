"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ListingGallery from "./ListingGallery";
import ListingAmenities from "./ListingAmenities";
import ListingReviews from "./ListingReviews";
import ListingMap from "./ListingMap";
import ListingHost from "./ListingHost";
import DesktopReservationCard from "./DesktopReservationCard";
import { IMAGES } from "@/constants/images";
import { Listing, Amenity } from "@/types/listing";

interface DesktopListingDetailProps {
  listing: any; // Use your Listing type here
  amenities: Amenity[];
}

const DesktopListingDetail: React.FC<DesktopListingDetailProps> = ({
  listing,
  amenities
}) => {
  const router = useRouter();

  return (
    <div className="hidden md:block">
      <div className="max-w-[1360px] mx-auto px-6">
        <h1 className="text-2xl font-bold mt-6 mb-2">{listing.name}</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center">
              <Image src={IMAGES.MISC.STAR} alt="Rating" width={16} height={16} />
              <span className="ml-1 font-medium">{listing.rating.toFixed(1)}</span>
            </span>
            <span>·</span>
            <span className="underline">{listing.reviewCount} reviews</span>
            <span>·</span>
            <span className="underline">{listing.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm font-medium hover:underline">
              <Image src={IMAGES.ICONS.SHARE} alt="Share" width={16} height={16} />
              Share
            </button>
            <button className="flex items-center gap-1 text-sm font-medium hover:underline">
              <Image src={IMAGES.ICONS.FAVORITE} alt="Save" width={16} height={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      <ListingGallery images={listing.images} />
      
      <div className="max-w-[1360px] mx-auto px-6 mt-8">
        <div className="flex gap-12">
          {/* Left column */}
          <div className="flex-grow max-w-[60%]">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {listing.type} hosted by {listing.host.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={listing.host.avatar || IMAGES.ICONS.USER_EMPTY}
                    alt={listing.host.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-gray-200">
              <h2 className="text-xl font-bold mb-4">About this place</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>

            <div className="py-6 border-b border-gray-200">
              <ListingAmenities amenities={amenities} />
            </div>
          </div>
          
          {/* Right column */}
          <div className="w-[35%] relative">
            <div className="sticky top-8">
              <DesktopReservationCard
                listing={{
                  price: listing.price,
                  rating: listing.rating,
                  reviewCount: listing.reviewCount,
                  id: listing._id
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <ListingReviews
            reviews={listing.reviews}
            rating={listing.rating}
            reviewCount={listing.reviewCount}
          />
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <ListingMap
            location={listing.location}
            coordinates={listing.coordinates || { latitude: 0, longitude: 0 }}
          />
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 pb-16">
          <ListingHost
            name={listing.host.name}
            image={listing.host.avatar || IMAGES.ICONS.USER_EMPTY}
            joinedDate="Member since 2024"
            hostId={listing.host._id}
            listingId={listing._id}
            listingName={listing.name}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopListingDetail;