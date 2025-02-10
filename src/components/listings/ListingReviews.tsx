"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "@/types/listing"; // Import the existing Review type

interface MobileReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

const MobileReviews: React.FC<MobileReviewsProps> = ({
  reviews,
  rating,
  reviewCount,
}) => {
  const [currentReview, setCurrentReview] = useState(0);

  const handlePrevReview = () => {
    setCurrentReview((prev) => (prev > 0 ? prev - 1 : reviews.length - 1));
  };

  const handleNextReview = () => {
    setCurrentReview((prev) => (prev < reviews.length - 1 ? prev + 1 : 0));
  };

  if (!reviews || reviews.length === 0) return null;

  const currentReviewData = reviews[currentReview];

  return (
    <div className="flex flex-col w-full bg-white space-y-4">
      {/* Header with Rating Summary */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-base">★</span>
        <span className="text-base font-medium">{rating.toFixed(2)}</span>
        <span className="text-base text-gray-600">·</span>
        <span className="text-base">{reviewCount} reviews</span>
      </div>

      {/* Review Card Container */}
      <div className="relative">
        {/* Border Container */}
        <div className="border border-gray-200 rounded-md mx-4">
          <div className="px-4 py-5 min-h-[180px]">
            {/* User Info */}
            <div className="flex items-start space-y-1 flex-col">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      currentReviewData.author?.image ||
                      "/images/default-avatar.png"
                    }
                    alt={currentReviewData.author?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-base">
                    {currentReviewData.author?.name || "User"}
                  </p>
                  <p className="text-gray-500 text-sm">Invalid Date</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex pt-2 pb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-base mr-0.5">
                    {i < currentReviewData.rating ? (
                      <span className="text-black">★</span>
                    ) : (
                      <span className="text-gray-300">★</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-base mt-1">
              {currentReviewData.text || currentReviewData.text}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={handlePrevReview}
              className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextReview}
              className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Show All Reviews Button */}
      <button className="w-full mx-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-black text-sm font-medium transition-colors">
        Show all {reviewCount} reviews
      </button>
    </div>
  );
};

export default MobileReviews;
