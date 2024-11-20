// components/listings/ListingGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Dialog } from "@headlessui/react";

interface ListingGalleryProps {
  images: string[];
}

export default function ListingGallery({ images }: ListingGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Gallery */}
      <div className="md:hidden block relative">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            type: "fraction",
            el: ".swiper-pagination",
            formatFractionCurrent: (number) =>
              number.toString().padStart(2, "0"),
            formatFractionTotal: (number) => number.toString().padStart(2, "0"),
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          className="mainSwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={`Listing image ${index + 1}`}
                width={768}
                height={512}
                className="w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="absolute left-[27px] top-[51px] swiper-button-prev z-10"
          aria-label="Previous image"
        >
          <Image src="/slide-arw.svg" alt="" width={24} height={24} />
        </button>

        <div className="swiper-pagination max-w-[50px] w-full ml-auto text-[11px] font-roboto font-semibold text-white leading-4 bg-black-600/65 h-[22px] inline-flex items-center justify-center rounded absolute bottom-4 right-3 px-2.5" />
      </div>

      {/* Desktop Gallery Grid */}
      <div className="hidden md:grid grid-cols-4 gap-2 max-w-[1360px] mx-auto px-[26px]">
        <div className="col-span-2 row-span-2">
          <Image
            src={images[0]}
            alt="Main listing image"
            width={683}
            height={683}
            className="w-full h-full object-cover rounded-l-xl"
          />
        </div>
        <div className="grid grid-cols-2 col-span-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Listing image ${index + 2}`}
              width={336}
              height={336}
              className={`w-full h-full object-cover ${
                index === 1
                  ? "rounded-tr-xl"
                  : index === 3
                  ? "rounded-br-xl"
                  : ""
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-6 right-8 bg-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold"
        >
          <Image src="/photo-icon.svg" alt="" width={16} height={16} />
          Show all photos
        </button>
      </div>

      {/* Full Screen Gallery Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-4xl">
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  className="gallery-modal-swiper"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        width={1024}
                        height={768}
                        className="w-full h-full object-contain"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
