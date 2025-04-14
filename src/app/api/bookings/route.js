import { NextResponse } from "next/server";
import dbConnect from "@/utils/db.js";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import Booking from "@/models/booking";

export async function GET(request) {
  try {
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

    console.log("Fetching bookings for userId:", userId);

    // Find all bookings for this user and populate the listing details
    const bookings = await Booking.find({ guest: userId })
      .populate({
        path: 'listing',
        select: 'name images location'
      })
      .populate({
        path: 'host',
        select: 'name'
      })
      .sort({ startDate: -1 })
      .lean();

    console.log(`Found ${bookings.length} bookings`);

    // Transform dates to strings for JSON serialization
    const formattedBookings = bookings.map(booking => ({
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
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Error in GET /api/bookings:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}