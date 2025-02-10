"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Dialog } from "@headlessui/react";
import { IMAGES } from "@/constants/images";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ListingGalleryProps {
  images: string[];
}

export default function ListingGallery({ images }: ListingGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mobile Gallery */}
      <div className="md:hidden block relative">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
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
          onSlideChange={() => setShowHint(false)}
          className="relative w-full h-[300px] group"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Listing image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
          {/* Custom Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Swipe Hint Animation */}
          {showHint && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fade-out">
                <svg
                  className="w-4 h-4 animate-swipe-hint"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Swipe to view more
              </div>
            </div>
          )}

          {/* Custom Pagination */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/65 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="swiper-pagination" />
          </div>
        </Swiper>
      </div>

      {/* Desktop Gallery Grid */}
      <div className="hidden md:grid grid-cols-4 gap-2 max-w-[1360px] mx-auto px-[26px]">
        <div className="col-span-2 row-span-2 relative aspect-square">
          <Image
            src={images[0]}
            alt="Main listing image"
            fill
            className="object-cover rounded-l-xl"
            priority
          />
        </div>
        <div className="grid grid-cols-2 col-span-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image}
                alt={`Listing image ${index + 2}`}
                fill
                className={`object-cover ${
                  index === 1
                    ? "rounded-tr-xl"
                    : index === 3
                    ? "rounded-br-xl"
                    : ""
                }`}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-6 right-8 bg-white/90 hover:bg-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors shadow-md"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 8V4h4" />
            <path d="M20 8V4h-4" />
            <path d="M4 16v4h4" />
            <path d="M20 16v4h-4" />
          </svg>
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
          <div className="fixed inset-0 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-6xl">
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{
                      type: "fraction",
                      formatFractionCurrent: (number) =>
                        number.toString().padStart(2, "0"),
                      formatFractionTotal: (number) =>
                        number.toString().padStart(2, "0"),
                    }}
                    navigation={{
                      prevEl: ".modal-swiper-button-prev",
                      nextEl: ".modal-swiper-button-next",
                    }}
                    spaceBetween={20}
                    slidesPerView={1}
                    className="h-[80vh] w-full group"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image}
                            alt={`Listing image ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}

                    <button
                      className="modal-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <button
                      className="modal-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>

                    <button
                      className="modal-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>

                    <div className="absolute bottom-4 right-4 z-10 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <div className="swiper-pagination" />
                    </div>
                  </Swiper>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
