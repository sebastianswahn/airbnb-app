"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { IMAGES } from "@/constants/images";
import ContactHostModal from "@/components/listings/ContactHostModal";

// Define our booking interface
interface Booking {
  _id: string;
  listing: {
    _id: string;
    name: string;
    images: string[];
    location: string;
    price?: number;
    type?: string;
    bedrooms?: number;
    bathrooms?: number;
    maxGuests?: number;
  };
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  guests?: number;
  confirmationCode?: string;
}

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, fetchWithAuth } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  // Format the date for display
  const formatDateDay = (dateString: string): string => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${dayOfWeek}, ${day} ${month}`;
  };

  // Calculate number of nights
  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await fetchWithAuth(`/api/bookings/${params.id}`);
        if (response?.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          throw new Error("Failed to load booking details");
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Unable to load trip details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [isAuthenticated, fetchWithAuth, params.id, router]);

  const handleMessageHost = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleBack = () => {
    router.push('/trips');
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !booking) {
    return (
      <PageLayout>
        <div className="max-w-[768px] mx-auto px-6 py-10">
          <div className="text-center border border-solid border-red-300 bg-red-50 rounded-xl p-6">
            <p className="text-red-600">{error || "Booking not found"}</p>
            <button
              onClick={handleBack}
              className="mt-4 text-blue-600 underline"
            >
              Back to Trips
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const nights = calculateNights(booking.startDate, booking.endDate);

  return (
    <PageLayout>
      {/* Mobile navigation is hidden for this page as we have a custom back button */}

      {/* Back button - Fixed at the top */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4">
        <button 
          onClick={handleBack}
          className="flex items-center text-white bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2 text-sm font-medium">Back to trips</span>
        </button>
      </div>

      {/* Full viewport hero image */}
      <div className="relative w-full h-[300px]">
        {booking.listing.images && booking.listing.images[0] ? (
          <Image
            src={booking.listing.images[0]}
            alt={booking.listing.name}
            className="object-cover"
            fill
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent pt-16 pb-6 px-6">
          <h1 className="text-xl font-semibold text-white">
            Your stay at {booking.listing.name}
          </h1>
          <p className="text-white/90 text-sm mt-1">{booking.listing.location || "Prenzlauer Berg, Berlin, Germany"}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[768px] mx-auto bg-white mb-16">
        {/* Bottom navigation tabs */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 z-10">
          <button className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="text-xs mt-1">Explore</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/4 py-2 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span className="text-xs mt-1">Trips</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="text-xs mt-1">Inbox</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Check-in/Checkout dates */}
          <div className="grid grid-cols-2 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Check-in</h3>
              <p className="text-lg font-medium">{formatDateDay(booking.startDate)}</p>
              <p className="text-sm text-gray-500">1:00 pm</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Checkout</h3>
              <p className="text-lg font-medium">{formatDateDay(booking.endDate)}</p>
              <p className="text-sm text-gray-500">11:00 am</p>
            </div>
          </div>

          {/* Message Host */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <div 
              className="flex items-start cursor-pointer" 
              onClick={handleMessageHost}
            >
              <div className="mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium">Message your Host</h3>
                <p className="text-gray-500 text-sm">{booking.host.name || "John"}</p>
              </div>
            </div>
          </div>

          {/* Contact Host Modal */}
          {showContactModal && booking && (
            <ContactHostModal
              listingId={booking.listing._id}
              listingName={booking.listing.name}
              hostName={booking.host.name}
              hostImage={booking.host.avatar || IMAGES.ICONS.USER_EMPTY}
              onClose={handleCloseModal}
            />
          )}

          {/* Reservation details */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-xl font-medium mb-4">Reservation details</h2>
            
            <div className="mb-3">
              <h3 className="text-sm text-gray-500 mb-1">Who's coming</h3>
              <p className="text-base">{booking.guests || 2} guests</p>
            </div>
            
            <div className="mb-3">
              <h3 className="text-sm text-gray-500 mb-1">Confirmation code</h3>
              <p className="font-mono text-base">{booking.confirmationCode || "HM323SP5L4"}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Booking status</h3>
              <p className="text-base capitalize">{booking.status || 'Confirmed'}</p>
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-base font-medium mb-3">Cancellation policy</h2>
            <p className="text-sm text-gray-700">
              Cancel before 1:00 pm on {formatDateDay(booking.startDate)} for a partial refund. 
              After that, the reservation is non-refundable.
            </p>
          </div>

          {/* Rules and instructions */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-base font-medium mb-3">Rules and instructions</h2>
            
            <h3 className="text-sm font-medium mb-2">House rules</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Self check-in with Building staff</li>
              <li>{booking.guests || 2} guests maximum</li>
              <li>No pets</li>
            </ul>
          </div>

          {/* Host information */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-base font-medium mb-3">
              Hosted by {booking.host.name || "John"}
            </h2>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                {booking.host.avatar ? (
                  <Image
                    src={booking.host.avatar}
                    alt={booking.host.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={IMAGES.ICONS.USER_EMPTY || "/images/user-placeholder.png"}
                    alt={booking.host.name || "Host"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="text-gray-500 text-xs">
                Co-host
              </div>
            </div>
          </div>

          {/* Payment information */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-base font-medium mb-3">Payment info</h2>
            <div className="flex justify-between py-1 text-sm">
              <span>{booking.listing.price || 1500} SEK × {nights} nights</span>
              <span>{(booking.listing.price || 1500) * nights} SEK</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Service fee</span>
              <span>{Math.round((booking.totalPrice || 0) * 0.1)} SEK</span>
            </div>
            <div className="flex justify-between py-2 font-medium border-t border-gray-100 mt-2 pt-2 text-sm">
              <span>Total</span>
              <span>{Math.round(booking.totalPrice) || Math.round((booking.listing.price || 1500) * nights * 1.1)} SEK</span>
            </div>
          </div>

          {/* Support section */}
          <div className="border-t border-gray-100 pt-5 pb-5">
            <h2 className="text-base font-medium mb-3">Get support anytime</h2>
            <p className="text-xs text-gray-700">
              If you need help, we're available 24/7 from anywhere in the world.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}