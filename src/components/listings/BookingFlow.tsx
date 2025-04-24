"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/useIsMobile";

// Types for the booking flow
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

interface BookingFlowProps {
  listing: Listing;
  selectedDates: SelectedDates;
  totalPrice: number;
  totalNights: number;
  onCancel: () => void;
  onComplete: (bookingData: BookingData) => void;
}

interface BookingData {
  listing: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
}

// Message Host Step Component
export const MessageHostStep: React.FC<{
  listing: Listing;
  onContinue: (message: string) => void;
  onSkip: () => void;
  onBack: () => void;
}> = ({ listing, onContinue, onSkip, onBack }) => {
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSubmitMessage = async () => {
    if (!message.trim()) {
      onSkip();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send message to create a conversation
      const response = await fetch(`/api/conversations/listing/${listing._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to send messages");
        }
        
        const data = await response.json().catch(() => ({ error: "Failed to send message" }));
        throw new Error(data.error || "Failed to send message");
      }

      // Message sent successfully, continue with booking flow
      onContinue(message);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
      // Still allow continuing with booking even if message fails
      setTimeout(() => {
        onContinue("");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mx-auto px-6 py-10 ${isMobile ? 'max-w-[768px]' : 'max-w-[1000px]'}`}>
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2">Back to listing</span>
        </button>
      </div>
      
      <div className={`${isMobile ? '' : 'grid grid-cols-2 gap-12'}`}>
        <div>
          <h1 className="text-2xl font-bold mb-6">Questions about this place?</h1>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">{listing.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
            <p className="font-medium">{listing.price} SEK <span className="text-gray-500 font-normal">/ night</span></p>
          </div>

          {listing.images && listing.images[0] && isMobile && (
            <div className="rounded-lg overflow-hidden mb-6 h-40 relative">
              <Image 
                src={listing.images[0]} 
                alt={listing.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Your message</h3>
            <textarea
              placeholder="For example: Is this place family-friendly? What should I know before booking?"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-3 mt-6">
            <button 
              onClick={handleSubmitMessage}
              disabled={isSubmitting}
              className={`bg-blue-600 text-white py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
            <button 
              onClick={onSkip}
              className="border border-gray-300 py-3 rounded-lg w-full font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Skip for now
            </button>
          </div>
        </div>
        
        {!isMobile && listing.images && listing.images[0] && (
          <div className="rounded-lg overflow-hidden h-96 relative mt-16">
            <Image 
              src={listing.images[0]} 
              alt={listing.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Booking Details Step Component
export const BookingDetailsStep: React.FC<{
  listing: Listing;
  selectedDates: SelectedDates;
  totalPrice: number;
  totalNights: number;
  messageSent: boolean;
  onContinue: (guests: number) => void;
  onBack: () => void;
}> = ({ listing, selectedDates, totalPrice, totalNights, messageSent, onContinue, onBack }) => {
  const [guests, setGuests] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    setIsSubmitting(true);
    onContinue(guests);
  };

  return (
    <div className={`mx-auto px-6 py-10 ${isMobile ? 'max-w-[768px]' : 'max-w-[1000px]'}`}>
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-2">Back</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Complete your booking</h1>
      
      <div className={`${isMobile ? 'grid md:grid-cols-2 gap-8' : 'grid grid-cols-2 gap-12'}`}>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Your trip</h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Dates</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">{format(selectedDates.checkIn!, "MMM d, yyyy")}</p>
                  <p className="text-sm text-gray-500">Check-in</p>
                </div>
                <span className="text-gray-400">→</span>
                <div>
                  <p className="text-gray-700">{format(selectedDates.checkOut!, "MMM d, yyyy")}</p>
                  <p className="text-sm text-gray-500">Check-out</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Guests</h3>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {[...Array(listing.maxGuests)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>
            
            {messageSent && (
              <div className="mb-4">
                <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Your message has been sent to the host</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Cancellation policy</h2>
            <p className="text-gray-700">
              Free cancellation before {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}.
              Cancel before check-in for a partial refund.
            </p>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 relative rounded-md overflow-hidden mr-4">
                <Image
                  src={listing.images[0] || "/images/placeholder.jpg"}
                  alt={listing.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-medium">{listing.name}</h2>
                <p className="text-sm text-gray-600">{listing.location}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-semibold mb-3">Price details</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">{listing.price} SEK × {totalNights} nights</span>
                <span>{listing.price * totalNights} SEK</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total (SEK)</span>
                <span>{totalPrice} SEK</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold text-white
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                transition-colors`}
            >
              {isSubmitting ? "Processing..." : "Confirm and pay"}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 flex flex-col gap-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>You won't be charged yet</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Price guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Booking Flow Container Component
const BookingFlow: React.FC<BookingFlowProps> = ({ 
  listing, 
  selectedDates, 
  totalPrice, 
  totalNights, 
  onCancel, 
  onComplete 
}) => {
  const [step, setStep] = useState<number>(1); // Start with message host step
  const [guests, setGuests] = useState<number>(1);
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const handleMessageSubmit = (message: string) => {
    // If message is not empty, mark as sent
    if (message.trim()) {
      setMessageSent(true);
    }
    setStep(2); // Proceed to booking details
  };

  const handleSkipMessage = () => {
    setStep(2); // Skip to booking details
  };

  const handleDetailsSubmit = (guestCount: number) => {
    setGuests(guestCount);
    handleConfirmBooking();
  };

  const handleConfirmBooking = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return;
    
    const bookingData: BookingData = {
      listing: listing._id,
      startDate: selectedDates.checkIn.toISOString(),
      endDate: selectedDates.checkOut.toISOString(),
      totalPrice,
      guests
      // No message field anymore as it's sent separately
    };
    
    onComplete(bookingData);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <>
      {step === 1 && (
        <MessageHostStep 
          listing={listing}
          onContinue={handleMessageSubmit}
          onSkip={handleSkipMessage}
          onBack={onCancel}
        />
      )}
      
      {step === 2 && (
        <BookingDetailsStep 
          listing={listing}
          selectedDates={selectedDates}
          totalPrice={totalPrice}
          totalNights={totalNights}
          messageSent={messageSent}
          onContinue={handleDetailsSubmit}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default BookingFlow;