"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/PageLayout";
import EmptyTrips from "@/components/trips/EmptyTrips";
import PastTrips from "@/components/trips/PastTrips";
import CurrentTrips from "@/components/trips/CurrentTrips";
import { useAuth } from "@/context/AuthContext";

// Define our booking interface
interface Booking {
  _id: string;
  listing: {
    _id: string;
    name: string;
    images: string[];
    location: string;
  };
  host: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status?: string;
}

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, fetchWithAuth } = useAuth();

  // Fetch bookings
  useEffect(() => {
    async function fetchBookings() {
      if (!isAuthenticated) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetchWithAuth("/api/bookings");
        
        if (response?.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          throw new Error("Failed to load bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to load your trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [isAuthenticated, fetchWithAuth]);

  // Separate current and past bookings
  const currentDate = new Date();
  
  const currentTrips = bookings.filter(booking => {
    const endDate = new Date(booking.endDate);
    return endDate >= currentDate;
  });

  const pastTrips = bookings.filter(booking => {
    const endDate = new Date(booking.endDate);
    return endDate < currentDate;
  });

  return (
    <Layout>
      <div className="max-w-[768px] w-full">
        <section className="pt-10 pb-16">
          <div className="px-6">
            <h1 className="text-[32px] font-semibold leading-9 font-roboto text-black-600 pb-12">
              Trips
            </h1>
            
            {loading ? (
              // Loading state
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              // Error state
              <div className="text-center border border-solid border-red-300 bg-red-50 rounded-xl p-6">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 text-blue-600 underline"
                >
                  Try again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              // No trips state
              <EmptyTrips />
            ) : (
              // Has trips state
              <div className="space-y-12">
                {currentTrips.length > 0 && <CurrentTrips trips={currentTrips} />}
                {pastTrips.length > 0 && <PastTrips trips={pastTrips} />}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}