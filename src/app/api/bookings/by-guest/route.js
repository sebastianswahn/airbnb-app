import dbConnect from "../../../../utils/db";
import Booking from "../../../../models/booking";
import { authenticate } from "../../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const guestId = req.user.id;

    const bookings = await Booking.find({ guest: guestId }).populate("host");

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for guest:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch bookings" }), {
      status: 500,
    });
  }
}
