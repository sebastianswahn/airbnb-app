"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  message?: string;
}

// Booking Details Step Component
export const BookingDetailsStep: React.FC<{
  listing: Listing;
  selectedDates: SelectedDates;
  totalPrice: number;
  totalNights: number;
  onContinue: (guests: number) => void;
  onBack: () => void;
}> = ({ listing, selectedDates, totalPrice, totalNights, onContinue, onBack }) => {
  const [guests, setGuests] = useState<number>(1);
  const router = useRouter();

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };

  const serviceFee = Math.round(totalPrice * 0.15);
  const subtotal = listing.price * totalNights;
  const discount = Math.round(subtotal * 0.05); // Example 5% discount for long stays

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-xl font-semibold flex-grow text-center">Your trip</h2>
      </div>

      <div className="flex border-b border-gray-200 py-3">
        <div className="flex-grow">
          <h3 className="text-sm text-gray-500">Dates</h3>
          <p className="font-medium">
            {formatDate(selectedDates.checkIn)} - {formatDate(selectedDates.checkOut)}
          </p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="text-sm text-blue-600 font-medium"
        >
          Edit
        </button>
      </div>

      <div className="flex border-b border-gray-200 py-3">
        <div className="flex-grow">
          <h3 className="text-sm text-gray-500">Guests</h3>
          <div className="flex items-center">
            <button 
              onClick={() => guests > 1 && setGuests(guests - 1)}
              className="border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
              disabled={guests <= 1}
            >
              -
            </button>
            <span className="mx-3">{guests}</span>
            <button 
              onClick={() => guests < (listing.maxGuests || 4) && setGuests(guests + 1)}
              className="border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
              disabled={guests >= (listing.maxGuests || 4)}
            >
              +
            </button>
          </div>
        </div>
        <button className="text-sm text-blue-600 font-medium">Edit</button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Price details</h3>
        <div className="flex justify-between mb-2">
          <span>{listing.price} SEK × {totalNights} nights</span>
          <span>{subtotal} SEK</span>
        </div>
        {totalNights >= 7 && (
          <div className="flex justify-between mb-2">
            <span>Long stay discount</span>
            <span className="text-green-600">-{discount} SEK</span>
          </div>
        )}
        <div className="flex justify-between mb-2">
          <span>Service fee</span>
          <span>{serviceFee} SEK</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
          <span>Total (SEK)</span>
          <span>{totalPrice} SEK</span>
        </div>
        <button className="text-sm text-blue-600 mt-2">More info</button>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-600">
        <p>This property requires a 1,000 SEK security deposit. The property is covered by our host guarantee.</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Pay with</h3>
        <div className="flex border-b border-gray-200 py-3">
          <div className="flex-grow">
            <span>Credit or debit card</span>
          </div>
          <button className="text-sm text-blue-600 font-medium">Edit</button>
        </div>
        
        <button className="text-blue-600 border border-gray-300 rounded-lg py-3 px-4 w-full mt-3 text-sm">
          Enter a coupon
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold mb-1">Cancellation policy</h3>
        <p className="text-sm text-gray-600 mb-1">This reservation is non-refundable.</p>
        <button className="text-sm text-blue-600">Learn more</button>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold mb-2">Ground rules</h3>
        <p className="text-sm text-gray-600 mb-3">We ask every guest to remember a few simple things about what makes a great guest.</p>
        <p className="text-sm text-gray-600 mb-1">• Follow the house rules</p>
        <p className="text-sm text-gray-600">• Treat your host's home like your own</p>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>By pressing the button below, I agree to the rental terms and host's terms. I agree that charges can be made to my payment method if I'm responsible for damage.</p>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => onContinue(guests)}
          className="bg-blue-600 text-white py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition"
        >
          Continue and pay
        </button>
      </div>
    </div>
  );
};

// Message Host Step Component
export const MessageHostStep: React.FC<{
  listing: Listing;
  onContinue: (message: string) => void;
  onSkip: () => void;
  onBack: () => void;
}> = ({ listing, onContinue, onSkip, onBack }) => {
  const [message, setMessage] = useState<string>("");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-xl font-semibold flex-grow text-center">Questions about this home?</h2>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-800 mb-2">{listing.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
        <p className="font-medium">{listing.price} SEK <span className="text-gray-500 font-normal">/ night</span></p>
      </div>

      {listing.images && listing.images[0] && (
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
        <p className="text-xs text-red-500 mb-2">* Required</p>
        <textarea
          placeholder="For example: Is this home family-friendly? What other homes should I consider?"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <div className="flex flex-col space-y-3 mt-6">
        <button 
          onClick={() => onContinue(message)}
          className="bg-blue-600 text-white py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition"
          disabled={!message.trim()}
        >
          Send message
        </button>
        <button 
          onClick={onSkip}
          className="border border-gray-300 py-3 rounded-lg w-full font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

// Booking Confirmation Step Component
export const BookingConfirmationStep: React.FC<{
  listing: Listing;
  selectedDates: SelectedDates;
  totalPrice: number;
  totalNights: number;
  guests: number;
  message?: string;
  onConfirm: () => void;
  onBack: () => void;
}> = ({ listing, selectedDates, totalPrice, totalNights, guests, message, onConfirm, onBack }) => {
  
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };

  const reservationNumber = "RES" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-xl font-semibold flex-grow text-center">Confirm your booking</h2>
      </div>

      <div className="rounded-lg overflow-hidden mb-6 h-40 relative">
        {listing.images && listing.images[0] ? (
          <Image 
            src={listing.images[0]} 
            alt={listing.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
        <p className="text-gray-600">{listing.location}</p>
        <div className="flex items-center mt-2 text-sm">
          <span className="mr-1">★</span>
          <span>{listing.rating || "4.9"}</span>
          <span className="mx-1">·</span>
          <span>{listing.reviewCount || "42"} reviews</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-semibold text-lg mb-3">Reservation details</h3>
        
        <div className="mb-4">
          <h4 className="text-gray-600 text-sm">Dates</h4>
          <p className="font-medium">{formatDate(selectedDates.checkIn)} - {formatDate(selectedDates.checkOut)}</p>
          <p className="text-sm text-gray-600">{totalNights} nights</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-gray-600 text-sm">Guests</h4>
          <p className="font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-gray-600 text-sm">Reservation number</h4>
          <p className="font-medium font-mono">{reservationNumber}</p>
        </div>
        
        {message && (
          <div className="mb-4">
            <h4 className="text-gray-600 text-sm">Message to host</h4>
            <p className="text-sm border border-gray-200 p-3 rounded-lg bg-gray-50 mt-1">
              {message}
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-semibold text-lg mb-3">Price details</h3>
        <div className="flex justify-between mb-2 text-sm">
          <span>{listing.price} SEK × {totalNights} nights</span>
          <span>{listing.price * totalNights} SEK</span>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Service fee</span>
          <span>{Math.round(totalPrice * 0.15)} SEK</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
          <span>Total (SEK)</span>
          <span>{totalPrice} SEK</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Cancellation policy</h3>
        <p className="text-sm text-gray-600">
          Free cancellation before {formatDate(selectedDates.checkIn)}. After that, the reservation is non-refundable.
        </p>
      </div>

      <div className="mb-6">
        <button 
          onClick={onConfirm}
          className="bg-blue-600 text-white py-3 rounded-lg w-full font-medium hover:bg-blue-700 transition"
        >
          Confirm and pay
        </button>
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
  const [step, setStep] = useState<number>(1);
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  
  const router = useRouter();

  const handleDetailsSubmit = (guestCount: number) => {
    setGuests(guestCount);
    setStep(2);
  };

  const handleMessageSubmit = (hostMessage: string) => {
    setMessage(hostMessage);
    setStep(3);
  };

  const handleSkipMessage = () => {
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return;
    
    const bookingData: BookingData = {
      listingId: listing._id,
      startDate: selectedDates.checkIn.toISOString(),
      endDate: selectedDates.checkOut.toISOString(),
      totalPrice,
      guests,
      message: message || undefined
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
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {step === 1 && (
        <BookingDetailsStep 
          listing={listing}
          selectedDates={selectedDates}
          totalPrice={totalPrice}
          totalNights={totalNights}
          onContinue={handleDetailsSubmit}
          onBack={handleBack}
        />
      )}
      
      {step === 2 && (
        <MessageHostStep 
          listing={listing}
          onContinue={handleMessageSubmit}
          onSkip={handleSkipMessage}
          onBack={handleBack}
        />
      )}
      
      {step === 3 && (
        <BookingConfirmationStep 
          listing={listing}
          selectedDates={selectedDates}
          totalPrice={totalPrice}
          totalNights={totalNights}
          guests={guests}
          message={message}
          onConfirm={handleConfirmBooking}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default BookingFlow;