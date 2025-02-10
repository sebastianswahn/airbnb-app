"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import ListingCard from "@/components/listings/ListingCard";
import MobileNav from "@/components/MobileNav";
import MobileSearchBar from "@/components/MobileSearchBar";
import { IMAGES } from "@/constants/images";
import type { Listing } from "@/types/listing";

export default function Home() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
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
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchListings();
  }, []);

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
            <SearchBar onSearch={(query) => console.log(query)} />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/host/homes")}
              className="text-sm font-medium hover:bg-gray-50 rounded-full px-4 py-2"
            >
              Airbnb your home
            </button>
            <button className="flex items-center gap-2 border rounded-full p-1.5 hover:shadow-md transition">
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
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {isMobile ? (
          <div className="px-6 pt-4">
            <MobileSearchBar />
          </div>
        ) : (
          <DesktopHeader />
        )}
      </div>

      {/* Content */}
      <main className="flex-1 pt-16 px-6">
        {/* Filters */}
        <div className="my-4">
          <Filters />
        </div>

        {/* Listings */}
        <div>
          {isLoadingListings ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <p>Loading listings...</p>
            </div>
          ) : (
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
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
}
