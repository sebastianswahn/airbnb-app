// utils/getListingsWithReviews.ts
import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import Review from "@/models/review";
import { Types } from "mongoose";

interface LeanUser {
  _id: Types.ObjectId;
  name: string;
  avatar?: string;
}

interface LeanReview {
  _id: Types.ObjectId;
  listing: Types.ObjectId;
  user: LeanUser;
  rating: number;
  text?: string;
  createdAt: Date;
}

interface LeanListing {
  _id: Types.ObjectId;
  name: string;
  description: string;
  location: string;
  price: number;
  host: LeanUser;
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface ReviewsByListing {
  [key: string]: LeanReview[];
}

export async function getListingsWithReviews() {
  await dbConnect();

  try {
    const listings = await Listing.find()
      .populate("host", "name avatar")
      .lean<LeanListing[]>();

    const listingIds = listings.map((listing) => listing._id);

    const reviews = await Review.find({
      listing: { $in: listingIds },
    })
      .populate("user", "name avatar")
      .lean<LeanReview[]>();

    const reviewsByListing = reviews.reduce<ReviewsByListing>((acc, review) => {
      const listingId = review.listing.toString();
      if (!acc[listingId]) {
        acc[listingId] = [];
      }
      acc[listingId].push(review);
      return acc;
    }, {});

    const listingsWithReviews = listings.map((listing) => {
      const listingId = listing._id.toString();
      const listingReviews = reviewsByListing[listingId] || [];

      const totalRating = listingReviews.reduce(
        (sum: number, review: LeanReview) => {
          return sum + review.rating;
        },
        0
      );

      const averageRating =
        listingReviews.length > 0
          ? Number((totalRating / listingReviews.length).toFixed(2))
          : 0;

      return {
        ...listing,
        _id: listingId,
        host: {
          _id: listing.host._id.toString(),
          name: listing.host.name,
          avatar: listing.host.avatar,
        },
        rating: averageRating,
        reviewCount: listingReviews.length,
        reviews: listingReviews.map((review) => ({
          _id: review._id.toString(),
          rating: review.rating,
          text: review.text,
          user: {
            _id: review.user._id.toString(),
            name: review.user.name,
            avatar: review.user.avatar,
          },
          createdAt: review.createdAt,
        })),
      };
    });

    return listingsWithReviews;
  } catch (error) {
    console.error("Error fetching listings with reviews:", error);
    throw error;
  }
}
