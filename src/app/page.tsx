"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ListingGallery from "@/components/listings/ListingGallery";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import ListingCard from "@/components/listings/ListingCard";
import PriceToggle from "@/components/PriceToggle";
import type { Listing } from "@/types/listing";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/listings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="hidden md:block py-5">
            {/* Desktop Header */}
            <div className="flex items-center justify-between">
              <SearchBar onSearch={(query) => console.log(query)} />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/host/homes")}
                  className="text-sm font-medium hover:bg-gray-50 rounded-full px-4 py-2"
                >
                  Airbnb your home
                </button>
                <button
                  onClick={() => router.push("/account-settings")}
                  className="flex items-center gap-2 border rounded-full p-2 hover:shadow-md transition"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src="/images/default-avatar.png"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-[1360px] mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <Filters />
            <div className="flex items-center justify-end">
              <PriceToggle
                showTotal={showTotalPrice}
                setShowTotal={setShowTotalPrice}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  showTotalPrice={showTotalPrice}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
