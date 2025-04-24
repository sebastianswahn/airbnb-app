"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";

// Type definitions
interface Booking {
  _id: string;
  listing: {
    _id: string;
    name: string;
    images: string[];
    location: string;
    price?: number | string;
  };
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice?: number | string;
  status: string;
  guests: number;
  message?: string;
  confirmationCode: string;
  createdAt: string;
}

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(format(new Date(), "MMM d, yyyy"));
  
  const router = useRouter();
  const { isAuthenticated, fetchWithAuth } = useAuth();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/trips/${params.id}/confirmation`)}`);
      return;
    }
    
    // Fetch booking details
    const fetchBooking = async () => {
      try {
        setLoading(true);
        console.log(`Fetching booking with ID: ${params.id}`);
        const response = await fetchWithAuth(`/api/bookings/${params.id}`);
        
        if (!response?.ok) {
          throw new Error("Failed to load booking details");
        }
        
        const data = await response.json();
        console.log("Booking data received:", JSON.stringify(data, null, 2));
        setBooking(data);
        
        // Set booking date - either from API or fallback to current date
        if (data && data.createdAt) {
          try {
            setBookingDate(format(parseISO(data.createdAt), "MMM d, yyyy"));
          } catch (err) {
            console.error("Error parsing booking date:", err);
            setBookingDate(format(new Date(), "MMM d, yyyy"));
          }
        } else {
          setBookingDate(format(new Date(), "MMM d, yyyy"));
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [params.id, router, isAuthenticated, fetchWithAuth]);
  
  // Format date for display - with validation
  const formatDate = (dateString: string): string => {
    try {
      // Ensure the dateString is valid before parsing
      if (!dateString) return "Invalid date";
      return format(parseISO(dateString), "EEE, MMM d, yyyy");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };
  
  // Safe number parser for price values
  const safeParseNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate number of nights with validation
  const calculateNights = (startDate: string, endDate: string): number => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (err) {
      console.error("Error calculating nights:", err);
      return 0;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="max-w-[768px] mx-auto px-6 py-10">
        <div className="text-center border border-solid border-red-300 bg-red-50 rounded-xl p-6">
          <p className="text-red-600">{error || "Booking not found"}</p>
          <button
            onClick={() => router.push("/trips")}
            className="mt-4 text-blue-600 underline"
          >
            Go to Trips
          </button>
        </div>
      </div>
    );
  }
  
  // Only calculate nights if both dates are valid
  const nights = booking.startDate && booking.endDate 
    ? calculateNights(booking.startDate, booking.endDate) 
    : 0;
    
  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white p-4 border-b border-gray-100">
        <button 
          onClick={() => router.push("/trips")}
          className="flex items-center text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2">Back to Trips</span>
        </button>
      </div>
      
      <div className="max-w-[768px] mx-auto px-6 pt-20 pb-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Booking Confirmed!</h1>
          <p className="text-center text-gray-600 mb-6">
            Your reservation is confirmed. You'll receive a confirmation email shortly.
          </p>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex items-start mb-4">
              <div className="w-24 h-24 relative rounded-md overflow-hidden">
                {booking.listing.images && booking.listing.images[0] ? (
                  <Image
                    src={booking.listing.images[0]}
                    alt={booking.listing.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{booking.listing.name}</h2>
                <p className="text-gray-600 text-sm">{booking.listing.location}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium">{formatDate(booking.startDate)}</span>
                  <span className="text-gray-600 mx-2">→</span>
                  <span className="text-sm font-medium">{formatDate(booking.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Reservation details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Confirmation code</p>
                <p className="font-mono font-medium">{booking.confirmationCode || "HM323SP5L4"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Booking date</p>
                <p>{bookingDate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Guests</p>
                <p>{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="capitalize">{booking.status}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-semibold mb-3">Payment summary</h3>
            <p className="text-sm text-blue-600 mb-4">
              For detailed price information, please view the full trip details.
            </p>
          </div>
          
          {booking.message && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold mb-2">Your message to host</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.message}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button 
              onClick={() => router.push(`/trips/${booking._id}`)}
              className="bg-blue-600 text-white py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition"
            >
              View Trip Details
            </button>
            <button 
              onClick={() => router.push(`/messages/${booking.host._id}?listingId=${booking.listing._id}`)}
              className="border border-gray-300 py-3 rounded-lg w-full font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Message Host
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}