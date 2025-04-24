"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAuth } from "@/context/AuthContext";

interface DesktopReservationCardProps {
  listing: {
    price: number;
    rating: number;
    reviewCount: number;
    id: string;
  };
}

const DesktopReservationCard: React.FC<DesktopReservationCardProps> = ({
  listing
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 5),
    key: "selection",
  });

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/listings/${listing.id}/bookings`);
        
        if (response.ok) {
          const data = await response.json();
          setBookedDates(data);
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (listing.id) {
      fetchBookedDates();
    }
  }, [listing.id]);

  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  // Calculate the number of nights between the selected dates
  const nights = Math.ceil(
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate the total price based on the number of nights
  const totalPrice = nights * listing.price;
  
  const handleBooking = () => {
    if (isAuthenticated) {
      router.push(
        `/listings/${listing.id}/book?checkIn=${dateRange.startDate.toISOString()}&checkOut=${dateRange.endDate.toISOString()}&price=${totalPrice}&nights=${nights}`
      );
    } else {
      // Save booking data to localStorage
      const bookingData = {
        data: {
          checkIn: dateRange.startDate.toISOString(),
          checkOut: dateRange.endDate.toISOString(),
          price: totalPrice,
          nights: nights,
          listingId: listing.id
        },
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Redirect to login with return URL to booking page
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listing.id}/book`)}`);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xl font-semibold">{listing.price} SEK</span>
          <span className="text-gray-500"> night</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Image src="/images/star.svg" alt="Star" width={14} height={14} />
          <span>{listing.rating.toFixed(1)}</span>
          <span className="text-gray-500">· {listing.reviewCount} reviews</span>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
        <div 
          className="flex border-b border-gray-300 cursor-pointer"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <div className="flex-1 p-3 border-r border-gray-300">
            <div className="text-xs font-semibold">CHECK-IN</div>
            <div>{format(dateRange.startDate, "MMM d, yyyy")}</div>
          </div>
          <div className="flex-1 p-3">
            <div className="text-xs font-semibold">CHECKOUT</div>
            <div>{format(dateRange.endDate, "MMM d, yyyy")}</div>
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-300">
          <div className="text-xs font-semibold">GUESTS</div>
          <select 
            className="w-full bg-transparent border-none p-0 focus:outline-none"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
      </div>
      
      {showCalendar && (
        <div className="mb-4">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            minDate={new Date()}
            className="w-full"
          />
        </div>
      )}
      
      <button
        onClick={handleBooking}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
      >
        Reserve
      </button>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <div className="text-gray-700">{listing.price} SEK × {nights} nights</div>
          <div>{listing.price * nights} SEK</div>
        </div>
        <div className="flex justify-between font-semibold pt-3 mt-3 border-t border-gray-200">
          <div>Total</div>
          <div>{totalPrice} SEK</div>
        </div>
      </div>
    </div>
  );
};

export default DesktopReservationCard;