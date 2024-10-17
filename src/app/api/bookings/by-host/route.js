import dbConnect from "../../../../utils/db";
import Booking from "../../../../models/booking";
import { authenticate } from "../../../../middleware/auth";
import User from "../../../../models/user";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const hostId = req.user.id;

    // Kontrollera att användaren verkligen är en host
    if (req.user.role !== "host") {
      return new Response(
        JSON.stringify({
          error: "Access denied: Only hosts can view bookings",
        }),
        { status: 403 }
      );
    }

    console.log("Host ID from token:", hostId);

    // Hämta alla bokningar som är kopplade till denna värd (host)
    const bookings = await Booking.find({ host: hostId }).populate("guest");

    console.log("Bookings found:", bookings);

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    // Felsökningsloggning för att fånga och visa detaljer om felet
    console.error("Error fetching bookings for host:", error.message);
    console.error("Full error details:", error); // Visa hela felobjektet för mer information

    return new Response(
      JSON.stringify({ error: `Unable to fetch bookings: ${error.message}` }),
      { status: 500 }
    );
  }
}
