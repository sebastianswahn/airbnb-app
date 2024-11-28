"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ListingCardProps {
  listing: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    price: number;
    rating?: number;
    distance?: string;
    availableDates?: string;
  };
  showTotalPrice?: boolean;
}

export default function ListingCard({
  listing,
  showTotalPrice = false,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative group">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
          }}
          loop={true}
          className="h-full group-hover:opacity-95 transition"
        >
          {listing.images.map((image, index) => (
            <SwiperSlide key={index}>
              <Link href={`/listings/${listing._id}`}>
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}

          <div className="swiper-pagination !bottom-2 !z-10" />

          <button className="swiper-button-prev !left-2 !text-white !w-7 !h-7 !bg-black/30 rounded-full !after:text-[12px]" />
          <button className="swiper-button-next !right-2 !text-white !w-7 !h-7 !bg-black/30 rounded-full !after:text-[12px]" />
        </Swiper>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 p-2 hover:scale-110 transition"
        >
          <Image
            src={isLiked ? "/images/heart-filled.svg" : "/images/heart.svg"}
            alt="Like"
            width={24}
            height={24}
            className={isLiked ? "filter-none" : "filter brightness-0 invert"}
          />
        </button>
      </div>

      <Link href={`/listings/${listing._id}`}>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <h3 className="font-medium text-[15px] text-black-600">
              {listing.location}
            </h3>
            {listing.rating && (
              <div className="flex items-center gap-1">
                <Image
                  src="/images/star.svg"
                  alt="Rating"
                  width={12}
                  height={12}
                />
                <span className="text-[15px]">{listing.rating}</span>
              </div>
            )}
          </div>

          {listing.distance && (
            <p className="text-[15px] text-grey-700">{listing.distance}</p>
          )}

          {listing.availableDates && (
            <p className="text-[15px] text-grey-700">
              {listing.availableDates}
            </p>
          )}

          <p className="text-[15px] mt-1">
            <span className="font-semibold text-black-600">
              ₹
              {showTotalPrice
                ? (listing.price * 5).toLocaleString()
                : listing.price.toLocaleString()}
            </span>{" "}
            {showTotalPrice ? "total" : "night"}
          </p>
        </div>
      </Link>
    </div>
  );
}
