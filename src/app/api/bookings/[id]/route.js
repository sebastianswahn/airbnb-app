import { NextResponse } from "next/server";
import dbConnect from "@/utils/db.js";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import Booking from "@/models/booking";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    // If no token found
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId;
    try {
      // Verify the token
      const decoded = verifyToken(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Find the booking by ID
    const booking = await Booking.findById(id)
      .populate({
        path: 'listing',
        select: 'name images location'
      })
      .populate({
        path: 'host',
        select: 'name'
      })
      .lean();

    // Check if booking exists
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the booking belongs to the authenticated user
    if (booking.guest.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to view this booking" },
        { status: 403 }
      );
    }

    // Format the booking data
    const formattedBooking = {
      ...booking,
      _id: booking._id.toString(),
      listing: {
        ...booking.listing,
        _id: booking.listing._id.toString()
      },
      host: booking.host ? {
        _id: booking.host._id.toString(),
        name: booking.host.name
      } : null,
      guest: booking.guest.toString(),
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      createdAt: booking.createdAt?.toISOString(),
      updatedAt: booking.updatedAt?.toISOString()
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error(`Error in GET /api/bookings/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}