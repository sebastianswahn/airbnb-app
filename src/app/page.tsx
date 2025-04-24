"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileSearchBar from "@/components/MobileSearchBar";
import PageLayout from "@/components/PageLayout";
import ListingCard from "@/components/listings/ListingCard";
import type { Listing } from "@/types/listing";

export default function Home() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Check if the response is an array or an object with listings property
        const listingsData = Array.isArray(data) ? data : data.listings || [];
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <PageLayout>
      {/* For mobile only - add the search bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white">
          <MobileSearchBar 
            onSearch={() => router.push("/search")} 
            onFilterClick={() => router.push("/search")} 
          />
        </div>
      )}

      {/* Main content - PageLayout already includes desktop header */}
      <main className={`flex-1 ${isMobile ? 'pt-16' : ''} px-6 max-w-[1360px] w-full`}>
        {/* Map Toggle Button (Mobile only) */}
        {isMobile && (
          <div className="fixed bottom-20 right-6 z-40">
            <button 
              onClick={() => router.push("/map")}
              className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <span>Map</span>
            </button>
          </div>
        )}

        {/* Listings Grid */}
        <div className="pb-20">
          {isLoadingListings ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : listings.length > 0 ? (
            <div
              className={
                isMobile
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                  : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              }
            >
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  onClick={() => router.push(`/listings/${listing._id}`)}
                  className="cursor-pointer"
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No listings found</p>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}