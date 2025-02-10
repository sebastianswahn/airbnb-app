import React, { useState } from "react";
import { Calendar } from "lucide-react";

interface SelectedDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface BookingCalendarProps {
  pricePerNight: number;
  currency?: string;
  minStay?: number;
  maxStay?: number;
  onReserve?: (dates: SelectedDates) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  pricePerNight,
  currency = "₹",
  minStay = 1,
  maxStay = 30,
  onReserve,
}) => {
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    checkIn: null,
    checkOut: null,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(
    currentDate.getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    currentDate.getFullYear()
  );

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const calculateNights = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    } else {
      if (selectedDate > selectedDates.checkIn) {
        const nights = calculateNights(selectedDates.checkIn, selectedDate);

        if (nights < minStay) {
          alert(`Minimum stay is ${minStay} nights`);
          return;
        }

        if (nights > maxStay) {
          alert(`Maximum stay is ${maxStay} nights`);
          return;
        }

        setSelectedDates((prev) => ({
          ...prev,
          checkOut: selectedDate,
        }));

        setTotalPrice(nights * pricePerNight);
      }
    }
  };

  const generateCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: JSX.Element[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Calendar days
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

      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`h-10 w-10 rounded-full flex items-center justify-center
            ${isSelected ? "bg-blue-500 text-white" : ""}
            ${isInRange ? "bg-blue-100" : ""}
            ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-blue-200"
            }
            transition-colors`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReserve = (): void => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      onReserve?.(selectedDates);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-row items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h3 className="font-semibold">Select dates</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((prev) => prev - 1);
              } else {
                setCurrentMonth((prev) => prev - 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="font-medium">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((prev) => prev + 1);
              } else {
                setCurrentMonth((prev) => prev + 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="py-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-10 w-10 flex items-center justify-center text-sm text-gray-500"
            >
              {day.charAt(0)}
            </div>
          ))}
          {generateCalendar()}
        </div>

        {selectedDates.checkIn && (
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Check-in: {formatDate(selectedDates.checkIn)}
              {selectedDates.checkOut &&
                ` → Check-out: ${formatDate(selectedDates.checkOut)}`}
            </p>
          </div>
        )}

        {selectedDates.checkIn && selectedDates.checkOut && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Price:</span>
              <span className="font-semibold">
                {currency}
                {totalPrice}
              </span>
            </div>
            <button
              onClick={handleReserve}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reserve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
