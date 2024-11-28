import Image from "next/image";
import type { Review } from "@/types/listing";

interface ListingReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ListingReviews({
  reviews,
  rating,
  reviewCount,
}: ListingReviewsProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <div className="flex items-center gap-2 mb-6">
        <Image src="/images/star.svg" alt="" width={16} height={16} />
        <h2 className="text-[22px] font-semibold">
          {rating.toFixed(2)} · {reviewCount} reviews
        </h2>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={review.author.image}
                alt={review.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{review.author.name}</h3>
                <p className="text-gray-500">{review.date}</p>
              </div>
            </div>
            <p>{review.content}</p>
          </div>
        ))}
      </div>

      {reviews.length > 0 && (
        <button className="mt-6 w-full py-3 border border-black-600 rounded-lg font-semibold">
          Show all {reviewCount} reviews
        </button>
      )}
    </div>
  );
}
