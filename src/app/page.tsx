"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import ListingCard from "@/components/listings/ListingCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import PageLayout from "@/components/PageLayout";
import { IMAGES } from "@/constants/images";
import type { Listing } from "@/types/listing";

export default function Home() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("amazing-views");

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

  const handleSearchClick = () => {
    // Navigate to search page
    router.push("/search");
  };

  const handleFilterClick = () => {
    // Navigate to filters/search page
    router.push("/search");
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // You could filter listings based on category here
    console.log(`Category changed to: ${categoryId}`);
  };

  const handleMapViewNavigate = () => {
    // Navigate to map view
    router.push("/map");
  };

  const DesktopHeader = () => (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="py-4 flex items-center justify-between">
          <Image
            src={IMAGES.LOGO.AIRBNB}
            alt="Airbnb"
            width={102}
            height={32}
            priority
          />
          <div className="flex-1 max-w-2xl mx-12">
            <SearchBar onSearch={handleSearchClick} />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/host/homes")}
              className="text-sm font-medium hover:bg-gray-50 rounded-full px-4 py-2"
            >
              Airbnb your home
            </button>
            <button 
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 border rounded-full p-1.5 hover:shadow-md transition"
            >
              <Image
                src={IMAGES.ICONS.HAMBURGER}
                alt="Menu"
                width={14}
                height={14}
              />
              <div className="h-7 w-7 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={IMAGES.ICONS.USER}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {isMobile ? (
          <MobileSearchBar onSearch={handleSearchClick} onFilterClick={handleFilterClick} />
        ) : (
          <DesktopHeader />
        )}
      </div>

      {/* Content */}
      <main className="flex-1 pt-16 px-6">
        {/* Filters */}
        <div className="my-4">
          <Filters onChange={handleCategoryChange} />
        </div>

        {/* Map Toggle Button (Mobile only) */}
        {isMobile && (
          <div className="fixed bottom-20 right-6 z-40">
            <button 
              onClick={handleMapViewNavigate}
              className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <span>Map</span>
            </button>
          </div>
        )}

        {/* Listings */}
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
                  : "grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
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