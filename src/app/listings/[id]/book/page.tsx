"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingFlow from "@/components/listings/BookingFlow";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Type definitions
interface Listing {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  maxGuests: number;
  rating?: number;
  reviewCount?: number;
  type?: string;
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface SelectedDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface BookingData {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  message?: string;
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    checkIn: null,
    checkOut: null,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalNights, setTotalNights] = useState<number>(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, fetchWithAuth } = useAuth();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${params.id}/book`)}`);
      return;
    }
    
    // Parse date parameters
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const priceParam = searchParams.get('price');
    const nightsParam = searchParams.get('nights');
    
    if (checkInParam && checkOutParam) {
      setSelectedDates({
        checkIn: new Date(checkInParam),
        checkOut: new Date(checkOutParam),
      });
    }
    
    if (priceParam) {
      setTotalPrice(parseInt(priceParam, 10));
    }
    
    if (nightsParam) {
      setTotalNights(parseInt(nightsParam, 10));
    }
    
    // Fetch listing details
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to load listing details");
        }
        
        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Unable to load listing details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [params.id, searchParams, router, isAuthenticated]);
  
  // Handle booking submission
  const handleBookingComplete = async (bookingData: BookingData) => {
    try {
      const response = await fetchWithAuth('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response?.ok) {
        throw new Error("Failed to create booking");
      }
      
      const data = await response.json();
      
      // Redirect to the booking confirmation page
      router.push(`/trips/${data._id}/confirmation`);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("There was an error processing your booking. Please try again.");
    }
  };
  
  // Handle cancel booking flow
  const handleCancel = () => {
    router.push(`/listings/${params.id}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !listing) {
    return (
      <div className="max-w-[768px] mx-auto px-6 py-10">
        <div className="text-center border border-solid border-red-300 bg-red-50 rounded-xl p-6">
          <p className="text-red-600">{error || "Listing not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Check if we have valid dates and price info
  if (!selectedDates.checkIn || !selectedDates.checkOut || !totalPrice || !totalNights) {
    return (
      <div className="max-w-[768px] mx-auto px-6 py-10">
        <div className="text-center border border-solid border-yellow-300 bg-yellow-50 rounded-xl p-6">
          <p className="text-yellow-800">Missing booking information. Please select dates first.</p>
          <button
            onClick={() => router.push(`/listings/${params.id}`)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Return to Listing
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <BookingFlow
      listing={listing}
      selectedDates={selectedDates}
      totalPrice={totalPrice}
      totalNights={totalNights}
      onCancel={handleCancel}
      onComplete={handleBookingComplete}
    />
  );
}