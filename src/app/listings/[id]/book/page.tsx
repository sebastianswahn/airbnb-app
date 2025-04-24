"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingFlow from "@/components/listings/BookingFlow";
import { useAuth } from "@/context/AuthContext";

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
  listing: string; // Changed from listingId to listing
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  message?: string;
}

interface StoredBookingData {
  data: {
    checkIn: string;
    checkOut: string;
    price: number;
    nights: number;
    listingId: string;
  };
  expiry: number;
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
      // Save booking data before redirecting
      if (params.id && searchParams.get('checkIn') && searchParams.get('checkOut')) {
        const bookingData = {
          data: {
            checkIn: searchParams.get('checkIn'),
            checkOut: searchParams.get('checkOut'),
            price: searchParams.get('price') || 0,
            nights: searchParams.get('nights') || 0,
            listingId: params.id
          },
          expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      }
      
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${params.id}/book`)}`);
      return;
    }
    
    // First try to get booking data from localStorage (works with auth redirects)
    const getSavedBookingData = () => {
      const savedBookingString = localStorage.getItem('pendingBooking');
      
      if (savedBookingString) {
        try {
          const savedBooking = JSON.parse(savedBookingString) as StoredBookingData;
          
          // Check if the data has expired
          if (savedBooking.expiry > Date.now() && savedBooking.data.listingId === params.id) {
            console.log('📋 Found valid booking data in localStorage');
            // Data is still valid and for this listing
            setSelectedDates({
              checkIn: new Date(savedBooking.data.checkIn),
              checkOut: new Date(savedBooking.data.checkOut),
            });
            
            setTotalPrice(savedBooking.data.price);
            setTotalNights(savedBooking.data.nights);
            
            // Clear the saved data to prevent reuse
            localStorage.removeItem('pendingBooking');
            return true;
          } else {
            // Data is expired or for a different listing - remove it
            console.log('🗑️ Removing expired or invalid booking data from localStorage');
            localStorage.removeItem('pendingBooking');
          }
        } catch (error) {
          console.error('❌ Error parsing saved booking data:', error);
          localStorage.removeItem('pendingBooking');
        }
      }
      return false;
    };
    
    // Then try URL parameters as a fallback
    const getUrlParameters = () => {
      // Parse date parameters
      const checkInParam = searchParams.get('checkIn');
      const checkOutParam = searchParams.get('checkOut');
      const priceParam = searchParams.get('price');
      const nightsParam = searchParams.get('nights');
      
      if (checkInParam && checkOutParam) {
        console.log('📋 Using URL parameters for booking data');
        setSelectedDates({
          checkIn: new Date(checkInParam),
          checkOut: new Date(checkOutParam),
        });
        
        if (priceParam) {
          setTotalPrice(parseInt(priceParam, 10));
        }
        
        if (nightsParam) {
          setTotalNights(parseInt(nightsParam, 10));
        }
        
        return true;
      }
      return false;
    };
    
    // Try both methods to get booking data
    const hasBookingData = getSavedBookingData() || getUrlParameters();
    
    if (!hasBookingData) {
      console.log('⚠️ No booking data found in localStorage or URL parameters');
    }
    
    // Fetch listing details
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log(`📡 Fetching listing details for ID: ${params.id}`);
        const response = await fetchWithAuth(`/api/listings/${params.id}`);
        
        if (!response?.ok) {
          throw new Error("Failed to load listing details");
        }
        
        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error("❌ Error fetching listing:", err);
        setError("Unable to load listing details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [params.id, searchParams, router, isAuthenticated, fetchWithAuth]);
  
  // Handle booking submission
  const handleBookingComplete = async (bookingData: BookingData) => {
    try {
      console.log('📝 Submitting booking to API...');
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
      console.log('✅ Booking created successfully:', data);
      
      // Redirect to the booking confirmation page
      router.push(`/trips/${data.bookingId}/confirmation`);
    } catch (err) {
      console.error("❌ Error creating booking:", err);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
