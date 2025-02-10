import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import Review from "@/models/review";
import User from "@/models/user";

export async function GET() {
  try {
    await dbConnect();
    console.log("DB Connected successfully");

    // Fetch all listings first
    const listings = await Listing.find()
      .populate("host", "name avatar") // Populate basic host info
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Get all listing IDs
    const listingIds = listings.map((listing) => listing._id);

    // Fetch all reviews for these listings in a single query
    const reviews = await Review.find({
      listing: { $in: listingIds },
    }).lean();

    // Group reviews by listing
    const reviewsByListing = reviews.reduce((acc, review) => {
      const listingId = review.listing.toString();
      if (!acc[listingId]) {
        acc[listingId] = [];
      }
      acc[listingId].push(review);
      return acc;
    }, {});

    // Add review data to listings
    const listingsWithReviews = listings.map((listing) => {
      const listingId = listing._id.toString();
      const listingReviews = reviewsByListing[listingId] || [];

      // Calculate average rating
      const totalRating = listingReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        listingReviews.length > 0
          ? Number((totalRating / listingReviews.length).toFixed(2))
          : 0;

      return {
        ...listing,
        _id: listing._id.toString(),
        host: listing.host
          ? {
              _id: listing.host._id.toString(),
              name: listing.host.name,
              avatar: listing.host.avatar,
            }
          : null,
        rating: averageRating,
        reviewCount: listingReviews.length,
      };
    });

    return NextResponse.json(listingsWithReviews);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
