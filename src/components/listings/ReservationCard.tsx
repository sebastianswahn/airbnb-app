// components/listings/ReservationCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Listing } from "@/types/listing";

interface ReservationCardProps {
  listing: {
    price: number;
    rating: number;
    reviewCount: number; 
  };
}

export default function ReservationCard({ listing }: ReservationCardProps) {
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(1);

  return (
    <div className="border border-grey-600 rounded-xl p-6 bg-white shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-2xl font-semibold">₹{listing.price}</span>
          <span className="text-gray-500"> night</span>
        </div>
        <div className="flex items-center gap-1">
          <Image src="/images/star.svg" alt="" width={14} height={14} />
          <span>{listing.rating}</span>
          <span className="text-gray-500">· {listing.reviewCount} reviews</span>
        </div>
      </div>

      {/* Rest of your component */}
    </div>
  );
}
