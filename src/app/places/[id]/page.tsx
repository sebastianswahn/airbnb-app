"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Layout from "@/components/PageLayout";
import { PlaceHeader } from "@/components/places/PlaceHeader";
import { PlaceDetails } from "@/components/places/PlaceDetails";
import { PlaceRules } from "@/components/places/PlaceRules";
import { PlaceHost } from "@/components/places/PlaceHost";
import { PlaceSupport } from "@/components/places/PlaceSupport";

interface PlacePageProps {
  params: {
    id: string;
  };
}

export default function PlacePage({ params }: PlacePageProps) {
  return (
    <Layout>
      <div className="max-w-[768px] w-full">
        <div className="place-main relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            className="placeSwiper"
          >
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <Image
                      src="/images/place-img.png"
                      alt="Place"
                      width={768}
                      height={480}
                      className="w-full object-cover"
                    />
                    <h1 className="text-[32px] max-w-[177px] w-full absolute top-20 left-6 font-semibold font-roboto leading-9 text-white">
                      Your stay at John's place
                    </h1>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          <button className="absolute left-[27px] top-[51px] swiper-button-prev">
            <Image
              src="/images/place-arw.svg"
              alt="Previous"
              width={24}
              height={24}
            />
          </button>

          <button className="absolute right-6 bottom-4 swiper-button-next bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/smallrightarw.svg"
              alt="Next"
              width={16}
              height={16}
            />
          </button>

          <div className="swiper-pagination !bottom-[22px]" />
        </div>

        <PlaceDetails />
        <PlaceRules />
        <PlaceHost />
        <PlaceSupport />
      </div>
    </Layout>
  );
}
