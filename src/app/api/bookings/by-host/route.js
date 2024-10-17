import dbConnect from "../../../../utils/db";
import Booking from "../../../../models/booking";
import { authenticate } from "../../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const hostId = req.user.id;

    const bookings = await Booking.find({ host: hostId }).populate("guest");

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for host:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch bookings" }), {
      status: 500,
    });
  }
}
