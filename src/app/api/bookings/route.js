import dbConnect from "../../../utils/db";
import Booking from "../../../models/booking";
import { authenticate } from "../../../middleware/auth";

export async function GET(req) {
  await dbConnect();
  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const userId = req.user.id;

    const bookings = await Booking.find({ guest: userId }).populate("listing");

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch bookings" }), {
      status: 500,
    });
  }
}

import dbConnect from "../../../utils/db";
import Booking from "../../../models/booking";
import { authenticate } from "../../../middleware/auth";

export async function POST(req) {
  await dbConnect();
  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const userId = req.user.id;
    const body = await req.json();

    const newBooking = new Booking({
      ...body,
      guest: userId,
    });

    await newBooking.save();

    return new Response(JSON.stringify(newBooking), { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(JSON.stringify({ error: "Unable to create booking" }), {
      status: 500,
    });
  }
}
