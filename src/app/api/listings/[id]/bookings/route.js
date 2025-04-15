// app/api/listings/[id]/bookings/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Booking from "@/models/booking";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Connect to database
    await dbConnect();
    
    console.log(`📝 GET request to /api/listings/${id}/bookings`);
    
    // Convert string ID to MongoDB ObjectId
    const listingId = new mongoose.Types.ObjectId(id);
    
    // Only fetch bookings for this specific listing
    const bookings = await Booking.find({ 
      listing: listingId 
    })
    .select('startDate endDate')
    .lean();
    
    console.log(`📋 Found ${bookings.length} bookings for listing ${id}`);
    
    // Format dates for the front-end
    const bookedDateRanges = bookings.map(booking => ({
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString()
    }));
    
    return NextResponse.json(bookedDateRanges);
  } catch (error) {
    console.error(`Error fetching bookings for listing ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch booking data", details: error.message },
      { status: 500 }
    );
  }
}