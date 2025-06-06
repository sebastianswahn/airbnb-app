import Image from "next/image";
import { headers } from "next/headers";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingHeader from "@/components/listings/ListingHeader";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingAmenities from "@/components/listings/ListingAmenities";
import ListingReviews from "@/components/listings/ListingReviews";
import ListingMap from "@/components/listings/ListingMap";
import ListingHost from "@/components/listings/ListingHost";
import ReservationCard from "@/components/listings/ReservationCard";
import DesktopListingDetail from "@/components/listings/DesktopListingDetail";
import MobileNav from "@/components/MobileNav";
import { IMAGES } from "@/constants/images";
import { Listing, Host, Review, Amenity } from "@/types/listing";

// Extend the base Listing type
interface TransformedListing {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
  dates?: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  reviewCount: number;
  reviews: Review[];
}

async function getListing(id: string): Promise<TransformedListing | null> {
  try {
    const headersList = headers();
    const domain = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(`${protocol}://${domain}/api/listings/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to ensure all required properties exist
    const transformedData: TransformedListing = {
      ...data,
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      reviews: data.reviews || [],
      type: data.type || "Apartment",
      host: {
        _id: data.host._id,
        name: data.host.name,
        avatar: data.host.avatar,
      },
      maxGuests: data.maxGuests || 1,
      bedrooms: data.bedrooms || 1,
      bathrooms: data.bathrooms || 1,
      amenities: data.amenities || [],
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
}

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
    default: IMAGES.MISC.STAR,
  };

  return amenityMap[name] || amenityMap.default;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const listing = await getListing(params.id);

  if (!listing || !listing._id) {
    notFound();
  }

  // Transform amenities to match Amenity interface
  const amenitiesWithIcons: Amenity[] = listing.amenities.map((amenity) => ({
    icon: getAmenityIcon(amenity),
    name: amenity,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile View */}
      <div className="md:hidden">
        <Suspense fallback={<div>Loading mobile nav...</div>}>
          <MobileNav />
        </Suspense>

        <div className="hidden md:block border-b border-grey-600 py-5">
          <Suspense fallback={<div>Loading header...</div>}>
            <ListingHeader
              listing={{
                title: listing.name,
                location: listing.location,
                reviews: listing.reviews,
                reviewCount: listing.reviewCount,
                rating: listing.rating,
              }}
            />
          </Suspense>
        </div>

        <main>
          <Suspense fallback={<div>Loading gallery...</div>}>
            <ListingGallery images={listing.images} />
          </Suspense>

          <div className="max-w-[1360px] mx-auto px-[26px] w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left column - Listing details */}
              <div className="lg:w-2/3">
                <Suspense fallback={<div>Loading listing info...</div>}>
                  <ListingInfo 
                    listing={{
                      host: {
                        name: listing.host.name,
                        image: listing.host.avatar,
                      },
                      maxGuests: listing.maxGuests,
                      bedrooms: listing.bedrooms,
                      bathrooms: listing.bathrooms,
                      description: listing.description,
                      amenities: listing.amenities,
                      type: listing.type,
                    }}
                  />
                </Suspense>

                <Suspense fallback={<div>Loading amenities...</div>}>
                  <ListingAmenities amenities={amenitiesWithIcons} />
                </Suspense>

                <Suspense fallback={<div>Loading location...</div>}>
                  <ListingMap
                    location={listing.location}
                    coordinates={
                      listing.coordinates || { latitude: 0, longitude: 0 }
                    }
                  />
                </Suspense>
                <div className="w-full">
                  <Suspense fallback={<div>Loading reservation card...</div>}>
                    <ReservationCard
                      listing={{
                        price: listing.price,
                        rating: listing.rating,
                        reviewCount: listing.reviewCount,
                        id: listing._id,
                      }}
                    />
                  </Suspense>
                </div>

                <div className="mt-16">
                  <Suspense fallback={<div>Loading reviews...</div>}>
                    <ListingReviews
                      reviews={listing.reviews}
                      rating={listing.rating}
                      reviewCount={listing.reviewCount}
                    />
                  </Suspense>
                </div>

                <Suspense fallback={<div>Loading host info...</div>}>
                  <ListingHost
                    name={listing.host.name}
                    image={listing.host.avatar || IMAGES.ICONS.USER_EMPTY}
                    joinedDate="Member since 2024"
                    hostId={listing.host._id}
                    listingId={listing._id}
                    listingName={listing.name}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Desktop View */}
      <Suspense fallback={<div>Loading desktop view...</div>}>
        <DesktopListingDetail 
          listing={listing} 
          amenities={amenitiesWithIcons} 
        />
      </Suspense>
    </div>
  );
}