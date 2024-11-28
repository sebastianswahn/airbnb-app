"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Listing {
  _id: string;
  title: string;
  location: string;
  distance: string;
  dates: string;
  price: number;
  rating?: number | string;
  images: string[];
}

interface ListingGridProps {
  initialListings: Listing[];
}

export default function ListingGrid({ initialListings }: ListingGridProps) {
  const [listings] = useState(initialListings);

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 xl:gap-y-9 gap-y-5">
      {listings.map((listing) => (
        <div
          key={listing._id}
          className="relative md:bg-transparent bg-white md:rounded-none rounded-xl"
        >
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {listing.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div>
                  <Image
                    src={image}
                    alt={`${listing.title} - Image ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full object-cover object-center rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-start justify-between md:pt-2 pt-3 md:px-0 px-2.5 md:pb-0 pb-[7px]">
            <div>
              <h2 className="xl:text-base sm:text-sm text-[15px] leading-[19px] text-black-600 font-normal">
                {listing.title}
              </h2>
              <p className="text-sm text-gray-600">{listing.distance}</p>
              <p className="text-sm text-gray-600">{listing.dates}</p>
              <p className="text-sm">
                <span className="font-semibold">₹{listing.price}</span>{" "}
                <span className="font-normal sm:text-sm text-[15px] leading-[19px]">
                  night
                </span>
              </p>
            </div>
            {listing.rating && (
              <div className="text-sm gap-1 flex items-center font-normal text-grey-700">
                {listing.rating}
                <Image src="/star.svg" alt="Rating" width={12} height={12} />
              </div>
            )}
          </div>

          <button
            className="absolute top-[17px] right-[18px] z-[2]"
            aria-label="Add to favorites"
          >
            <Image
              src="/heart.svg"
              alt="Heart"
              width={24}
              height={24}
              className="xl:h-auto h-5"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
