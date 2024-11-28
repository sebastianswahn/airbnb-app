import Image from "next/image";
import { Suspense } from "react";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingHeader from "@/components/listings/ListingHeader";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingAmenities from "@/components/listings/ListingAmenities";
import ListingReviews from "@/components/listings/ListingReviews";
import ListingLocation from "@/components/listings/ListingLocation";
import ListingHost from "@/components/listings/ListingHost";
import ReservationCard from "@/components/listings/ReservationCard";
import MobileNav from "@/components/MobileNav";
import { Listing } from "@/types/listing";

async function getListing(id: string): Promise<Listing> {
  return {
    id,
    title: "Adaaran Club Rannalhi, Maldives, Water Bungalows",
    location: "Maldives",
    description: "Experience luxury in our water bungalows...",
    images: [
      "/images/maldive-img1.png",
      "/images/maldive-img2.png",
      "/images/maldive-img3.png",
      "/images/maldive-img4.png",
      "/images/maldive-img5.png",
    ],
    price: 42000,
    rating: 4.82,
    reviewCount: 11,
    reviews: [
      {
        id: "1",
        author: {
          name: "John",
          image: "/images/userempty.png",
        },
        date: "July 2023",
        content: "Amazing stay with great views...",
        rating: 5,
      },
    ],
    host: {
      name: "Dorothy",
      image: "/images/userempty.png",
      joinedDate: "February 2019",
      stats: {
        totalReviews: 720,
        responseRate: 100,
        responseTime: "within an hour",
        isSuperhost: true,
      },
      languages: ["English", "Hindi"],
      description:
        "I have a love for travelling, photography, and good food...",
    },
    amenities: [
      {
        icon: "/images/wifi-icon.svg",
        name: "Wifi",
        description: "Super fast fiber internet",
      },
      {
        icon: "/images/pool-icon.svg",
        name: "Pool",
        description: "Private infinity pool",
      },
    ],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    features: [
      {
        icon: "/images/location-icon.svg",
        title: "Great location",
        description: "95% of recent guests gave a 5-star rating",
      },
      {
        icon: "/images/key-icon.svg",
        title: "Great check-in experience",
        description: "100% of recent guests gave a 5-star rating",
      },
    ],
  };
}

interface ListingDetailProps {
  params: {
    id: string;
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailProps) {
  const listing = await getListing(params.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="hidden md:block border-b border-grey-600 py-5">
        <ListingHeader listing={listing} />{" "}
      </div>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <ListingGallery images={listing.images} />
        </Suspense>

        <div className="max-w-[1360px] mx-auto px-[26px] w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <ListingInfo listing={listing} />
              <ListingAmenities amenities={listing.amenities} />
              <ListingLocation location={listing.location} />
              <ListingReviews
                reviews={listing.reviews}
                reviewCount={listing.reviewCount}
                rating={listing.rating}
              />
              <ListingHost
                name={listing.host.name}
                image={listing.host.image}
                joinedDate={listing.host.joinedDate}
                stats={listing.host.stats}
                languages={listing.host.languages}
                description={listing.host.description}
              />
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <ReservationCard
                  listing={{
                    price: listing.price,
                    rating: listing.rating,
                    reviewCount: listing.reviewCount,
                  }}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
