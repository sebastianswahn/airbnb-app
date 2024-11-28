import type { SwiperOptions } from "swiper/types";

export const swiperConfig: SwiperOptions = {
  spaceBetween: 0,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    clickable: true,
  },
  loop: true,
  speed: 500,
  grabCursor: true,
};

export const swiperStyles = [
  "swiper/css",
  "swiper/css/navigation",
  "swiper/css/pagination",
];
