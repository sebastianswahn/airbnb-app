import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import Review from "@/models/review";
import User from "@/models/user";

export async function GET(request) {
  try {
    // Get URL search params for filtering
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Default to higher limit for map view
    
    await dbConnect();
    console.log("DB Connected successfully");
    
    // Build query object based on filters
    const query = {};
    
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Determine sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortBy.startsWith("-") ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    // Fetch filtered listings
    const listings = await Listing.find(query)
      .skip(skip)
      .limit(limit)
      .populate("host", "name avatar") // Populate basic host info
      .sort(sortOptions)
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
    
    // Count total listings for pagination info (optional)
    const totalListings = await Listing.countDocuments(query);
    
    // Return response with pagination info
    return NextResponse.json({
      listings: listingsWithReviews,
      pagination: {
        total: totalListings,
        page,
        limit,
        pages: Math.ceil(totalListings / limit)
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}