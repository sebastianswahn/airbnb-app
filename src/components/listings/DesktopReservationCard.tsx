"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, addDays, isBefore, isAfter, isSameDay, isWithinInterval } from "date-fns";
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

interface BookedDateRange {
  startDate: string;
  endDate: string;
}

const DesktopReservationCard: React.FC<DesktopReservationCardProps> = ({
  listing
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState<BookedDateRange[]>([]);
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
        console.log(`Fetching bookings for listing ID: ${listing.id}`);
        const response = await fetch(`/api/listings/${listing.id}/bookings`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Fetched ${data.length} booked date ranges`);
          setBookedDates(data);
        } else {
          console.error("Failed to fetch booked dates:", response.status);
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

  // Check if a specific date is already booked
  const isDateBooked = (date: Date): boolean => {
    // Set time to midnight for comparison
    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    
    return bookedDates.some(booking => {
      // Parse MongoDB ISO date strings
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      // Set times to midnight for fair comparison
      const bookingStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
      const bookingEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0);
      
      // Check if date is within booked range (inclusive of start and end dates)
      return (
        isWithinInterval(dateToCheck, { 
          start: bookingStartDate, 
          end: bookingEndDate 
        }) || 
        isSameDay(dateToCheck, bookingStartDate) || 
        isSameDay(dateToCheck, bookingEndDate)
      );
    });
  };

  // Create a function to determine which dates should be disabled
  const disabledDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledDays: Date[] = [];

    // Add all dates from 2 years ago until yesterday as disabled
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    for (let d = new Date(twoYearsAgo); d < today; d.setDate(d.getDate() + 1)) {
      disabledDays.push(new Date(d));
    }

    // Add all booked dates as disabled
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    for (let d = new Date(today); d <= nextYear; d.setDate(d.getDate() + 1)) {
      if (isDateBooked(new Date(d))) {
        disabledDays.push(new Date(d));
      }
    }

    return disabledDays;
  }, [bookedDates]);

  // Function to validate if a date range is valid (no booked dates in between)
  const isValidRange = (start: Date, end: Date): boolean => {
    if (!start || !end) return false;
    
    // Check each day in the range
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    for (let time = startTime; time <= endTime; time += 86400000) { // 86400000 = 1 day in ms
      if (isDateBooked(new Date(time))) {
        return false;
      }
    }
    
    return true;
  };

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    
    // Check if the selected range is valid (no booked dates within the range)
    if (isValidRange(startDate, endDate)) {
      setDateRange(ranges.selection);
    } else {
      // If not valid, reset the end date to be the same as start date
      setDateRange({
        ...ranges.selection,
        endDate: ranges.selection.startDate
      });
      
      // Alert the user
      alert("Some dates in this range are already booked. Please select a different range.");
    }
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
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading availability...</p>
        </div>
      ) : showCalendar && (
        <div className="mb-4">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            minDate={new Date()}
            disabledDates={disabledDates}
            className="w-full"
          />
          <div className="flex mt-2 items-center text-xs text-gray-500">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
            <span className="mr-3">Booked dates</span>
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
            <span>Selected dates</span>
          </div>
        </div>
      )}
      
      <button
        onClick={handleBooking}
        disabled={isLoading}
        className={`w-full ${isLoading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 rounded-lg transition`}
      >
        {isLoading ? "Loading..." : "Reserve"}
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