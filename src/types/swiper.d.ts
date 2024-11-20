declare module "swiper/css";
declare module "swiper/css/pagination";
declare module "swiper/css/navigation";
declare module "swiper/css/effect-fade";

declare module "swiper/types" {
  export interface SwiperOptions {
    modules?: any[];
    spaceBetween?: number;
    slidesPerView?: number;
    pagination?: {
      clickable?: boolean;
      bulletActiveClass?: string;
      bulletClass?: string;
    };
    navigation?:
      | boolean
      | {
          nextEl?: string | HTMLElement;
          prevEl?: string | HTMLElement;
        };
    loop?: boolean;
    effect?: string;
    fadeEffect?: {
      crossFade?: boolean;
    };
    speed?: number;
    watchSlidesProgress?: boolean;
    grabCursor?: boolean;
  }
}
