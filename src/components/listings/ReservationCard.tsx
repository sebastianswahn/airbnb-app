"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ReservationCardProps {
  listing: {
    price: number;
    rating: number;
    reviewCount: number;
    id: string; // Listing ID to fetch bookings
  };
}

interface SelectedDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface BookedDateRange {
  startDate: string;
  endDate: string;
}

export default function ReservationCard({ listing }: ReservationCardProps) {
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    checkIn: null,
    checkOut: null,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalNights, setTotalNights] = useState<number>(0);
  const [bookedDates, setBookedDates] = useState<BookedDateRange[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(
    currentDate.getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    currentDate.getFullYear()
  );

  // Fetch booked dates when component mounts
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setIsLoading(true);
        console.log(`📡 Fetching bookings for listing ID: ${listing.id}`);
        const response = await fetch(`/api/listings/${listing.id}/bookings`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`📋 Fetched ${data.length} booked date ranges`);
          setBookedDates(data);
        } else {
          console.error("❌ Failed to fetch booked dates:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching booked dates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (listing.id) {
      fetchBookedDates();
    }
  }, [listing.id]);

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is booked
  const isDateBooked = (date: Date): boolean => {
    // Set time to midnight for comparison
    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dateTime = dateToCheck.getTime();
    
    return bookedDates.some(booking => {
      // Parse MongoDB ISO date strings
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      // Set times to midnight for fair comparison
      const bookingStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
      const bookingEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0);
      
      return dateTime >= bookingStartDate.getTime() && dateTime <= bookingEndDate.getTime();
    });
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Date is either in the past or already booked
    return date < today || isDateBooked(date);
  };

  const calculateNights = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if a date range overlaps with any booked dates
  const isRangeAvailable = (startDate: Date, endDate: Date): boolean => {
    // Convert dates to timestamps for easier comparison
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    // Check if any day in the range is booked
    for (let dt = start; dt <= end; dt += 86400000) { // 86400000 = 1 day in milliseconds
      if (isDateBooked(new Date(dt))) {
        return false;
      }
    }
    
    return true;
  };

  const handleDateSelect = (day: number): void => {
    const selectedDate = new Date(currentYear, currentMonth, day);

    if (isDateDisabled(selectedDate)) {
      return;
    }

    if (
      !selectedDates.checkIn ||
      (selectedDates.checkIn && selectedDates.checkOut)
    ) {
      setSelectedDates({
        checkIn: selectedDate,
        checkOut: null,
      });
      setTotalPrice(0);
      setTotalNights(0);
    } else {
      if (selectedDate > selectedDates.checkIn) {
        // Check if the entire range is available
        if (!isRangeAvailable(selectedDates.checkIn, selectedDate)) {
          // Alert user that the range contains booked dates
          alert("Some dates in this range are already booked. Please select a different range.");
          return;
        }
        
        const nights = calculateNights(selectedDates.checkIn, selectedDate);

        setSelectedDates((prev) => ({
          ...prev,
          checkOut: selectedDate,
        }));

        setTotalNights(nights);
        setTotalPrice(nights * listing.price);
      }
    }
  };

  const generateCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected =
        (selectedDates.checkIn &&
          date.getTime() === selectedDates.checkIn.getTime()) ||
        (selectedDates.checkOut &&
          date.getTime() === selectedDates.checkOut.getTime());

      const isInRange =
        selectedDates.checkIn &&
        selectedDates.checkOut &&
        date > selectedDates.checkIn &&
        date < selectedDates.checkOut;

      const booked = isDateBooked(date);
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`h-10 w-10 relative flex items-center justify-center text-sm
            ${isSelected ? "text-white" : ""}
            ${isInRange ? "bg-gray-100" : ""}
            ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }
            ${booked ? "bg-red-100" : ""}
            ${!isSelected && !isInRange && !disabled && !booked ? "text-gray-700" : ""}
            transition-colors`}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center
              ${isSelected ? "bg-blue-600 rounded-full" : ""}
              ${booked && !isSelected ? "bg-red-100 rounded-full" : ""}`}
          ></div>
          <span className="relative z-10">{day}</span>
        </button>
      );
    }
    return days;
  };

  // Updated booking handler to redirect to booking page
  const handleBooking = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      setIsSubmitting(true);
      
      // If user is not authenticated, save booking data and redirect to login
      if (!isAuthenticated) {
        console.log('🔒 User not authenticated, redirecting to login');
        
        // Save booking data to localStorage with expiry (24 hours)
        const bookingData = {
          data: {
            checkIn: selectedDates.checkIn.toISOString(),
            checkOut: selectedDates.checkOut.toISOString(),
            price: totalPrice,
            nights: totalNights,
            listingId: listing.id
          },
          expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        
        // Redirect to login with return URL to booking page
        window.location.href = `/login?redirect=${encodeURIComponent(`/listings/${listing.id}/book`)}`;
        return;
      }
      
      // User is authenticated, redirect to booking page
      console.log('📝 Proceeding to booking page...');
      router.push(`/listings/${listing.id}/book?checkIn=${selectedDates.checkIn.toISOString()}&checkOut=${selectedDates.checkOut.toISOString()}&price=${totalPrice}&nights=${totalNights}`);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4" data-component="reservation-card">
      <div className="text-center mb-4">
        <span className="text-2xl font-semibold">€{listing.price}</span>
        <span className="text-gray-500"> night</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`day-${index}`}
                className="h-8 flex items-center justify-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}
            {generateCalendar()}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear((prev) => prev - 1);
                  } else {
                    setCurrentMonth((prev) => prev - 1);
                  }
                }}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                aria-label="Previous month"
              >
                ←
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear((prev) => prev + 1);
                  } else {
                    setCurrentMonth((prev) => prev + 1);
                  }
                }}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                aria-label="Next month"
              >
                →
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        {selectedDates.checkIn ? (
          <span>{totalNights} nights selected</span>
        ) : (
          <span>Select check-in date</span>
        )}
        {selectedDates.checkIn && selectedDates.checkOut && (
          <span>Total: €{totalPrice}</span>
        )}
      </div>
      
      <div className="mb-4 text-xs flex items-center">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
          <span>Selected</span>
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedDates.checkIn || !selectedDates.checkOut || isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold text-white
          ${
            selectedDates.checkIn && selectedDates.checkOut && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }
          transition-colors`}
      >
        {isSubmitting ? "Processing..." : "Reserve"}
      </button>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-1 text-sm">
          <Image src="/images/star.svg" alt="" width={14} height={14} />
          <span>{listing.rating}</span>
          <span className="text-gray-500">· {listing.reviewCount} reviews</span>
        </div>
      </div>
    </div>
  );
}
