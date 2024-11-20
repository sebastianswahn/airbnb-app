// src/components/CustomSwiper.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

const CustomSwiper = () => {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      pagination={{ clickable: true }}
      navigation={true}
      spaceBetween={30}
      slidesPerView={1}
      className="mySwiper"
    >
      <SwiperSlide>
        <div className="bg-gray-200 p-8">
          <h2 className="text-2xl font-semibold">Slide 1</h2>
          <p>This is the content of the first slide.</p>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-gray-300 p-8">
          <h2 className="text-2xl font-semibold">Slide 2</h2>
          <p>This is the content of the second slide.</p>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-gray-400 p-8">
          <h2 className="text-2xl font-semibold">Slide 3</h2>
          <p>This is the content of the third slide.</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CustomSwiper;
