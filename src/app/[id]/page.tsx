// app/listings/[id]/page.tsx
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
import MobileNav from "@/components/listings/MobileNav";

interface ListingDetailProps {
  params: {
    id: string;
  };
}

async function getListing(id: string) {
  return {
    id,
    title: "Adaaran Club Rannalhi, Maldives, Water Bungalows",
    location: "Maldives",
    rating: 4.82,
    reviews: 11,
    host: {
      name: "Dorothy",
      image: "/userempty.png",
      joinedDate: "February 2019",
    },
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
        <ListingHeader listing={listing} />
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
              <ListingReviews reviews={listing.reviews} />
              <ListingHost host={listing.host} />
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <ReservationCard listing={listing} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
