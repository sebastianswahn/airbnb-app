import { NextRequest } from "next/server";
import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import Review from "@/models/review";
import User from "@/models/user";
import mongoose from "mongoose";

interface MongoReview {
  _id: mongoose.Types.ObjectId;
  listing: mongoose.Types.ObjectId;
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  rating: number;
  text?: string;
  createdAt?: Date;
}

interface Host {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface ListingType {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  host: Host;
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  __v: number;
}

interface TransformedHost {
  name: string;
  image: string;
  joinedDate: string;
}

interface TransformedListing extends Omit<ListingType, "host"> {
  host: TransformedHost;
  reviews: {
    _id: string;
    author: {
      name: string;
      image: string;
    };
    rating: number;
    text: string;
    createdAt: Date;
  }[];
  reviewCount: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response(
        JSON.stringify({ error: "Invalid listing ID format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    mongoose.model("User", User.schema);

    const listing = (await Listing.findById(params.id)
      .populate("host", "name avatar role")
      .lean()) as ListingType;

    if (!listing) {
      return new Response(JSON.stringify({ error: "Listing not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const reviews = (await Review.find({
      listing: params.id,
      host: { $exists: false },
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean()) as MongoReview[];

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      reviews.length > 0
        ? Number((totalRating / reviews.length).toFixed(2))
        : 0;

    const transformedListing: TransformedListing = {
      ...listing,
      _id: listing._id.toString(),
      host: {
        name: listing.host?.name || "Anonymous",
        image: listing.host?.avatar || "/images/default-avatar.png",
        joinedDate: "Member since 2024",
      },
      rating: averageRating,
      reviewCount: reviews.length,
      reviews: reviews.map((review) => ({
        _id: review._id.toString(),
        author: {
          name: review.user.name,
          image: review.user.avatar || "/images/default-avatar.png",
        },
        rating: review.rating,
        text: review.text || "",
        createdAt: review.createdAt || new Date(),
      })),
    };

    return new Response(JSON.stringify(transformedListing), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching listing:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        error: "Unable to fetch listing",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
