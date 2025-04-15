// app/api/bookings/route.js
import dbConnect from "@/utils/db";
import Booking from "@/models/booking";
import Listing from "@/models/listing";
import { authenticate } from "@/middleware/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// POST endpoint for creating new bookings
export async function POST(request) {
  console.log("📝 POST request to /api/bookings");
  await dbConnect();
  
  try {
    // Use your authentication middleware
    const authResponse = await authenticate(request);
    if (authResponse) {
      console.log("❌ Authentication failed:", authResponse.status);
      // Return the auth error response
      return authResponse;
    }
    
    // Get the authenticated user's ID from the request object
    const userId = request.user.id;
    console.log(`✅ User authenticated: ${userId}`);
    
    // Parse the request body
    const body = await request.json();
    console.log("📋 Booking request data:", body);
    
    // Validate required fields
    if (!body.listing || !body.startDate || !body.endDate || !body.totalPrice) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Convert string IDs to MongoDB ObjectIds
    const listingId = new mongoose.Types.ObjectId(body.listing);
    const guestId = new mongoose.Types.ObjectId(userId);
    
    // Get the listing to find the host
    const listing = await Listing.findById(listingId);
    if (!listing) {
      console.log(`❌ Listing not found: ${body.listing}`);
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }
    
    // Get the host ID from the listing
    const hostId = listing.host;
    console.log(`📋 Host ID: ${hostId}`);
    
    // Check for date conflicts with existing bookings
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      $or: [
        // New booking starts during an existing booking
        {
          startDate: { $lte: new Date(body.startDate) },
          endDate: { $gte: new Date(body.startDate) }
        },
        // New booking ends during an existing booking
        {
          startDate: { $lte: new Date(body.endDate) },
          endDate: { $gte: new Date(body.endDate) }
        },
        // New booking contains an existing booking
        {
          startDate: { $gte: new Date(body.startDate) },
          endDate: { $lte: new Date(body.endDate) }
        }
      ]
    });
    
    if (conflictingBooking) {
      console.log("❌ Date conflict with existing booking");
      return NextResponse.json(
        { error: "Selected dates are no longer available" },
        { status: 409 }
      );
    }
    
    // Create new booking with all required fields
    const newBooking = new Booking({
      listing: listingId,
      guest: guestId,
      host: hostId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      totalPrice: body.totalPrice,
      status: "confirmed" // Default status
    });
    
    // Save the new booking
    await newBooking.save();
    console.log(`✅ Booking created with ID: ${newBooking._id}`);
    
    return NextResponse.json(
      { 
        message: "Booking created successfully",
        bookingId: newBooking._id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Unable to create booking", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving user's bookings
export async function GET(request) {
  console.log("📝 GET request to /api/bookings");
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
      
    console.log(`📋 Found ${bookings.length} bookings for user ${userId}`);
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Unable to fetch bookings" },
      { status: 500 }
    );
  }
}