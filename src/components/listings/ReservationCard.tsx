"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import type { Listing } from "@/types/listing";

interface ReservationCardProps {
  listing: {
    price: number;
    rating: number;
    reviewCount: number;
  };
}

interface SelectedDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

export default function ReservationCard({ listing }: ReservationCardProps) {
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    checkIn: null,
    checkOut: null,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalNights, setTotalNights] = useState<number>(0);

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
      setTotalNights(0);
    } else {
      if (selectedDate > selectedDates.checkIn) {
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
            ${!isSelected && !isInRange && !disabled ? "text-gray-700" : ""}
            transition-colors`}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center
              ${isSelected ? "bg-blue-600 rounded-full" : ""}`}
          ></div>
          <span className="relative z-10">{day}</span>
        </button>
      );
    }
    return days;
  };

  return (
    <div className="w-full bg-white">
      <div className="text-center mb-4">
        <span className="text-2xl font-semibold">₹{listing.price}</span>
        <span className="text-gray-500"> night</span>
      </div>

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

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        {selectedDates.checkIn ? (
          <span>{totalNights} nights selected</span>
        ) : (
          <span>Select check-in date</span>
        )}
        {selectedDates.checkIn && selectedDates.checkOut && (
          <span>Total: ₹{totalPrice}</span>
        )}
      </div>

      <button
        onClick={() => {
          if (selectedDates.checkIn && selectedDates.checkOut) {
            console.log("Reservation submitted:", {
              dates: selectedDates,
              totalPrice,
            });
          }
        }}
        disabled={!selectedDates.checkIn || !selectedDates.checkOut}
        className={`w-full py-3 rounded-lg font-semibold text-white
          ${
            selectedDates.checkIn && selectedDates.checkOut
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }
          transition-colors`}
      >
        Reserve
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
