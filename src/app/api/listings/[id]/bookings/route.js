import dbConnect from "@/utils/db";
import Booking from "@/models/booking";
import Listing from "@/models/listing";
import { authenticate } from "@/middleware/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Main POST endpoint for creating bookings
export async function POST(request) {
  await dbConnect();
  
  try {
    // Use your existing authentication middleware
    // If authenticate returns a response, it means there was an auth error
    const authResponse = await authenticate(request);
    if (authResponse) {
      // Return a clear message about authentication failure
      return NextResponse.json(
        { error: "Authentication required. Please log in to make a booking." },
        { status: 401 }
      );
    }
    
    // Get the authenticated user's ID from the request object
    // This depends on how your auth middleware attaches user info
    const userId = request.user.id;
    const body = await request.json();
    
    if (!body.listing) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }
    
    // Convert string IDs to MongoDB ObjectIds
    const listingId = new mongoose.Types.ObjectId(body.listing);
    const guestId = new mongoose.Types.ObjectId(userId);
    
    // Get the listing to find the host
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }
    
    // Get the host ID from the listing
    const hostId = listing.host;
    
    // Create new booking with all required fields
    const newBooking = new Booking({
      listing: listingId,
      guest: guestId,
      host: hostId,
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: body.totalPrice,
    });
    
    // Save the new booking
    await newBooking.save();
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Unable to create booking" },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving user's bookings
export async function GET(request) {
  await dbConnect();
  
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
    const userId = request.user.id;
    const guestId = new mongoose.Types.ObjectId(userId);
    
    // Get all bookings for this user as a guest
    const bookings = await Booking.find({ guest: guestId })
      .populate('listing', 'name location images price')
      .sort({ startDate: -1 });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Unable to fetch bookings" },
      { status: 500 }
    );
  }
}